<script lang="ts">
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import CardComponent from './CardComponent.svelte';
	import { canvasInteract } from '$lib/client/interact';
	import TableComponent from './TableComponent.svelte';
	import InputComponent from './InputComponent.svelte';

	$: ({
		upsertReport: { theme, canvasHeight, inputComponents, cardComponents, tableComponents }
	} = $reportMaker);

	onMount(() => canvasInteract());

	let canvasElement: HTMLDivElement;
	$: if (canvasElement) canvasElement.style.height = `${canvasHeight}px`;
</script>

<div
	id="reportCanvas"
	class="border shadow rounded-lg w-[1000px] mt-8 mb-20 mx-auto"
	data-theme={theme}
	bind:this={canvasElement}
>
	{#each inputComponents as inputComponent}
		<InputComponent {inputComponent} />
	{/each}
	{#each cardComponents as cardComponent}
		<CardComponent {cardComponent} />
	{/each}
	{#each tableComponents as tableComponent}
		<TableComponent {tableComponent} />
	{/each}
</div>
