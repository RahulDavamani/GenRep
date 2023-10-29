import type { UpsertCardComponent, UpsertDataset, UpsertReport, UpsertTableComponent } from '$lib/reportSchema';
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
	upsertTableComponent?: UpsertTableComponent;
}

export const reportMaker = (() => {
	// State
	const { subscribe, set, update } = writable<ReportMaker>({
		init: false,
		upsertReport: {
			id: '',
			name: '',
			description: '',
			theme: '',
			canvasHeight: 0,
			datasets: [],
			cardComponents: [],
			tableComponents: []
		},
		zodErrors: undefined,
		showSelectTheme: false,

		upsertDataset: undefined,
		viewDatasetId: undefined,
		dbData: {},

		showComponentList: false,
		upsertCardComponent: undefined
	});

	const init = async (report: UpsertReport | undefined, theme: string) => {
		update((state) => ({
			...state,
			init: true,
			upsertReport: report ?? {
				id: '',
				name: '',
				description: '',
				theme,
				canvasHeight: 500,
				datasets: [],
				cardComponents: [],
				tableComponents: []
			}
		}));
		await fetchAllDatasets();
	};

	// Report
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

	// Dataset
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

	const fetchAllDatasets = async () => {
		const datasets = get(reportMaker).upsertReport.datasets;
		for (const { id } of datasets) await fetchDataset(id);
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
			},
			dbData: { ...state.dbData, [id]: undefined }
		}));

	// Card Component
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
					height: 200,
					bgColor: 'bg-base-100',
					textColor: 'text-base-content',
					shadow: 'shadow-none',
					rounded: 'rounded-2xl',
					border: true,
					outline: false
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
		if (upsertCardComponent?.id === '') {
			upsertCardComponent.id = nanoid();
			upsertCardComponent.properties.id = nanoid();
			updatedCardComponents = [...cardComponents, upsertCardComponent];
		} else
			updatedCardComponents = cardComponents.map((c) => (c.id === upsertCardComponent?.id ? upsertCardComponent : c));
		update((state) => ({
			...state,
			upsertReport: { ...state.upsertReport, cardComponents: updatedCardComponents },
			upsertCardComponent: undefined
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

	// Table Component
	const showAddTableComponentModal = () =>
		update((state) => ({
			...state,
			showComponentList: false,
			upsertTableComponent: {
				id: '',
				name: '',
				title: '',
				columns: '',
				rows: '',
				datasetId: undefined,
				properties: {
					id: '',
					x: 500,
					y: 0,
					width: 200,
					height: 200,
					bgColor: 'bg-base-100',
					textColor: 'text-base-content',
					shadow: 'shadow-base',
					rounded: 'rounded-2xl',
					border: true,
					outline: false
				}
			}
		}));

	const submitTableComponent = () => {
		const {
			upsertReport: { tableComponents },
			upsertTableComponent
		} = get(reportMaker);
		if (!upsertTableComponent) return;

		let updatedTableComponents: UpsertTableComponent[];
		if (upsertTableComponent?.id === '') {
			upsertTableComponent.id = nanoid();
			upsertTableComponent.properties.id = nanoid();
			updatedTableComponents = [...tableComponents, upsertTableComponent];
		} else
			updatedTableComponents = tableComponents.map((c) =>
				c.id === upsertTableComponent?.id ? upsertTableComponent : c
			);
		update((state) => ({
			...state,
			upsertReport: { ...state.upsertReport, tableComponents: updatedTableComponents },
			upsertTableComponent: undefined
		}));
	};

	const deleteTableComponent = (id: string) =>
		update((state) => ({
			...state,
			upsertReport: {
				...state.upsertReport,
				tableComponents: state.upsertReport.tableComponents.filter((ds) => ds.id !== id)
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
		fetchAllDatasets,
		fetchDataset,
		deleteDataset,
		showAddCardComponentModal,
		submitCardComponent,
		deleteCardComponent,
		showAddTableComponentModal,
		submitTableComponent,
		deleteTableComponent
	};
})();
