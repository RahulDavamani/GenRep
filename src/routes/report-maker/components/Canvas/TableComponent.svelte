<script lang="ts">
	import type { UpsertTableComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';
	import { getComponentClass, getComponentStyle } from '$lib/data/componentTypes';

	export let view = false;
	export let tableComponent: UpsertTableComponent;
	$: ({ id, datasetId, label, columns, rows, properties } = tableComponent);
	$: ({ x, y, width, height, padding, opacity, bgColor, textColor, shadow, rounded, border, outline } = properties);
	$: ({
		upsertReport: { tableComponents },
		dbData
	} = $reportMaker);

	$: data = (() => {
		let data = dbData[datasetId ?? ''];
		if (rows !== '') {
			const [rowStart, rowEnd] = rows.split('-').map(Number);
			data = data?.slice(rowStart - 1, rowEnd);
		}
		data = data?.map((obj) =>
			columns.split(',').reduce(
				(filteredObj, key) => {
					filteredObj[key] = obj[key];
					return filteredObj;
				},
				{} as { [key: string]: unknown }
			)
		);
		return data;
	})();

	if (!view)
		onMount(() =>
			componentInteract(
				id,
				() => properties,
				(properties) =>
					($reportMaker.upsertReport.tableComponents = tableComponents.map((c) =>
						c.id === id ? { ...c, properties } : c
					))
			)
		);

	let innerWidth = 0;
	let element: HTMLDivElement | undefined;
	$: if (element) Object.assign(element.style, getComponentStyle(view, innerWidth, properties));
</script>

<svelte:window bind:innerWidth />

<div
	{id}
	class={getComponentClass(view, properties)}
	style="padding: {padding}px; opacity: {opacity / 100}"
	bind:this={element}
>
	<div class="text-lg font-semibold mb-2">{label}</div>
	<div class="overflow-x-auto border">
		{#if data}
			<table class="table table-xs">
				<thead class="bg-base-200">
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
		{/if}
	</div>
</div>
