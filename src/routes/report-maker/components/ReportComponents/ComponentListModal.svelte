<script lang="ts">
	import type { UpsertCardComponent } from '$lib/reportSchema';
	import Icon from '@iconify/svelte';

	export let showComponentList: boolean;
	export let upsertCardComponent: UpsertCardComponent | undefined;

	const closeModal = () => (showComponentList = false);
	const createCardComponent = () => {
		upsertCardComponent = {
			id: '',
			name: '',
			title: '',
			column: '',
			rowNumber: 1,
			datasetId: undefined,
			properties: {
				id: '',
				x: 500,
				y: 0,
				width: 200,
				height: 200
			}
		};
		closeModal();
	};
</script>

{#if showComponentList}
	<div class="modal modal-open">
		<div class="modal-box max-w-xs">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-semibold">Select Component</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="flex flex-col gap-4">
				<button class="btn rounded-box text-xl justify-start normal-case" on:click={createCardComponent}>
					<Icon icon="mdi:card-text" /> Card
				</button>
				<div class="btn rounded-box text-xl justify-start normal-case">
					<Icon icon="mdi:table" /> Table
				</div>
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
