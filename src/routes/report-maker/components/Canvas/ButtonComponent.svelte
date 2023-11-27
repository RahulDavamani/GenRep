<script lang="ts">
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentInteract } from '$lib/client/interact';
	import type { UpsertButtonComponent } from '$lib/reportSchema';
	import { getComponentClass, getComponentStyle } from '$lib/data/componentTypes';

	export let view = false;
	export let buttonComponent: UpsertButtonComponent;
	$: ({ id, datasetId, type, text, properties } = buttonComponent);
	$: ({
		upsertReport: { buttonComponents }
	} = $reportMaker);

	const buttonClick = () => {
		if (type === 'fetchAll') reportMaker.fetchAllDatasets();
		else if (datasetId) reportMaker.fetchDataset(datasetId);
	};

	if (!view)
		onMount(() =>
			componentInteract(
				id,
				() => properties,
				(properties) =>
					($reportMaker.upsertReport.buttonComponents = buttonComponents.map((c) =>
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
	<button class="btn" on:click={buttonClick}>{text}</button>
</div>
