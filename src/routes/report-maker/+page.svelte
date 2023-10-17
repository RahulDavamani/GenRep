<script lang="ts">
	import Icon from '@iconify/svelte';
	import { trpc } from '../../trpc/client.js';
	import { page } from '$app/stores';
	import { trpcClientErrorHandler, type TRPCZodErrors } from '../../trpc/trpcErrorhandler.js';
	import { ui } from '../../stores/ui.store.js';
	import { invalidateAll } from '$app/navigation';
	import ReportForm from './components/ReportForm.svelte';
	import Datasets from './components/Datasets/Datasets.svelte';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../stores/report-maker.store.js';
	import Components from './components/ReportComponents/Components.svelte';
	import ReportCanvas from './components/ReportCanvas.svelte';
	import type { UpsertReport } from '$lib/reportSchema.js';

	export let data;
	let { report } = data;
	let zodErrors: TRPCZodErrors<UpsertReport> | undefined;

	onMount(async () => {
		$reportMaker = {
			upsertReport: {
				id: report.id,
				name: report.name,
				description: report.description,
				theme: report.theme,
				datasets: report.datasets,
				cardComponents: report.cardComponents
			},
			dbDatas: []
		};
	});

	const save = async () => {
		$ui.loader = { title: 'Saving Report' };
		await trpc($page)
			.report.save.query($reportMaker.upsertReport)
			.catch((e) => trpcClientErrorHandler<UpsertReport>(e, (e) => (zodErrors = e.zodErrors)));

		ui.showToast({
			class: 'alert-success',
			title: 'Report Updated Successfully'
		});
		invalidateAll();
		$ui.loader = undefined;
	};
</script>

<div class="px-8">
	<div class="flex justify-between mb-8">
		<a href="/" class="btn btn-ghost">
			<Icon icon="mdi:chevron-left" width={22} /> Reports
		</a>
		<div class="text-2xl font-semibold">Report Maker</div>
		<button class="btn btn-success" on:click={save}>
			<Icon icon="mdi:content-save" width={20} /> Save
		</button>
	</div>
	<div class="border shadow rounded-box">
		<ReportForm {zodErrors} />
		<div class="divider m-0" />
		<Datasets />
		<div class="divider m-0" />
		<Components />
	</div>

	<ReportCanvas />
</div>
