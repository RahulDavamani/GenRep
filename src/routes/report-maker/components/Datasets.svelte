<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { UpsertDataset, UpsertReport } from '../../../trpc/routers/report.router';
	import UpsertDatasetModal from './UpsertDatasetModal.svelte';
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import { databaseProviders } from '../../../data/databaseProviders';
	import { reportMaker, type DBData } from '../../../stores/report-maker.store';
	import { getQueryParams, highlightQueryParams } from '$lib/client/queryParams';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler } from '../../../trpc/trpcErrorhandler';
	import { ui } from '../../../stores/ui.store';
	import FetchQueryParams from './FetchQueryParams.svelte';
	import ViewDataset from './ViewDataset.svelte';

	$: ({ databases } = $page.data as PageData);
	$: ({ datasets } = $reportMaker.upsertReport);

	let upsertDataset: UpsertDataset | undefined;
	let fetchParamsDataset: UpsertDataset | undefined;
	let viewDataset: UpsertDataset | undefined;

	const showAddDatasetModal = () =>
		(upsertDataset = {
			id: undefined,
			databaseId: undefined,
			name: '',
			query: ''
		});

	const deleteDataset = (id: string) => ($reportMaker.upsertReport.datasets = datasets.filter((ds) => ds.id !== id));

	const fetchData = async (dataset: UpsertDataset) => {
		if (getQueryParams(dataset.query).length === 0) return queryData(dataset);
		else fetchParamsDataset = dataset;
	};

	const queryData = async ({ id, databaseId, name, query }: UpsertDataset) => {
		$ui.loader = { title: `Fetching Data of ${name}` };
		const { data } = await trpc($page)
			.database.queryData.query({ id: databaseId ?? '', query: query })
			.catch(trpcClientErrorHandler);

		let dbData: DBData = {
			datasetId: id ?? '',
			resultQuery: query,
			queryParams: {},
			data
		};
		let i = $reportMaker.dbDatas.findIndex((dbd) => dbd.datasetId === id);
		if (i >= 0) $reportMaker.dbDatas[i] = dbData;
		else $reportMaker.dbDatas = [...$reportMaker.dbDatas, dbData];
		$ui.loader = undefined;
	};
</script>

<div class="collapse collapse-arrow">
	<input type="checkbox" class="peer" checked={true} />
	<div class="collapse-title">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<Icon icon="material-symbols:data-table-outline-rounded" />
			Datasets: <span class="font-mono">({datasets.length})</span>
		</div>
	</div>
	<div class="collapse-content">
		<div class="overflow-x-auto rounded-lg shadow-sm px-1 mt-2">
			<table class="table">
				<thead class="bg-base-200">
					<tr>
						<th></th>
						<th>Name</th>
						<th>Database</th>
						<th>Query</th>
						<th>DB Data</th>
						<th colspan="2" class="text-end">
							<button class="btn btn-xs btn-success w-full" on:click={showAddDatasetModal}>
								<Icon icon="mdi:plus-circle" width={14} /> Create New Dataset
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each datasets as { id, name, databaseId, query }}
						{@const database = databases.find((db) => db.id === databaseId)}
						{@const providerName = databaseProviders.find((dp) => dp.client === database?.provider)?.name}
						{@const dbData = $reportMaker.dbDatas.find((dbd) => dbd.datasetId === id)}
						<tr>
							<td class="w-1">
								<button on:click={() => (upsertDataset = { id, name, databaseId, query })} class="flex">
									<Icon icon="mdi:square-edit-outline" width={20} class="text-info" />
								</button>
							</td>
							<td>{name}</td>
							<td>{database?.name} - {providerName}</td>
							<td>
								{@html highlightQueryParams(query)}
							</td>
							<td>
								{#if !dbData}
									<div class="badge badge-neutral w-full">Not Fetched</div>
								{:else}
									<button
										class="btn btn-xs btn-success w-full"
										on:click={() => (viewDataset = { id, name, databaseId, query })}>View Data</button
									>
								{/if}
							</td>
							<td class="w-44">
								<button
									class="btn btn-xs btn-primary w-full"
									on:click={() => fetchData({ id, name, databaseId, query })}
								>
									Fetch Data
								</button>
							</td>
							<td class="w-1">
								<button on:click={() => deleteDataset(id ?? '')}>
									<Icon icon="mdi:delete-forever" width={22} class="text-error" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<UpsertDatasetModal bind:upsertDataset />
<FetchQueryParams bind:fetchParamsDataset {queryData} />
<ViewDataset bind:viewDataset />
