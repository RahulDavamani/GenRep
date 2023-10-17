<script lang="ts">
	import Icon from '@iconify/svelte';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import { page } from '$app/stores';
	import type { PageData } from '../../$types';
	import { databaseProviders } from '../../../../data/databaseProviders';
	import { nanoid } from 'nanoid';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { getQueryParams } from '$lib/client/queryParams';
	import { upsertDatasetSchema, type UpsertDataset } from '$lib/reportSchema';

	export let upsertDataset: UpsertDataset | undefined;

	$: ({ databases } = $page.data as PageData);

	let zodErrors: TRPCZodErrors<UpsertDataset> | undefined;

	$: queryParams = getQueryParams(upsertDataset?.query ?? '');

	const closeModal = () => {
		upsertDataset = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		const result = upsertDatasetSchema.safeParse(upsertDataset);

		if (result.success) {
			if (upsertDataset?.id)
				$reportMaker.upsertReport.datasets = $reportMaker.upsertReport.datasets.map((ds) =>
					ds.id === upsertDataset?.id ? result.data : ds
				);
			else {
				result.data.id = nanoid();
				$reportMaker.upsertReport.datasets = [...$reportMaker.upsertReport.datasets, result.data];
			}
			closeModal();
		} else zodErrors = formatZodErrors<UpsertDataset>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if upsertDataset}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-lg font-semibold">
					{#if upsertDataset.id === ''}
						Create New Dataset
					{:else}
						Update Dataset
					{/if}
				</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Name</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.name && 'input-error'}"
					bind:value={upsertDataset.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Database</div>
				<select class="select select-bordered" bind:value={upsertDataset.databaseId}>
					{#each databases as { id, name, provider }}
						{@const providerName = databaseProviders.find((dp) => dp.client === provider)?.name}
						<option value={id}>{name} - {providerName}</option>
					{/each}
				</select>
			</div>

			<div class="form-control mb-1">
				<div class="label">
					<div class="font-semibold">Query</div>
				</div>
				<textarea
					placeholder="Type here"
					class="textarea textarea-bordered {zodErrors?.query && 'textarea-error'}"
					bind:value={upsertDataset.query}
				/>

				<span class="label text-xs">
					Form query parameters by incorporating them within curly braces {'`${}`'}
				</span>
				{#if zodErrors?.query}
					<div class="label text-xs text-error">{zodErrors.query.message}</div>
				{/if}
			</div>

			<div class="flex flex-wrap items-center gap-4">
				<div class="label font-semibold">Query Params:</div>
				{#each queryParams as param}
					<div class="border shadow rounded-lg px-2">{param}</div>
				{:else}
					<div>No Params found in Query</div>
				{/each}
			</div>

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if upsertDataset.id === ''}
						Create
					{:else}
						Update
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
