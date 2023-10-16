<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../stores/report-maker.store';
	import type { UpsertDataset } from '../../../trpc/routers/report.router';

	export let viewDataset: UpsertDataset | undefined;
	$: dbData = $reportMaker.dbDatas.find((dbd) => dbd.datasetId === viewDataset?.id);
	const closeModal = () => (viewDataset = undefined);
</script>

{#if viewDataset && dbData?.data}
	{@const { name } = viewDataset}
	<div class="modal modal-open">
		<div class="modal-box max-w-full">
			<div class="flex justify-between items-center mb-6">
				<div class="text-xl font-bold">{name}</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>
			<div class="overflow-x-auto border shadow rounded-lg">
				<table class="table table-xs">
					<thead>
						<tr>
							{#each Object.keys(dbData.data[0]) as key}
								<th>{key}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each dbData.data as data}
							<tr>
								{#each Object.values(data) as value}
									<td>{value}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
