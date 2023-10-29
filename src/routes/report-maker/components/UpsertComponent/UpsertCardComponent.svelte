<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { upsertCardComponentSchema, type UpsertCardComponent } from '$lib/reportSchema';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import PropertiesForm from './PropertiesForm.svelte';

	$: ({ upsertReport, dbData, upsertCardComponent } = $reportMaker);
	$: data = $reportMaker.dbData[$reportMaker.upsertCardComponent?.datasetId ?? ''];

	let zodErrors: TRPCZodErrors<UpsertCardComponent> | undefined;

	const closeModal = () => {
		$reportMaker.upsertCardComponent = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		const result = upsertCardComponentSchema.safeParse(upsertCardComponent);
		if (result.success) reportMaker.submitCardComponent();
		zodErrors = result.success
			? undefined
			: formatZodErrors<UpsertCardComponent>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if $reportMaker.upsertCardComponent}
	{@const { id } = $reportMaker.upsertCardComponent}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">
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
					bind:value={$reportMaker.upsertCardComponent.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Dataset</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertCardComponent.datasetId}>
					<option value="" selected disabled>Select an option</option>
					{#each Object.keys(dbData) as datasetId}
						{@const datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name}
						{#if datasetName}
							<option value={datasetId}>{datasetName}</option>
						{/if}
					{/each}
				</select>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold justify-start">
					Title
					<span class="ml-2 font-normal opacity-80">(optional)</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.title && 'input-error'}"
					bind:value={$reportMaker.upsertCardComponent.title}
				/>
				{#if zodErrors?.title}
					<div class="label text-xs text-error">{zodErrors.title.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Column Name</div>
				<select
					class="select select-bordered {(!data || zodErrors?.column) && 'select-error'}"
					bind:value={$reportMaker.upsertCardComponent.column}
				>
					<option value="" selected disabled>Select an option</option>
					{#if data}
						{#each Object.keys(data[0]) as column}
							<option value={column}>{column}</option>
						{/each}
					{/if}
				</select>
				{#if !data}
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
					bind:value={$reportMaker.upsertCardComponent.rowNumber}
				/>
				{#if zodErrors?.rowNumber}
					<div class="label text-xs text-error">{zodErrors.rowNumber.message}</div>
				{/if}
			</div>

			<PropertiesForm bind:properties={$reportMaker.upsertCardComponent.properties} />

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if id === ''}
						Create
					{:else}
						Update
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
