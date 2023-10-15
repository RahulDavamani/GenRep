<script lang="ts">
	import Icon from '@iconify/svelte';
	import { trpc } from '../../trpc/client.js';
	import { page } from '$app/stores';
	import { trpcClientErrorHandler, type TRPCZodErrors } from '../../trpc/trpcErrorhandler.js';
	import { ui } from '../../stores/ui.store.js';
	import { invalidateAll } from '$app/navigation';
	import ReportForm from './components/ReportForm.svelte';

	export let data;
	let {
		report: { id, name, theme, description }
	} = data;
	let zodErrors: TRPCZodErrors | undefined;

	const save = async () => {
		$ui.loader = { title: 'Saving Report' };
		await trpc($page)
			.report.save.query({ id, name, theme, description })
			.catch((e) => {
				zodErrors = trpcClientErrorHandler(e, { throwError: false }).zodErrors;
				throw e;
			});

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
		<ReportForm bind:name bind:description bind:theme {zodErrors} />

		<div class="flex border rounded-b-box">
			<div class="border-r w-full p-2 h-20">Datasets</div>
			<div class="w-full p-2 h-20">Components</div>
		</div>
	</div>
	<!-- <div class=" border mt-5 shadow rounded-box p-2 h-full">hello</div> -->
</div>
