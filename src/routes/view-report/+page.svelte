<script lang="ts">
	import { onMount } from 'svelte';
	import { reportMaker } from '../../stores/report-maker.store';
	import CardComponent from '../report-maker/components/Canvas/CardComponent.svelte';
	import { ui } from '../../stores/ui.store';
	import InputComponent from '../report-maker/components/Canvas/InputComponent.svelte';
	import TableComponent from '../report-maker/components/Canvas/TableComponent.svelte';

	export let data;
	$: ({ report } = data);
	$: ({ theme, inputComponents, cardComponents, tableComponents } = report);
	onMount(() => {
		setTimeout(() => ui.setTheme(theme), 1);
		reportMaker.init(report, theme);
		reportMaker.fetchAllDatasets();
	});
</script>

<div>
	{#each inputComponents as inputComponent}
		<InputComponent {inputComponent} view={true} />
	{/each}
	{#each cardComponents as cardComponent}
		<CardComponent {cardComponent} view={true} />
	{/each}
	{#each tableComponents as tableComponent}
		<TableComponent {tableComponent} view={true} />
	{/each}
</div>
