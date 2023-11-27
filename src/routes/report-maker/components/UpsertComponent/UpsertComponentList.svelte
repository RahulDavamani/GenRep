<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { componentTypesList } from '$lib/data/componentTypes';
</script>

{#if $reportMaker.showComponentList}
	<div class="modal modal-open">
		<div class="modal-box max-w-xs">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-semibold">Select Component</div>
				<button on:click={() => ($reportMaker.showComponentList = false)}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="flex flex-col gap-4">
				{#each componentTypesList as { labels: { key, Key }, client: { icon } }}
					<button
						class="btn rounded-box text-xl justify-start normal-case"
						on:click={() => reportMaker.showAddComponentModal(key)}
					>
						<Icon {icon} />
						{Key}
					</button>
				{/each}

				<div class="btn rounded-box text-xl justify-start normal-case">
					<Icon icon="mdi:chart-bar" /> Bar Graph
				</div>
				<div class="btn rounded-box text-xl justify-start normal-case">
					<Icon icon="mdi:chart-pie" /> Pie Chart
				</div>
			</div>
		</div>
	</div>
{/if}
