<script lang="ts">
	import type { TRPCZodErrors } from '../../../trpc/trpcErrorhandler';
	import SelectTheme from './SelectTheme.svelte';

	export let name: string;
	export let description: string;
	export let theme: string;
	export let zodErrors: TRPCZodErrors | undefined;

	let showSelectTheme = false;
</script>

<div class="pt-4 p-6">
	<div class="flex gap-5 mb-4">
		<div class="form-control w-full">
			<div class="label font-semibold">Name</div>
			<input type="text" placeholder="Type here" class="input input-bordered w-full" bind:value={name} />
			{#if zodErrors?.name}
				<div class="label text-xs text-error">{zodErrors.name.message}</div>
			{/if}
		</div>

		<div class="form-control">
			<div class="label font-semibold">Theme</div>
			<button class="btn btn-primary w-52" data-theme={theme} on:click={() => (showSelectTheme = true)}>
				{theme}
			</button>
		</div>
	</div>

	<div class="form-control w-full">
		<div class="label font-semibold">Description (Optional)</div>
		<textarea placeholder="Type here" class="textarea textarea-bordered w-full" bind:value={description} />
		{#if zodErrors?.description}
			<div class="label text-xs text-error">{zodErrors.description.message}</div>
		{/if}
	</div>
</div>

{#if showSelectTheme}
	<SelectTheme bind:showSelectTheme bind:theme />
{/if}
