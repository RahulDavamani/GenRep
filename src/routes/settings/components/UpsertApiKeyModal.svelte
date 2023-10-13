<script lang="ts">
	import Icon from '@iconify/svelte';
	import { ui } from '../../../stores/ui.store';
	import { trpcErrorhandler, type TRPCZodErrors } from '../../../trpc/trpcErrorhandler';
	import { trpc } from '../../../trpc/client';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import type { UpsertApiKey } from '../../../trpc/routers/apiKey.router';

	export let upsertApiKey: UpsertApiKey | undefined;
	let errors: TRPCZodErrors = {};

	const closeModal = () => {
		upsertApiKey = undefined;
		errors = {};
	};
	const submit = async () => {
		$ui.loader = { title: upsertApiKey?.id ? 'Updating API Key' : 'Adding API Key ' };
		try {
			if (!upsertApiKey) return;
			await trpc($page).apiKey.upsert.query(upsertApiKey);
			ui.showToast({
				class: 'alert-success',
				title: upsertApiKey?.id ? 'API Key Updated Successfully' : 'API Key Added Successfully'
			});
			invalidateAll();
			closeModal();
		} catch (e) {
			const { code, message, zodErrors } = trpcErrorhandler(e);
			ui.showToast({ class: 'alert-error', title: `${code}: ${message}` });
			errors = zodErrors ?? {};
		}
		$ui.loader = undefined;
	};
</script>

{#if upsertApiKey}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-semibold">
					{#if upsertApiKey.id}
						Update Key
					{:else}
						Add Key
					{/if}
				</div>
				<button on:click={closeModal}>
					<Icon icon="material-symbols:close" class="cursor-pointer text-error" width="20" />
				</button>
			</div>
			<div class="form-control">
				<div class="label font-semibold">Name</div>
				<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={upsertApiKey.name} />
				{#if errors.name}
					<div class="label text-xs text-error">{errors.name.message}</div>
				{/if}
			</div>
			<div class="modal-action">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if upsertApiKey.id}
						Update
					{:else}
						Add
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
