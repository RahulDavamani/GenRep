<script lang="ts">
	import Icon from '@iconify/svelte';
	import UpsertApiKeyModal from './UpsertApiKeyModal.svelte';
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import { ui } from '../../../stores/ui.store';
	import { copyToClipboard } from '$lib/client/copyToClipboard';
	import { invalidateAll } from '$app/navigation';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler } from '../../../trpc/trpcErrorhandler';
	import type { UpsertApiKey } from '../../../trpc/routers/apiKey.router';

	let upsertApiKey: UpsertApiKey | undefined;
	$: ({ apiKeys } = $page.data as PageData);

	let showKeys: string[] = [];

	const showDeleteKeyModal = (id: string) => {
		$ui.modal = {
			title: 'Are you sure to delete this key?',
			body: 'This will delete the key permanently. You cannot undo this action',
			actions: [
				{
					name: 'No',
					class: 'btn-error'
				},
				{
					name: 'Yes',
					class: 'btn-success',
					onClick: async () => {
						$ui.loader = { title: 'Deleting API Key' };
						await trpc($page).apiKey.delete.query({ id }).catch(trpcClientErrorHandler);
						ui.showToast({ class: 'alert-success', title: 'API Key Successfully Deleted' });
						invalidateAll();
						$ui.modal = undefined;
						$ui.loader = undefined;
					}
				}
			]
		};
	};
</script>

<div class="flex justify-between items-center mt-10 mb-6">
	<div class="flex gap-2 items-center text-lg font-semibold">
		<Icon icon="mdi:key" />
		API Keys: <span class="font-mono">({apiKeys.length})</span>
	</div>
	<button class="btn btn-sm btn-success" on:click={() => (upsertApiKey = { id: undefined, name: '' })}>
		<Icon icon="mdi:key-plus" width={20} /> Create API Key
	</button>
</div>

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
				<tr class="hover">
					<td class="w-1">
						<button on:click={() => (upsertApiKey = { ...apiKey })}>
							<Icon icon="mdi:square-edit-outline" width={20} class="text-info" />
						</button>
					</td>
					<th>{name}</th>
					<td class="flex items-center gap-4">
						{#if showKeys.includes(id)}
							{id}
							<button on:click={() => (showKeys = showKeys.filter((sk) => sk !== id))}>
								<Icon icon="mdi:eye" width={16} />
							</button>
						{:else}
							################
							<button on:click={() => (showKeys = [...showKeys, id])}>
								<Icon icon="mdi:eye-off" width={16} />
							</button>
						{/if}
						<button on:click={() => copyToClipboard(id)}>
							<Icon icon="material-symbols:content-copy-rounded" width={16} />
						</button>
					</td>
					<td class="w-1">
						<button on:click={() => showDeleteKeyModal(id)}>
							<Icon icon="mdi:delete-forever" width={22} class="text-error" />
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

<UpsertApiKeyModal bind:upsertApiKey />
