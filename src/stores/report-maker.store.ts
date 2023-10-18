import type { UpsertCardComponent, UpsertDataset, UpsertReport } from '$lib/reportSchema';
import { get, writable } from 'svelte/store';
import { trpcClientErrorHandler, type TRPCZodErrors } from '../trpc/trpcErrorhandler';
import { trpc } from '../trpc/client';
import { ui } from './ui.store';
import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { getQueryParams, replaceQueryParams } from '$lib/client/queryParams';
import { nanoid } from 'nanoid';

export interface DBData {
	[key: string]: { [key: string]: unknown }[] | undefined;
}

export interface ReportMaker {
	init: boolean;
	upsertReport: UpsertReport;
	zodErrors?: TRPCZodErrors<UpsertReport>;
	showSelectTheme: boolean;

	upsertDataset?: UpsertDataset;
	viewDatasetId?: string;
	dbData: DBData;

	showComponentList: boolean;
	upsertCardComponent?: UpsertCardComponent;
}

export const reportMaker = (() => {
	const { subscribe, set, update } = writable<ReportMaker>({
		init: false,
		upsertReport: {
			id: '',
			name: '',
			description: '',
			theme: '',
			canvasHeight: 0,
			datasets: [],
			cardComponents: []
		},
		zodErrors: undefined,
		showSelectTheme: false,

		upsertDataset: undefined,
		viewDatasetId: undefined,
		dbData: {},

		showComponentList: false,
		upsertCardComponent: undefined
	});

	const init = (report: UpsertReport | undefined, theme: string) => {
		let upsertReport: UpsertReport;
		if (report) {
			const { id, name, description, theme, canvasHeight, datasets, cardComponents } = report;
			upsertReport = { id, name, description, theme, canvasHeight, datasets, cardComponents };
		} else
			upsertReport = {
				id: '',
				name: '',
				description: '',
				theme,
				canvasHeight: 500,
				datasets: [],
				cardComponents: []
			};

		update((state) => ({ ...state, init: true, upsertReport }));
	};

	const saveReport = async () => {
		const $page = get(page);
		const { upsertReport } = get(reportMaker);
		ui.setLoader({ title: 'Saving Report' });
		await trpc($page)
			.report.save.query(upsertReport)
			.catch((e) =>
				trpcClientErrorHandler<UpsertReport>(e, (e) => update((state) => ({ ...state, zodErrors: e.zodErrors })))
			);

		ui.showToast({
			class: 'alert-success',
			title: 'Report Updated Successfully'
		});
		invalidateAll();
		ui.setLoader();
	};

	const showAddDatasetModal = () =>
		update((state) => ({
			...state,
			upsertDataset: {
				id: '',
				databaseId: undefined,
				name: '',
				query: '',
				queryParams: []
			}
		}));

	const watchQueryParams = (query: string) => {
		const { upsertDataset } = get(reportMaker);
		if (!upsertDataset) return;
		const queryParams = getQueryParams(query).map((key) => {
			const queryParam = upsertDataset?.queryParams.find((qp) => qp.key === key);
			return (
				queryParam ?? {
					id: nanoid(),
					key,
					value: ''
				}
			);
		});
		update((state) => ({ ...state, upsertDataset: { ...upsertDataset, queryParams } }));
	};

	const submitDataset = () => {
		const {
			upsertReport: { datasets },
			upsertDataset
		} = get(reportMaker);
		if (!upsertDataset) return;

		let updatedDatasets: UpsertDataset[];
		if (upsertDataset?.id === '') {
			upsertDataset.id = nanoid();
			updatedDatasets = [...datasets, upsertDataset];
		} else updatedDatasets = datasets.map((ds) => (ds.id === upsertDataset?.id ? upsertDataset : ds));
		update((state) => ({
			...state,
			upsertReport: { ...state.upsertReport, datasets: updatedDatasets },
			upsertDataset: undefined
		}));
	};

	const fetchDataset = async (id: string) => {
		ui.setLoader({ title: 'Fetching Dataset' });
		const $page = get(page);

		const dataset = get(reportMaker).upsertReport.datasets.find((d) => d.id === id);
		if (!dataset) return;

		const { databaseId, query, queryParams } = dataset;
		if (!databaseId) return ui.showToast({ class: 'alert-error', title: 'Database not found' });

		const resultQuery = replaceQueryParams(query, queryParams);
		const { data } = await trpc($page)
			.database.queryData.query({ id: databaseId, query: resultQuery })
			.catch(trpcClientErrorHandler);

		update((state) => ({ ...state, dbData: { ...state.dbData, [id]: data } }));
		ui.setLoader();
	};

	const deleteDataset = (id: string) =>
		update((state) => ({
			...state,
			upsertReport: {
				...state.upsertReport,
				datasets: state.upsertReport.datasets.filter((d) => d.id !== id)
			}
		}));

	const showAddCardComponentModal = () =>
		update((state) => ({
			...state,
			showComponentList: false,
			upsertCardComponent: {
				id: '',
				name: '',
				title: '',
				column: '',
				rowNumber: 1,
				datasetId: undefined,
				properties: {
					id: '',
					x: 500,
					y: 0,
					width: 200,
					height: 200
				}
			}
		}));

	const submitCardComponent = () => {
		const {
			upsertReport: { cardComponents },
			upsertCardComponent
		} = get(reportMaker);
		if (!upsertCardComponent) return;

		let updatedCardComponents: UpsertCardComponent[];
		if (upsertCardComponent?.id === '')
			updatedCardComponents = cardComponents.map((ds) =>
				ds.id === upsertCardComponent?.id ? upsertCardComponent : ds
			);
		else {
			upsertCardComponent.id = nanoid();
			upsertCardComponent.properties.id = nanoid();
			updatedCardComponents = [...cardComponents, upsertCardComponent];
		}
		update((state) => ({
			...state,
			upsertReport: { ...state.upsertReport, cardComponents: updatedCardComponents },
			upsertDataset: undefined
		}));
	};

	const deleteCardComponent = (id: string) =>
		update((state) => ({
			...state,
			upsertReport: {
				...state.upsertReport,
				cardComponents: state.upsertReport.cardComponents.filter((ds) => ds.id !== id)
			}
		}));

	return {
		subscribe,
		set,
		update,
		init,
		saveReport,
		showAddDatasetModal,
		watchQueryParams,
		submitDataset,
		fetchDataset,
		deleteDataset,
		showAddCardComponentModal,
		submitCardComponent,
		deleteCardComponent
	};
})();
