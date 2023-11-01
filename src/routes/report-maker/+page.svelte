<script lang="ts">
	import Icon from '@iconify/svelte';
	import ReportForm from './components/ReportForm.svelte';
	import Datasets from './components/Datasets/Datasets.svelte';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../stores/report-maker.store.js';
	import Components from './components/UpsertComponent/Components.svelte';
	import ReportCanvas from './components/Canvas/ReportCanvas.svelte';

	export let data;
	let { report, theme } = data;

	let hideUI = false;

	onMount(() => reportMaker.init(report, theme));
</script>

{#if $reportMaker.init}
	<div class="px-8">
		<div class="flex items-center mb-8">
			<div class="w-full">
				<a href="/" class="btn btn-ghost">
					<Icon icon="mdi:chevron-left" width={22} /> Reports
				</a>
			</div>
			<div class="text-2xl font-semibold whitespace-nowrap">Report Maker</div>

			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div class="w-full flex justify-end">
				<div class="dropdown dropdown-end dropdown-hover">
					<div tabindex={0} class="btn btn-ghost btn-circle avatar p-1 items-center">
						<Icon icon="mdi:dots-vertical" width={28} />
					</div>
					<ul tabIndex={0} class="dropdown-content z-[50] menu gap-y-1 shadow bg-base-200 rounded-box w-60 p-3">
						<li>
							<button class="text-base font-bold py-4">
								<Icon icon="mdi:open-in-new" width={22} />
								View Report
							</button>
						</li>
						<li>
							<button class="text-base font-bold py-4" on:click={() => (hideUI = !hideUI)}>
								<Icon icon="mdi:eye-off" width={22} />
								Hide UI
								{#if hideUI}
									<Icon icon="mdi:check-bold" width={22} class="text-success" />
								{/if}
							</button>
						</li>
						<li>
							<button
								class="text-base font-bold py-4 text-success hover:text-success hover:bg-success-content"
								on:click={reportMaker.saveReport}
							>
								<Icon icon="mdi:content-save" width={22} />
								Save Report
							</button>
						</li>
						<li>
							<div class="text-base font-bold py-4 text-error hover:text-error hover:bg-error-content">
								<Icon icon="mdi:delete-forever" width={22} />
								Delete Report
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>

		{#if !hideUI}
			<div class="border shadow rounded-box py-2">
				<ReportForm />
				<div class="divider m-0" />
				<Datasets />
				<div class="divider m-0" />
				<Components />
			</div>
		{/if}

		<ReportCanvas />
	</div>
{/if}
