<script lang="ts">
	import type { UpsertCardComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';

	export let view = false;
	export let cardComponent: UpsertCardComponent;
	$: ({ id, datasetId, label, column, rowNumber, properties } = cardComponent);
	$: ({ x, y, width, height, bgColor, textColor, shadow, rounded, border, outline } = properties);
	$: ({
		upsertReport: { cardComponents },
		dbData
	} = $reportMaker);

	$: data = dbData[datasetId ?? '']?.[rowNumber - 1][column];

	if (!view)
		onMount(() =>
			componentInteract(
				id,
				() => properties,
				(properties) =>
					($reportMaker.upsertReport.cardComponents = cardComponents.map((c) =>
						c.id === id ? { ...c, properties } : c
					))
			)
		);

	let innerWidth = 0;
	let element: HTMLDivElement | undefined;
	$: if (element)
		Object.assign(element.style, {
			width: `${view ? (width / 1000) * innerWidth : width}px`,
			height: `${view ? (height / 1000) * innerWidth : height}px`,
			transform: `translate(${view ? (x / 1000) * innerWidth : x}px, ${view ? (y / 1000) * innerWidth : y}px)`
		});
</script>

<svelte:window bind:innerWidth />

<div
	{id}
	class="absolute flex flex-col justify-center items-center {bgColor} {textColor} {shadow} {rounded} 
   {border && 'border'} {outline && 'outline'}
   overflow-auto p-4 hover:outline hover:outline-1 hover:outline-blue-300 active:outline-blue-700"
	bind:this={element}
>
	<div class="text-lg font-semibold">{label}</div>
	<div>{data}</div>
</div>
