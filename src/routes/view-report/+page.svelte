<script lang="ts">
	import { onMount } from 'svelte';
	import { reportMaker } from '../../stores/report-maker.store';
	import { ui } from '../../stores/ui.store';
	import ReportCanvas from '../report-maker/components/Canvas/ReportCanvas.svelte';

	export let data;
	onMount(() => {
		setTimeout(() => ui.setTheme(data.report.theme), 1);
		reportMaker.init(data.report, data.report.theme);
		reportMaker.fetchAllDatasets();
	});
</script>

<ReportCanvas view={true} />
