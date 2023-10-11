<script lang="ts">
	import Icon from '@iconify/svelte';
	import UpsertApiKeyModal from './UpsertApiKeyModal.svelte';
	import type { UpsertApiKey } from '../(actions)/upsertApiKey';
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import { copyToClipboard } from '../../../utils/copyToClipboard';
	import { ui } from '../../../stores/ui.store';
	import type { DeleteApiKey } from '../(actions)/deleteApiKey';
	import { triggerAction } from '../../../utils/triggerAction';
	import type { ActionData } from '../$types';

	let upsertApiKey: UpsertApiKey | undefined;
	$: ({ apiKeys } = $page.data as PageData);
	$: form = $page.form as ActionData;

	let showKeys: string[] = [];

	const showDeleteKeyModal = (id: string) => {
		$ui.modal = {
			title: 'Are you sure to delete this key?',
			body: 'This will delete the key permanently. You cannot undo this action',
			actions: [
				{
					name: 'No',
					type: 'error'
				},
				{
					name: 'Yes',
					type: 'success',
					onClick: async () => {
						await triggerAction<DeleteApiKey>('/settings/?/deleteApiKey', { id });
						const errorMessage = form?.deleteApiKey?.errors.id?.join(' ');
						if (errorMessage) ui.showToast({ type: 'error', title: errorMessage });
						if (form?.deleteApiKey?.message) {
							ui.showToast({ type: 'success', title: 'API Key Successfully Deleted' });
							$ui.modal = undefined;
						}
					}
				}
			]
		};
	};
</script>

<div class="flex justify-between items-center px-8 mb-6">
	<div class="text-lg font-semibold">API Keys: <span>({apiKeys.length})</span></div>
	<button class="btn btn-sm btn-success" on:click={() => (upsertApiKey = { id: undefined, name: '' })}>
		<Icon icon="material-symbols:add-rounded" width={20} /> Add New Key
	</button>
</div>

<div class="px-8">
	<div class="overflow-x-auto rounded-lg shadow-sm">
		<table class="table">
			<thead class="bg-base-200">
				<tr>
					<th></th>
					<th>Name</th>
					<th>Key</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each apiKeys as apiKey}
					{@const { id, name } = apiKey}
					<tr>
						<td class="w-1">
							<button on:click={() => (upsertApiKey = { ...apiKey })} class="flex">
								<Icon icon="material-symbols:edit-rounded" width={20} class="text-info" />
							</button>
						</td>
						<th>{name}</th>
						<td class="flex items-center gap-4">
							{#if showKeys.includes(id)}
								{id}
								<button on:click={() => (showKeys = showKeys.filter((sk) => sk !== id))}>
									<Icon icon="material-symbols:visibility-rounded" width={16} />
								</button>
							{:else}
								################
								<button on:click={() => (showKeys = [...showKeys, id])}>
									<Icon icon="material-symbols:visibility-off-rounded" width={16} />
								</button>
							{/if}
							<button on:click={() => copyToClipboard(id)}>
								<Icon icon="material-symbols:content-copy-rounded" width={16} />
							</button>
						</td>
						<td class="w-1">
							<button on:click={() => showDeleteKeyModal(id)} class="flex">
								<Icon icon="material-symbols:delete-forever-rounded" width={22} class="text-error" />
							</button>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan={4} class="text-center py-5">There are API Keys found</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<UpsertApiKeyModal bind:upsertApiKey />
