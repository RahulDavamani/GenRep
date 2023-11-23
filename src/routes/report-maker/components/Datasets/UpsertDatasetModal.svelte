<script lang="ts">
	import Icon from '@iconify/svelte';
	import { formatZodErrors, type TRPCZodError, type TRPCZodErrors } from '../../../../trpc/trpcErrorhandler';
	import { page } from '$app/stores';
	import type { PageData } from '../../$types';
	import { reportMaker } from '../../../../stores/report-maker.store';
	import { upsertDatasetSchema, type UpsertDataset } from '$lib/reportSchema';
	import { replaceQueryParams } from '$lib/client/queryParams';
	import { databaseProviders } from '$lib/data/databaseProviders';

	$: ({ databases } = $page.data as PageData);
	$: ({ upsertDataset } = $reportMaker);

	let zodErrors: TRPCZodErrors<UpsertDataset> | undefined;

	const closeModal = () => {
		$reportMaker.upsertDataset = undefined;
		zodErrors = undefined;
	};

	const submit = () => {
		const result = upsertDatasetSchema.safeParse(upsertDataset);
		if (result.success) reportMaker.submitDataset();
		zodErrors = result.success ? undefined : formatZodErrors<UpsertDataset>(result.error.errors as TRPCZodError[]);
	};
</script>

{#if upsertDataset && $reportMaker.upsertDataset}
	{@const { query, queryParams } = upsertDataset}
	<div class="modal modal-open">
		<div class="modal-box max-w-xl">
			<div class="flex justify-between items-center mb-4">
				<div class="text-lg font-bold">Dataset</div>
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
					bind:value={$reportMaker.upsertDataset.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Database</div>
				<select class="select select-bordered" bind:value={$reportMaker.upsertDataset.databaseId}>
					{#each databases as { id, name, provider }}
						{@const providerName = databaseProviders.find((dp) => dp.client === provider)?.name}
						<option value={id}>{name} - {providerName}</option>
					{/each}
				</select>
			</div>

			<div class="form-control mb-1">
				<div class="label font-semibold">Query</div>
				<textarea
					placeholder="E.g. SELECT {'${columns}'} FROM {'${table}'}"
					class="textarea textarea-bordered {zodErrors?.query && 'textarea-error'}"
					on:keyup={(e) => reportMaker.watchQueryParams(e.currentTarget.value)}
					bind:value={$reportMaker.upsertDataset.query}
				/>

				<span class="label text-xs">
					Form query parameters by incorporating them within curly braces {'`${}`'}
				</span>
				{#if zodErrors?.query}
					<div class="label text-xs text-error">{zodErrors.query.message}</div>
				{/if}
			</div>

			<div class="font-semibold ml-1 mt-1">Query Params:</div>

			<div class="grid grid-cols-2 gap-x-6 gap-y-1">
				{#each queryParams as { key }, i}
					<div class="form-control flex-grow">
						<div class="label">{key}</div>
						<input
							type="text"
							placeholder="Type here"
							class="input input-sm input-bordered"
							bind:value={$reportMaker.upsertDataset.queryParams[i].value}
						/>
					</div>
				{:else}
					<div class="ml-1">No Params found in Query</div>
				{/each}
			</div>

			<div class="mx-1 mt-4">
				<div class="font-semibold">Result Query:</div>
				{@html replaceQueryParams(query, queryParams, true)}
			</div>

			<div class="modal-action mt-6">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>Save</button>
			</div>
		</div>
	</div>
{/if}
