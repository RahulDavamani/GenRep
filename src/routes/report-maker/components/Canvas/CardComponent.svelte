<script lang="ts">
	import type { UpsertCardComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';

	export let cardComponent: UpsertCardComponent;
	$: ({ id, datasetId, title, column, rowNumber, properties } = cardComponent);
	$: ({ x, y, width, height, bgColor, textColor, shadow, rounded, border, outline } = properties);
	$: ({
		upsertReport: { cardComponents },
		dbData
	} = $reportMaker);
	$: data = dbData[datasetId ?? '']?.[rowNumber - 1][column];

	onMount(() =>
		componentInteract(
			id,
			() => properties,
			(properties) =>
				($reportMaker.upsertReport.cardComponents = cardComponents.map((c) => (c.id === id ? { ...c, properties } : c)))
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
	<div class="text-lg font-semibold">{title}</div>
	<div>{data}</div>
</div>
