import { writable } from 'svelte/store';
import type { UpsertReport } from '../trpc/routers/report.router';

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
			id: undefined,
			name: '',
			description: '',
			theme: '',
			datasets: []
		},
		dbDatas: []
	});

	return { subscribe, set, update };
})();
