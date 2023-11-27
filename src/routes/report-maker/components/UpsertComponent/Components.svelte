<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import ComponentList from './UpsertComponentList.svelte';
	import UpsertCardComponent from './UpsertCardComponent.svelte';
	import UpsertTableComponent from './UpsertTableComponent.svelte';
	import cloneDeep from 'lodash.clonedeep';
	import UpsertInputComponent from './UpsertInputComponent.svelte';
	import { componentTypesList, type GetValueFunc, type UpsertComponent } from '$lib/data/componentTypes';

	$: componentValues = componentTypesList.flatMap(
		({ labels: { key, keyComponents, upsertKeyComponent }, client: { getValues } }) =>
			$reportMaker.upsertReport[keyComponents].flatMap((component) => ({
				key,
				values: (getValues as GetValueFunc<typeof key>)(component),
				editFn: () => {
					// $reportMaker[upsertKeyComponent] = cloneDeep(component as UpsertComponent<typeof key>);
					switch (key) {
						case 'input':
							$reportMaker.upsertInputComponent = cloneDeep(component as UpsertComponent<'input'>);
							break;
						case 'card':
							$reportMaker.upsertCardComponent = cloneDeep(component as UpsertComponent<'card'>);
							break;
						case 'table':
							$reportMaker.upsertTableComponent = cloneDeep(component as UpsertComponent<'table'>);
							break;
					}
				},
				deleteFn: () => reportMaker.deleteComponent(key, component.id)
			}))
	);
</script>

<div class="collapse collapse-arrow">
	<input type="checkbox" class="peer" checked={true} />
	<div class="collapse-title">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<Icon icon="mdi:view-dashboard-outline" />
			Components: <span class="font-mono">({componentValues.length})</span>
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
					{#each componentValues as { values: { key, name, datasetId, values }, editFn, deleteFn }}
						{@const datasetName = $reportMaker.upsertReport.datasets.find((d) => d.id === datasetId)?.name}
						<tr class="hover">
							<td>
								<button on:click={editFn}>
									<Icon icon="mdi:square-edit-outline" width={22} class="text-info" />
								</button>
							</td>
							<td class="font-semibold">{name}</td>
							<td>{key[0].toUpperCase() + key.slice(1)}</td>
							<td>{datasetName ?? 'N/A'}</td>
							<td class="space-x-4">
								{#each Object.entries(values) as [key, value]}
									<span>
										<span class="font-semibold">{key}:</span>
										{value}
									</span>
								{/each}
							</td>
							<td class="w-1">
								<button on:click={deleteFn}>
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

<ComponentList />

<UpsertInputComponent />
<UpsertCardComponent />
<UpsertTableComponent />
