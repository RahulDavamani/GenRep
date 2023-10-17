import type { UpsertReport } from '$lib/reportSchema';
import { writable } from 'svelte/store';

export interface DBData {
	datasetId: string;
	queryParams: { [key: string]: string };
	resultQuery: string;
	data?: { [key: string]: unknown }[];
}

export interface ReportMaker {
	upsertReport: UpsertReport;
	dbDatas: DBData[];
}

export const reportMaker = (() => {
	const { subscribe, set, update } = writable<ReportMaker>({
		upsertReport: {
			id: '',
			name: '',
			description: '',
			theme: '',
			datasets: [],
			cardComponents: []
		},
		dbDatas: []
	});

	return { subscribe, set, update };
})();
