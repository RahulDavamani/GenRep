<script lang="ts">
	import { reportMaker } from '../../../stores/report-maker.store';
	import CardComponent from './ReportComponents/CardComponent.svelte';

	$: ({
		upsertReport: { theme, canvasHeight, cardComponents }
	} = $reportMaker);
	let canvasElement: HTMLDivElement;
	$: if (canvasElement) canvasElement.style.height = `${canvasHeight}px`;
</script>

<div
	class="report-canvas border shadow rounded-lg w-[1000px] mt-8 mb-20 mx-auto"
	data-theme={theme}
	bind:this={canvasElement}
>
	{#each cardComponents as cardComponent}
		<CardComponent {cardComponent} />
	{/each}
</div>
