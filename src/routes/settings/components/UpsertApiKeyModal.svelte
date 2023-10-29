<script lang="ts">
	import Icon from '@iconify/svelte';
	import { ui } from '../../../stores/ui.store';
	import { trpcClientErrorHandler, trpcErrorhandler, type TRPCZodErrors } from '../../../trpc/trpcErrorhandler';
	import { trpc } from '../../../trpc/client';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { UpsertApiKey } from '../../../trpc/routers/apiKey.router';

	export let upsertApiKey: UpsertApiKey | undefined;
	let zodErrors: TRPCZodErrors<UpsertApiKey> | undefined;

	const closeModal = () => {
		upsertApiKey = undefined;
		zodErrors = undefined;
	};
	const submit = async () => {
		$ui.loader = { title: upsertApiKey?.id ? 'Updating API Key' : 'Creating API Key ' };
		if (!upsertApiKey) return;

		await trpc($page)
			.apiKey.upsert.query(upsertApiKey)
			.catch((e) => trpcClientErrorHandler<UpsertApiKey>(e, (e) => (zodErrors = e.zodErrors)));

		ui.showToast({
			class: 'alert-success',
			title: upsertApiKey?.id ? 'API Key Updated Successfully' : 'API Key Created Successfully'
		});
		invalidateAll();
		closeModal();
		$ui.loader = undefined;
	};
</script>

{#if upsertApiKey}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-bold">
					{#if upsertApiKey.id}
						Update API Key
					{:else}
						Create New API Key
					{/if}
				</div>
				<button on:click={closeModal}>
					<Icon icon="mdi:close" class="cursor-pointer text-error" width={20} />
				</button>
			</div>

			<div class="form-control">
				<div class="label font-semibold">Name</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.name && 'input-error'}"
					bind:value={upsertApiKey.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="modal-action">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if upsertApiKey.id}
						Update
					{:else}
						Create
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
