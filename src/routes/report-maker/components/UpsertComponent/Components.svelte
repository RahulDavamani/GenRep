<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import ComponentList from './UpsertComponentList.svelte';
	import UpsertCardComponent from './UpsertCardComponent.svelte';
	import UpsertTableComponent from './UpsertTableComponent.svelte';
	import { deepClone } from '$lib/client/deepClone';

	$: ({
		upsertReport: { datasets, cardComponents, tableComponents }
	} = $reportMaker);
	$: allComponents = [...cardComponents, ...tableComponents];

	const getComponentValues = (id: string) => {
		let i: number;
		i = cardComponents.findIndex((c) => c.id === id);
		if (i >= 0) {
			const { id, name, datasetId, title, column, rowNumber, properties } = cardComponents[i];
			return {
				id,
				datasetId,
				name,
				properties,
				values: { Title: title, Column: column, ['Row Number']: rowNumber },
				editFn: () => ($reportMaker.upsertCardComponent = deepClone(cardComponents[i]))
			};
		}
		i = tableComponents.findIndex((c) => c.id === id);
		if (i >= 0) {
			const { id, name, datasetId, title, columns, rows, properties } = tableComponents[i];
			return {
				id,
				datasetId,
				name,
				properties,
				values: { Title: title, Columns: columns, ['Rows']: rows },
				editFn: () => ($reportMaker.upsertTableComponent = deepClone(tableComponents[i]))
			};
		}
	};
</script>

<div class="collapse collapse-arrow">
	<input type="checkbox" class="peer" checked={true} />
	<div class="collapse-title">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<Icon icon="mdi:view-dashboard-outline" />
			Components: <span class="font-mono">({allComponents.length})</span>
			<button class="z-10 text-success" on:click={() => ($reportMaker.showComponentList = true)}>
				<Icon icon="mdi:add-circle" width={24} />
			</button>
		</div>
	</div>
	<div class="collapse-content">
		<div class="overflow-x-auto rounded-lg shadow-sm px-1 mt-2">
			<table class="table">
				<thead class="bg-base-200">
					<tr>
						<th></th>
						<th>Name</th>
						<th>Component Type</th>
						<th>Datasets</th>
						<th>Values</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each allComponents as { id }}
						{@const component = getComponentValues(id)}
						{#if component}
							{@const { id, datasetId, name, values, editFn } = component}
							{@const datasetName = datasets.find((d) => d.id === datasetId)?.name}
							<tr class="hover">
								<td>
									<button on:click={editFn}>
										<Icon icon="mdi:square-edit-outline" width={22} class="text-info" />
									</button>
								</td>
								<td class="font-semibold">{name}</td>
								<td>Card</td>
								<td>{datasetName}</td>
								<td class="space-x-4">
									{#each Object.entries(values) as [key, value]}
										<span>
											<span class="font-semibold">{key}:</span>
											{value}
										</span>
									{/each}
								</td>
								<td class="w-1">
									<button on:click={() => reportMaker.deleteCardComponent(id)}>
										<Icon icon="mdi:delete-forever" width={22} class="text-error" />
									</button>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<ComponentList />
<UpsertCardComponent />
<UpsertTableComponent />
