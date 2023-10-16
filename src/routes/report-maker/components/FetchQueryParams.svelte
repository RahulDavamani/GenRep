<script lang="ts">
	import { getQueryParamsObj, highlightQueryParams, replaceQueryParams } from '$lib/client/queryParams';
	import Icon from '@iconify/svelte';
	import type { UpsertDataset } from '../../../trpc/routers/report.router';

	export let fetchParamsDataset: UpsertDataset | undefined;
	export let queryData: (dataset: UpsertDataset) => Promise<void>;

	let queryParams: { [key: string]: string } | undefined;
	$: if (fetchParamsDataset && !queryParams) queryParams = getQueryParamsObj(fetchParamsDataset.query);

	const closeModal = () => {
		fetchParamsDataset = undefined;
		queryParams = undefined;
	};

	const fetchData = async () => {
		if (!fetchParamsDataset || !queryParams) return;
		const query = replaceQueryParams(fetchParamsDataset?.query, queryParams);
		await queryData({ ...fetchParamsDataset, query });
		closeModal();
	};
</script>

{#if fetchParamsDataset && queryParams}
	{@const { name, query } = fetchParamsDataset}
	<div class="modal modal-open">
		<div class="modal-box max-w-full">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">{name}</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="flex justify-between items-center mb-2">
				<div class="text-xl font-bold">
					Query Params:
					<span class="font-mono">({Object.keys(queryParams).length})</span>
				</div>
			</div>

			<div>
				<span class="font-semibold text-lg mr-2">Query:</span>
				{@html highlightQueryParams(query)}
			</div>

			{#if Object.keys(queryParams).length === 0}
				<div class="mb-2">No Params found in Query</div>
			{:else}
				<div class="grid grid-cols-3 gap-x-10">
					{#each Object.keys(queryParams) as qp}
						<div class="form-control">
							<div class="label font-semibold">{qp}</div>
							<input type="text" placeholder="Type here" class="input input-bordered" bind:value={queryParams[qp]} />
						</div>
					{/each}
				</div>
			{/if}
			<div class="flex justify-end mt-6">
				<button class="btn btn-primary" on:click={fetchData}>Fetch Data</button>
			</div>
		</div>
	</div>
{/if}
