<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import ComponentListModal from './ComponentListModal.svelte';
	import UpsertCardComponentModal from './UpsertCardComponentModal.svelte';
	import type { UpsertCardComponent } from '$lib/reportSchema';

	$: ({
		upsertReport: { datasets, cardComponents }
	} = $reportMaker);
	$: allComponents = cardComponents;

	let showComponentList = false;
	let upsertCardComponent: UpsertCardComponent | undefined;

	const deleteCardComponent = (id: string) =>
		($reportMaker.upsertReport.cardComponents = cardComponents.filter((ds) => ds.id !== id));
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
							<button class="btn btn-xs btn-success w-full" on:click={() => (showComponentList = true)}>
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
									on:click={() => (upsertCardComponent = { id, name, datasetId, title, column, rowNumber, properties })}
								>
									<Icon icon="mdi:square-edit-outline" width={22} class="text-info" />
								</button>
							</td>
							<td class="font-bold">{name}</td>
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
								<button on:click={() => deleteCardComponent(id)}>
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

<ComponentListModal bind:showComponentList bind:upsertCardComponent />
<UpsertCardComponentModal bind:upsertCardComponent />
