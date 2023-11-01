<script lang="ts">
	import type { UpsertTableComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';

	export let tableComponent: UpsertTableComponent;
	$: ({ id, datasetId, title, columns, rows, properties } = tableComponent);
	$: ({ x, y, width, height, bgColor, textColor, shadow, rounded, border, outline } = properties);
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

	let element: HTMLDivElement | undefined;
	$: if (element)
		Object.assign(element.style, {
			width: `${width}px`,
			height: `${height}px`,
			transform: `translate(${x}px, ${y}px)`
		});
</script>

<div
	{id}
	class="absolute flex flex-col justify-center items-center {bgColor} {textColor} {shadow} {rounded} 
   {border && 'border'} {outline && 'outline'}
   overflow-auto p-4 hover:outline hover:outline-1 hover:outline-blue-300 active:outline-blue-700"
	bind:this={element}
>
	<div class="text-lg font-semibold mb-2">{title}</div>
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
