<script lang="ts">
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler, trpcErrorhandler, type TRPCZodErrors } from '../../../trpc/trpcErrorhandler';
	import { ui } from '../../../stores/ui.store';
	import { invalidateAll } from '$app/navigation';
	import type { UpsertDatabase } from '../../../trpc/routers/database.router';
	import { databaseProviders } from '../../../data/databaseProviders';

	export let upsertDatabase: UpsertDatabase | undefined;
	let zodErrors: TRPCZodErrors | undefined;
	$: connectionOptionZodErrors = zodErrors?.connectionOption as TRPCZodErrors | undefined;

	const closeModal = () => {
		upsertDatabase = undefined;
		zodErrors = undefined;
	};

	const submit = async () => {
		$ui.loader = { title: upsertDatabase?.id ? 'Updating Database' : 'Adding Database ' };
		if (!upsertDatabase) return;
		await trpc($page)
			.database.upsert.query({
				...upsertDatabase,
				connectionString:
					upsertDatabase.connectionType === 'STRING' ? upsertDatabase.connectionString ?? undefined : undefined,
				connectionOption:
					upsertDatabase.connectionType === 'OPTIONS' ? upsertDatabase.connectionOption ?? undefined : undefined
			})
			.catch((e) => {
				zodErrors = trpcClientErrorHandler(e, { throwError: false }).zodErrors;
				throw e;
			});

		ui.showToast({
			class: 'alert-success',
			title: upsertDatabase.id ? 'Database Updated Successfully' : 'Database Added Successfully'
		});
		invalidateAll();
		closeModal();
		$ui.loader = undefined;
	};
</script>

{#if upsertDatabase}
	<div class="modal modal-open">
		<div class="modal-box">
			<div class="flex justify-between items-center mb-4">
				<div class="text-xl font-semibold">
					{#if upsertDatabase.id}
						Update Database
					{:else}
						Add Database
					{/if}
				</div>
				<button on:click={closeModal}>
					<Icon icon="material-symbols:close" class="cursor-pointer text-error" width="20" />
				</button>
			</div>

			<!-- Name -->
			<div class="form-control">
				<div class="label font-semibold">Name</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered w-full"
					bind:value={upsertDatabase.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<!-- Provider -->
			<div class="form-control">
				<div class="label font-semibold">Provider</div>
				<select placeholder="Type here" class="select select-bordered w-full" bind:value={upsertDatabase.provider}>
					{#each databaseProviders as { name, client }}
						<option value={client}>{name}</option>
					{/each}
				</select>
				{#if zodErrors?.provider}
					<div class="label text-xs text-error">{zodErrors.provider.message}</div>
				{/if}
			</div>

			<!-- Connection Type -->
			<div class="tabs mt-8 mb-4">
				<button
					class="tab tab-bordered w-1/2 text-lg font-semibold
               {upsertDatabase.connectionType === 'STRING' && 'tab-active'}"
					on:click={() => {
						if (upsertDatabase) upsertDatabase.connectionType = 'STRING';
					}}
				>
					Connection String
				</button>
				<button
					class="tab tab-bordered w-1/2 text-lg font-semibold
               {upsertDatabase.connectionType === 'OPTIONS' && 'tab-active'}"
					on:click={() => {
						if (upsertDatabase) upsertDatabase.connectionType = 'OPTIONS';
					}}
				>
					Connection Options
				</button>
			</div>

			{#if upsertDatabase.connectionType === 'STRING'}
				<!-- Connection String -->
				<div class="form-control">
					<div class="label font-semibold">Connection String</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionString}
					/>
					{#if zodErrors?.connectionString}
						<div class="label text-xs text-error">{zodErrors.connectionString.message}</div>
					{/if}
				</div>
			{:else if upsertDatabase.connectionOption}
				<!-- Host -->
				<div class="form-control">
					<div class="label font-semibold">Host</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionOption.host}
					/>
					{#if connectionOptionZodErrors?.host}
						<div class="label text-xs text-error">{connectionOptionZodErrors.host.message}</div>
					{/if}
				</div>

				<!-- Port -->
				<div class="form-control">
					<div class="label font-semibold">Port</div>
					<input
						type="number"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionOption.port}
					/>
					{#if connectionOptionZodErrors?.port}
						<div class="label text-xs text-error">{connectionOptionZodErrors.port.message}</div>
					{/if}
				</div>

				<!-- Database Name -->
				<div class="form-control">
					<div class="label font-semibold">Database Name</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionOption.databaseName}
					/>
					{#if connectionOptionZodErrors?.databaseName}
						<div class="label text-xs text-error">
							{connectionOptionZodErrors.databaseName.message}
						</div>
					{/if}
				</div>

				<!-- Username -->
				<div class="form-control">
					<div class="label font-semibold">Username</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionOption.username}
					/>
					{#if connectionOptionZodErrors?.username}
						<div class="label text-xs text-error">
							{connectionOptionZodErrors?.username.message}
						</div>
					{/if}
				</div>

				<!-- Password -->
				<div class="form-control">
					<div class="label font-semibold">Password</div>
					<input
						type="text"
						placeholder="Type here"
						class="input input-bordered w-full"
						bind:value={upsertDatabase.connectionOption.password}
					/>
					{#if connectionOptionZodErrors?.password}
						<div class="label text-xs text-error">
							{connectionOptionZodErrors.password.message}
						</div>
					{/if}
				</div>
			{/if}

			<div class="modal-action">
				<button class="btn btn-error w-24" on:click={closeModal}>Cancel</button>
				<button class="btn btn-success w-24" on:click={submit}>
					{#if upsertDatabase.id}
						Update
					{:else}
						Add
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
