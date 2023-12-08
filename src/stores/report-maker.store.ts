import type { UpsertDataset, UpsertReport } from '$lib/reportSchema';
import { get, writable } from 'svelte/store';
import { trpcClientErrorHandler, type TRPCZodErrors } from '../trpc/trpcErrorhandler';
import { trpc } from '../trpc/client';
import { ui } from './ui.store';
import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import { getQueryParams, replaceQueryParams } from '$lib/client/queryParams';
import { nanoid } from 'nanoid';
import cloneDeep from 'lodash.clonedeep';
import {
	componentTypes,
	type ComponentKey,
	componentTypesList,
	type ComponentType,
	type UpsertComponents
} from '../lib/data/componentTypes';

export interface DBData {
	[key: string]: { [key: string]: unknown }[] | undefined;
}

export type ReportMaker = {
	init: boolean;
	upsertReport: UpsertReport;
	zodErrors?: TRPCZodErrors<UpsertReport>;
	showSelectTheme: boolean;

	upsertDataset?: UpsertDataset;
	viewDatasetId?: string;
	dbData: DBData;

	showComponentList: boolean;
} & UpsertComponents;

export const reportMaker = (() => {
	const newReport: UpsertReport = (() => {
		const components = Object.fromEntries(componentTypesList.map((ct) => [ct.labels.keyComponents, []])) as {
			[k in ComponentType<ComponentKey>['labels']['keyComponents']]: [];
		};
		return {
			id: nanoid(),
			name: '',
			description: '',
			theme: '',
			canvasHeight: 500,
			datasets: [],
			...components
		};
	})();

	// State
	const { subscribe, set, update } = writable<ReportMaker>({
		init: false,
		upsertReport: cloneDeep(newReport),
		showSelectTheme: false,
		dbData: {},
		showComponentList: false
	});

	const init = async (report: UpsertReport | undefined, theme: string) => {
		update((state) => ({
			...state,
			init: true,
			upsertReport: report ?? { ...newReport, theme },
			zodErrors: undefined
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
				id: nanoid(),
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
			const queryParam = upsertDataset.queryParams.find((qp) => qp.key === key);
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

		const i = datasets.findIndex((c) => c.id === upsertDataset.id);
		if (i < 0) datasets.push(upsertDataset);
		else datasets[i] = upsertDataset;
		update((state) => ({
			...state,
			upsertReport: { ...state.upsertReport, datasets },
			upsertDataset: undefined
		}));
	};

	const fetchAllDatasets = async () => {
		const datasets = get(reportMaker).upsertReport.datasets;
		for (const { id } of datasets) await fetchDataset(id);
	};

	const fetchDataset = async (id: string) => {
		const $page = get(page);

		const dataset = get(reportMaker).upsertReport.datasets.find((d) => d.id === id);

		if (!dataset) return;
		ui.setLoader({ title: `Fetching Dataset: ${dataset?.name}` });

		const { databaseId, query, queryParams } = dataset;
		if (!databaseId) return ui.showToast({ class: 'alert-error', title: 'Database not found' });

		const resultQuery = replaceQueryParams(query, queryParams);
		const { data } = await trpc($page)
			.database.queryData.query({ id: databaseId, query: resultQuery })
			.catch((e) =>
				trpcClientErrorHandler(e, () => update((state) => ({ ...state, dbData: { ...state.dbData, [id]: undefined } })))
			);

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

	const showAddComponentModal = (type: ComponentKey) =>
		update((state) => ({
			...state,
			showComponentList: false,
			[componentTypes[type].labels.upsertKeyComponent]: cloneDeep({
				...componentTypes[type].client.newComponent,
				id: nanoid()
			})
		}));

	const submitComponent = (type: ComponentKey) =>
		update((state) => {
			const {
				labels: { keyComponents, upsertKeyComponent }
			} = componentTypes[type];
			const components = state.upsertReport[keyComponents];
			const upsertComponent = state[upsertKeyComponent];
			if (!upsertComponent) return state;

			const i = components.findIndex((c) => c.id === upsertComponent?.id);
			if (i <= 0) components[components.length] = upsertComponent;
			else components[i] = upsertComponent;

			return {
				...state,
				upsertReport: { ...state.upsertReport, [keyComponents]: components },
				[upsertKeyComponent]: undefined
			};
		});

	const deleteComponent = (type: ComponentKey, id: string) =>
		update((state) => ({
			...state,
			upsertReport: {
				...state.upsertReport,
				[`${type}Components`]: state.upsertReport[`${type}Components`].filter((c) => c.id !== id)
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
		showAddComponentModal,
		deleteComponent,
		submitComponent
	};
})();
