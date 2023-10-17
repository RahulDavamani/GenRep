<script lang="ts">
	import { upsertCardComponentSchema, type UpsertCardComponent } from '$lib/reportSchema';
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { nanoid } from 'nanoid';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';

	export let upsertCardComponent: UpsertCardComponent | undefined;

	$: ({ dbDatas, upsertReport } = $reportMaker);
	$: dbData = dbDatas.find((d) => d.datasetId === upsertCardComponent?.datasetId);

	let zodErrors: TRPCZodErrors<UpsertCardComponent> | undefined;

	const closeModal = () => (upsertCardComponent = undefined);

	const submit = () => {
		const result = upsertCardComponentSchema.safeParse(upsertCardComponent);

		if (result.success) {
			if (upsertCardComponent?.id)
				$reportMaker.upsertReport.cardComponents = upsertReport.cardComponents.map((ds) =>
					ds.id === upsertCardComponent?.id ? result.data : ds
				);
			else {
				result.data.id = nanoid();
				result.data.properties.id = nanoid();
				$reportMaker.upsertReport.cardComponents = [...upsertReport.cardComponents, result.data];
			}
			closeModal();
		} else zodErrors = formatZodErrors<UpsertCardComponent>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if upsertCardComponent}
	{@const { id, name, title, column, rowNumber, datasetId } = upsertCardComponent}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-semibold">
					{#if id === ''}
						Create Card Component
					{:else}
						Update Card Component
					{/if}
				</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Component Name</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.name && 'input-error'}"
					bind:value={upsertCardComponent.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Dataset</div>
				<select class="select select-bordered" bind:value={upsertCardComponent.datasetId}>
					<option value="" selected disabled>Select an option</option>
					{#each dbDatas as { datasetId, data }}
						{#if data}
							{@const datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name}
							<option value={datasetId}>{datasetName}</option>
						{/if}
					{/each}
				</select>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Title</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.title && 'input-error'}"
					bind:value={upsertCardComponent.title}
				/>
				{#if zodErrors?.title}
					<div class="label text-xs text-error">{zodErrors.title.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Column Name</div>
				<select
					class="select select-bordered {zodErrors?.column && 'select-error'}"
					bind:value={upsertCardComponent.column}
				>
					<option value="" selected disabled>Select an option</option>
					{#if dbData?.data}
						{#each Object.keys(dbData.data[0]) as column}
							<option value={column}>{column}</option>
						{/each}
					{/if}
				</select>
				{#if !dbData}
					<div class="label text-xs text-error">Select a dataset to get columns</div>
				{/if}
				{#if zodErrors?.column}
					<div class="label text-xs text-error">{zodErrors.column.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Row Number</div>
				<input
					type="number"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.rowNumber && 'input-error'}"
					bind:value={upsertCardComponent.rowNumber}
				/>
				{#if zodErrors?.rowNumber}
					<div class="label text-xs text-error">{zodErrors.rowNumber.message}</div>
				{/if}
			</div>

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if upsertCardComponent.id === ''}
						Create
					{:else}
						Update
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
