<script lang="ts">
	import type { UpsertCardComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';
	import { getComponentClass, getComponentStyle } from '$lib/data/componentTypes';

	export let view = false;
	export let cardComponent: UpsertCardComponent;
	$: ({ id, datasetId, label, column, rowNumber, properties } = cardComponent);
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
	$: if (element) Object.assign(element.style, getComponentStyle(view, innerWidth, properties));
</script>

<svelte:window bind:innerWidth />

<div {id} class={getComponentClass(view, properties)} bind:this={element}>
	<div class="text-lg font-semibold">{label}</div>
	<div>{data}</div>
</div>
