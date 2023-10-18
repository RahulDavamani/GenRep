<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../stores/report-maker.store';

	$: ({
		upsertReport: { datasets },
		dbData,
		viewDatasetId
	} = $reportMaker);
	$: dataset = datasets.find((d) => d.id === viewDatasetId);
	$: data = dbData[viewDatasetId ?? ''];
</script>

{#if dataset && data}
	{@const { name } = dataset}
	<div class="modal modal-open">
		<div class="modal-box max-w-full">
			<div class="flex justify-between items-center mb-6">
				<div class="text-xl font-bold">{name}</div>
				<button on:click={() => ($reportMaker.viewDatasetId = undefined)}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>
			<div class="overflow-x-auto border shadow rounded-lg">
				<table class="table table-xs">
					<thead>
						<tr>
							{#each Object.keys(data[0]) as key}
								<th>{key}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each data as row}
							<tr class="hover">
								{#each Object.values(row) as value}
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
