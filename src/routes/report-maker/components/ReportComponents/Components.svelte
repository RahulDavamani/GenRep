<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import ComponentListModal from './ComponentListModal.svelte';
	import UpsertCardComponentModal from './UpsertCardComponentModal.svelte';

	$: ({
		upsertReport: { datasets, cardComponents }
	} = $reportMaker);
	$: allComponents = cardComponents;

	$: ({ showComponentList, upsertCardComponent } = $reportMaker);
</script>

<div class="collapse collapse-arrow">
	<input type="checkbox" class="peer" checked={true} />
	<div class="collapse-title">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<Icon icon="mdi:view-dashboard-outline" />
			Components: <span class="font-mono">({allComponents.length})</span>
		</div>
	</div>
	<div class="collapse-content">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Component Type</th>
						<th>Datasets</th>
						<th>Values</th>
						<th colspan="2">
							<button class="btn btn-xs btn-success w-full" on:click={() => ($reportMaker.showComponentList = true)}>
								<Icon icon="mdi:plus-circle" width={14} /> Create New Component
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{#each cardComponents as { id, name, datasetId, title, column, rowNumber, properties }}
						{@const datasetName = datasets.find((d) => d.id === datasetId)?.name}
						<tr class="hover">
							<td>
								<button
									on:click={() =>
										($reportMaker.upsertCardComponent = { id, name, datasetId, title, column, rowNumber, properties })}
								>
									<Icon icon="mdi:square-edit-outline" width={22} class="text-info" />
								</button>
							</td>
							<td class="font-semibold">{name}</td>
							<td>Card</td>
							<td>{datasetName}</td>
							<td class="space-x-4">
								<span>
									<span class="font-semibold">Title:</span>
									{title}
								</span>
								<span>
									<span class="font-semibold">Column:</span>
									{column}
								</span>
								<span>
									<span class="font-semibold">Row Number:</span>
									{rowNumber}
								</span>
							</td>
							<td class="w-44">
								<button class="btn btn-xs btn-primary w-full"> Hide Component </button>
							</td>
							<td class="w-1">
								<button on:click={() => reportMaker.deleteCardComponent(id)}>
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

<ComponentListModal />
<UpsertCardComponentModal />
