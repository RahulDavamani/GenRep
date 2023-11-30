<script lang="ts">
	import Icon from '@iconify/svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { upsertInputComponentSchema, type UpsertInputComponent } from '$lib/reportSchema';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import PropertiesForm from './PropertiesForm.svelte';
	import { inputComponentTypes } from '$lib/data/inputComponentTypes';

	$: ({ upsertReport } = $reportMaker);

	let zodErrors: TRPCZodErrors<UpsertInputComponent> | undefined;

	$: if ($reportMaker.upsertInputComponent)
		if (['select', 'checkbox', 'toggle'].includes($reportMaker.upsertInputComponent.type)) {
			if ($reportMaker.upsertInputComponent.valueType === undefined) {
				$reportMaker.upsertInputComponent.valueType = 'values';
				$reportMaker.upsertInputComponent.values = '';
			}
		} else {
			$reportMaker.upsertInputComponent.valueType = undefined;
			$reportMaker.upsertInputComponent.values = undefined;
		}

	const closeModal = () => {
		$reportMaker.upsertInputComponent = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		const result = upsertInputComponentSchema.safeParse($reportMaker.upsertInputComponent);
		if (result.success) reportMaker.submitComponent('input');
		zodErrors = result.success
			? undefined
			: formatZodErrors<UpsertInputComponent>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if $reportMaker.upsertInputComponent}
	{@const { valueType, values } = $reportMaker.upsertInputComponent}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">Input Component</div>
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
					bind:value={$reportMaker.upsertInputComponent.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Query Param</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertInputComponent.queryParamId}>
					<option value="" selected disabled>Select an option</option>

					{#each upsertReport.datasets as { name, queryParams }}
						{#each queryParams as { id, key }}
							<option value={id}>{name} - {key}</option>
						{/each}
					{/each}
				</select>
				{#if zodErrors?.queryParamId}
					<div class="label text-xs text-error">{zodErrors.queryParamId.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold justify-start">
					Label
					<span class="ml-2 font-normal opacity-80">(optional)</span>
				</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.label && 'input-error'}"
					bind:value={$reportMaker.upsertInputComponent.label}
				/>
				{#if zodErrors?.label}
					<div class="label text-xs text-error">{zodErrors.label.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Input Type</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertInputComponent.type}>
					{#each Object.entries(inputComponentTypes) as [key, value]}
						<option value={key}>{value}</option>
					{/each}
				</select>
				{#if zodErrors?.type}
					<div class="label text-xs text-error">{zodErrors.type.message}</div>
				{/if}
			</div>

			{#if valueType}
				<div class="tabs mt-8 mb-4">
					<button
						class="tab tab-bordered w-1/2 text-lg font-semibold
                  {valueType === 'values' && 'tab-active'}"
						on:click={() => {
							if ($reportMaker.upsertInputComponent) $reportMaker.upsertInputComponent.valueType = 'values';
						}}
					>
						Values
					</button>
					<button
						class="tab tab-bordered w-1/2 text-lg font-semibold
                  {valueType === 'query' && 'tab-active'}"
						on:click={() => {
							if ($reportMaker.upsertInputComponent) $reportMaker.upsertInputComponent.valueType = 'query';
						}}
					>
						Query
					</button>
				</div>

				{#if valueType === 'values'}
					<div class="form-control">
						<div class="label font-semibold">Values</div>
						<textarea
							placeholder="Type here"
							class="textarea textarea-bordered {zodErrors?.values && 'input-error'}"
							bind:value={$reportMaker.upsertInputComponent.values}
						/>
						<div class="label text-xs">
							Enter values as comma separated
							{#if ['checkbox', 'toggle'].includes($reportMaker.upsertInputComponent.type)}
								(first value will be used as true value and second value will be used as false value)
							{/if}
						</div>
						{#if zodErrors?.values}
							<div class="label text-xs text-error">{zodErrors.values.message}</div>
						{/if}
					</div>
				{:else if valueType === 'query'}
					<div class="form-control">
						<div class="label font-semibold">Query</div>
						<textarea
							placeholder="Type here"
							class="textarea textarea-bordered {zodErrors?.values && 'input-error'}"
							bind:value={$reportMaker.upsertInputComponent.values}
						/>
						<div class="label text-xs">
							Enter SQL query to fetch values (Takes the values of the first column
							{#if ['checkbox', 'toggle'].includes($reportMaker.upsertInputComponent.type)}
								and first value will be used as true value and second value will be used as false value)
							{/if}
							)
						</div>
						{#if zodErrors?.values}
							<div class="label text-xs text-error">{zodErrors.values.message}</div>
						{/if}
					</div>
				{/if}
			{/if}

			<PropertiesForm bind:properties={$reportMaker.upsertInputComponent.properties} />

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>Submit</button>
			</div>
		</div>
	</div>
{/if}
