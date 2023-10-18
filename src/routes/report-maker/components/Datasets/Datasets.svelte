<script lang="ts">
	import Icon from '@iconify/svelte';
	import UpsertDatasetModal from './UpsertDatasetModal.svelte';
	import { page } from '$app/stores';
	import type { PageData } from '../../$types';
	import { databaseProviders } from '../../../../data/databaseProviders';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { highlightQueryParams, replaceQueryParams } from '$lib/client/queryParams';
	import ViewDataset from '../ViewDataset.svelte';

	$: ({ databases } = $page.data as PageData);
	$: ({ datasets } = $reportMaker.upsertReport);
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
						<th colspan="2">
							<button class="btn btn-xs btn-success w-full" on:click={reportMaker.showAddDatasetModal}>
								<Icon icon="mdi:plus-circle" width={14} /> Create New Dataset
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each datasets as { id, name, databaseId, query, queryParams }}
						{@const database = databases.find((db) => db.id === databaseId)}
						{@const providerName = databaseProviders.find((dp) => dp.client === database?.provider)?.name}
						{@const resultQuery = replaceQueryParams(query, queryParams, true)}
						<tr>
							<td class="w-1">
								<button
									on:click={() => ($reportMaker.upsertDataset = { id, name, databaseId, query, queryParams })}
									class="flex"
								>
									<Icon icon="mdi:square-edit-outline" width={20} class="text-info" />
								</button>
							</td>
							<td class="font-semibold">{name}</td>
							<td>{database?.name} - {providerName}</td>
							<td>{@html resultQuery}</td>
							<td>
								{#if !$reportMaker.dbData[id]}
									<div class="badge badge-neutral w-full">Not Fetched</div>
								{:else}
									<button class="btn btn-xs btn-success w-full" on:click={() => ($reportMaker.viewDatasetId = id)}>
										View Data
									</button>
								{/if}
							</td>
							<td class="w-44">
								<button class="btn btn-xs btn-primary w-full" on:click={() => reportMaker.fetchDataset(id)}>
									Fetch Data
								</button>
							</td>
							<td class="w-1">
								<button on:click={() => reportMaker.deleteDataset(id ?? '')}>
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

<UpsertDatasetModal />
<ViewDataset />
