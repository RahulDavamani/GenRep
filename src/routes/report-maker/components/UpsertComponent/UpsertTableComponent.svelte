<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { upsertTableComponentSchema, type UpsertTableComponent } from '$lib/reportSchema';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import PropertiesForm from './PropertiesForm.svelte';

	$: ({ upsertReport, dbData, upsertTableComponent } = $reportMaker);
	$: data = $reportMaker.dbData[$reportMaker.upsertTableComponent?.datasetId ?? ''];

	let zodErrors: TRPCZodErrors<UpsertTableComponent> | undefined;

	let columns: string[] = upsertTableComponent?.columns.split(',') ?? [];
	$: allColumns = data && Object.keys(data[0]).join() === columns.join();

	const closeModal = () => {
		$reportMaker.upsertTableComponent = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		if (!upsertTableComponent) return;
		upsertTableComponent.columns = columns.join(',');
		const result = upsertTableComponentSchema.safeParse(upsertTableComponent);
		if (result.success) reportMaker.submitTableComponent();
		zodErrors = result.success
			? undefined
			: formatZodErrors<UpsertTableComponent>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if $reportMaker.upsertTableComponent}
	{@const { id } = $reportMaker.upsertTableComponent}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">
					{#if id === ''}
						Create Table Component
					{:else}
						Update Table Component
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
					bind:value={$reportMaker.upsertTableComponent.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Dataset</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertTableComponent.datasetId}>
					<option value="" selected disabled>Select an option</option>
					{#each Object.keys(dbData) as datasetId}
						{@const datasetName = upsertReport.datasets.find((d) => d.id === datasetId)?.name}
						<option value={datasetId}>{datasetName}</option>
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
					bind:value={$reportMaker.upsertTableComponent.title}
				/>
				{#if zodErrors?.title}
					<div class="label text-xs text-error">{zodErrors.title.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1 mt-2">
				<div class="label">
					<div class="font-semibold">Column Name</div>
					<button
						class="btn btn-xs btn-outline {allColumns ? 'btn-error' : 'btn-primary'}"
						on:click={() => {
							if (data) columns = allColumns ? [] : Object.keys(data[0]);
						}}
					>
						{allColumns ? 'Remove all columns' : 'Select all columns'}
					</button>
				</div>
				<select
					class="select select-bordered h-80 {(!data || zodErrors?.columns) && 'select-error'}"
					bind:value={columns}
					multiple
				>
					{#if data}
						{#each Object.keys(data[0]) as column}
							<option value={column}>{column}</option>
						{/each}
					{/if}
				</select>
				{#if !data}
					<div class="label text-xs text-error">Select a dataset to get columns</div>
				{/if}
				{#if zodErrors?.columns}
					<div class="label text-xs text-error">{zodErrors.columns.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold justify-start">
					Row Range
					<span class="ml-2 font-normal opacity-80">(optional)</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.rows && 'input-error'}"
					bind:value={$reportMaker.upsertTableComponent.rows}
				/>
				{#if zodErrors?.rows}
					<div class="label text-xs text-error">{zodErrors.rows.message}</div>
				{/if}
				<span class="label text-xs">
					Enter a specific range in this format 1-100, or leave it empty to select all rows.
				</span>
			</div>

			<PropertiesForm bind:properties={$reportMaker.upsertTableComponent.properties} />

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
