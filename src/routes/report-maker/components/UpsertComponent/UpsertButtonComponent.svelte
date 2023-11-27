<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import PropertiesForm from './PropertiesForm.svelte';
	import { upsertButtonComponentSchema, type UpsertButtonComponent } from '$lib/reportSchema';
	import { buttonComponentTypes } from '$lib/data/buttonComponentTypes';

	$: ({ upsertReport, dbData, upsertButtonComponent } = $reportMaker);

	let zodErrors: TRPCZodErrors<UpsertButtonComponent> | undefined;

	const closeModal = () => {
		$reportMaker.upsertButtonComponent = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		const result = upsertButtonComponentSchema.safeParse(upsertButtonComponent);
		if (result.success) reportMaker.submitComponent('button');
		zodErrors = result.success
			? undefined
			: formatZodErrors<UpsertButtonComponent>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if $reportMaker.upsertButtonComponent}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">Button Component</div>
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
					bind:value={$reportMaker.upsertButtonComponent.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Dataset</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertButtonComponent.datasetId}>
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
				<div class="label font-semibold">Type</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertButtonComponent.type}>
					<option value="" selected disabled>Select an option</option>
					{#each Object.entries(buttonComponentTypes) as [key, value]}
						<option value={key}>{value}</option>
					{/each}
				</select>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold justify-start">
					Text
					<span class="ml-2 font-normal opacity-80">(optional)</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.text && 'input-error'}"
					bind:value={$reportMaker.upsertButtonComponent.text}
				/>
				{#if zodErrors?.text}
					<div class="label text-xs text-error">{zodErrors.text.message}</div>
				{/if}
			</div>

			<PropertiesForm bind:properties={$reportMaker.upsertButtonComponent.properties} />

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>Submit</button>
			</div>
		</div>
	</div>
{/if}
