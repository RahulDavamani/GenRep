<script lang="ts">
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import CardComponent from './CardComponent.svelte';
	import { canvasInteract } from '$lib/client/interact';
	import TableComponent from './TableComponent.svelte';
	import InputComponent from './InputComponent.svelte';

	export let view = false;
	$: ({
		upsertReport: { theme, canvasHeight, inputComponents, cardComponents, tableComponents }
	} = $reportMaker);

	onMount(() => {
		if (!view) canvasInteract();
	});

	let canvasElement: HTMLDivElement;
	$: if (!view && canvasElement) canvasElement.style.height = `${canvasHeight}px`;
</script>

<div
	id="reportCanvas"
	class={view ? '' : 'border shadow rounded-lg w-[1000px] mt-8 mb-20 mx-auto'}
	data-theme={theme}
	bind:this={canvasElement}
>
	{#each inputComponents as inputComponent}
		<InputComponent {inputComponent} {view} />
	{/each}
	{#each cardComponents as cardComponent}
		<CardComponent {cardComponent} {view} />
	{/each}
	{#each tableComponents as tableComponent}
		<TableComponent {tableComponent} {view} />
	{/each}
</div>
