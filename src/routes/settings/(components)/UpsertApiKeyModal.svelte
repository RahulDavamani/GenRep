<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { UpsertApiKey } from '../(actions)/upsertApiKey';
	import { triggerAction } from '../../../utils/triggerAction';
	import { page } from '$app/stores';
	import type { ActionData } from '../$types';
	import { ui } from '../../../stores/ui.store';

	export let upsertApiKey: UpsertApiKey | undefined;
	$: form = $page.form as ActionData;

	const closeModal = () => {
		upsertApiKey = undefined;
		if (form?.upsertApiKey) form.upsertApiKey.errors = {};
	};
	const submit = async () => {
		await triggerAction<UpsertApiKey>('/settings/?/upsertApiKey', upsertApiKey);
		if (form?.upsertApiKey?.message) {
			ui.showToast({
				type: 'success',
				title: upsertApiKey?.id ? 'API Updated Successfully' : 'API Key Added Successfully'
			});
			closeModal();
		}
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
				{#if form?.upsertApiKey?.errors?.name}
					<div class="label text-xs text-error">{form.upsertApiKey.errors.name}</div>
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
