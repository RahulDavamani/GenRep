<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import type { PageData } from '../$types';
	import { ui } from '../../../stores/ui.store';
	import UpsertDatabaseModal from './UpsertDatabaseModal.svelte';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler, trpcErrorhandler } from '../../../trpc/trpcErrorhandler';
	import { invalidateAll } from '$app/navigation';
	import type { UpsertDatabase } from '../../../trpc/routers/database.router';
	import { databaseProviders } from '../../../data/databaseProviders';

	let upsertDatabase: UpsertDatabase | undefined;
	$: ({ databases } = $page.data as PageData);

	const defaultConnectionOption: UpsertDatabase['connectionOption'] = {
		host: '',
		port: 1433,
		databaseName: '',
		username: '',
		password: ''
	};

	const showAddDatabaseModal = () =>
		(upsertDatabase = {
			id: undefined,
			name: '',
			provider: 'pg',
			connectionType: 'STRING',
			connectionString: '',
			connectionOption: { ...defaultConnectionOption }
		});

	const showUpdateDatabaseModal = (db: PageData['databases'][number]) => {
		const { connectionString, connectionOption } = db;
		upsertDatabase = {
			...db,
			connectionString: connectionString ?? '',
			connectionOption: connectionOption ?? { ...defaultConnectionOption }
		};
	};

	const showDeleteDatabaseModal = (id: string) => {
		$ui.modal = {
			title: 'Are you sure to delete this database?',
			body: 'This will delete the database permanently. You cannot undo this action',
			actions: [
				{
					name: 'No',
					class: 'btn-error'
				},
				{
					name: 'Yes',
					class: 'btn-success',
					onClick: async () => {
						$ui.loader = { title: 'Deleting Database' };
						await trpc($page).database.delete.query({ id }).catch(trpcClientErrorHandler);
						ui.showToast({ class: 'alert-success', title: 'Database Successfully Deleted' });
						invalidateAll();
						$ui.modal = undefined;
						$ui.loader = undefined;
					}
				}
			]
		};
	};

	const testConnection = async (id: string) => {
		$ui.loader = { title: 'Testing Database Connection' };
		await trpc($page).database.testConnection.query({ id }).catch(trpcClientErrorHandler);
		ui.showToast({ class: 'alert-success', title: 'Database connection is successful' });
		$ui.loader = undefined;
	};
</script>

<div class="flex justify-between items-center mb-6">
	<div class="flex gap-2 items-center text-lg font-semibold">
		<Icon icon="mdi:database" />
		Databases: <span class="font-mono">({databases.length})</span>
	</div>
	<button class="btn btn-sm btn-success" on:click={showAddDatabaseModal}>
		<Icon icon="mdi:database-plus" width={20} /> Add Database
	</button>
</div>

<div class="overflow-x-auto rounded-lg shadow-sm">
	<table class="table">
		<thead class="bg-base-200">
			<tr>
				<th></th>
				<th>Name</th>
				<th>Provider</th>
				<th>Connection Type</th>
				<th></th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each databases as db}
				{@const { id, name, provider, connectionType, connectionString, connectionOption } = db}
				{@const providerName = databaseProviders.find((dbp) => dbp.client === provider)?.name}
				<tr class="hover">
					<td class="w-1">
						<button on:click={() => showUpdateDatabaseModal(db)}>
							<Icon icon="mdi:square-edit-outline" width={20} class="text-info" />
						</button>
					</td>
					<th>{name}</th>
					<td>{providerName}</td>
					<td>{connectionType}</td>
					<td class="w-52">
						<button class="btn btn-xs btn-primary" on:click={() => testConnection(id)}>
							<Icon icon="tabler:plug-connected" width={16} />
							Test Connection
						</button>
					</td>
					<td class="w-1">
						<button on:click={() => showDeleteDatabaseModal(id)}>
							<Icon icon="mdi:delete-forever" width={22} class="text-error" />
						</button>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan={6} class="text-center py-5">There are Databases found</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<UpsertDatabaseModal bind:upsertDatabase />
