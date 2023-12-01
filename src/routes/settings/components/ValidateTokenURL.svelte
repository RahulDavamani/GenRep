<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { PageData } from '../$types';
	import { onMount } from 'svelte';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler } from '../../../trpc/trpcErrorhandler';
	import { invalidateAll } from '$app/navigation';
	import { ui } from '../../../stores/ui.store';

	let validateTokenUrl: string = '';
	onMount(async () => (validateTokenUrl = ($page.data as PageData).validateTokenUrl));

	const saveValidateTokenUrl = async () => {
		await trpc($page).user.updateValidateTokenURL.query({ validateTokenUrl }).catch(trpcClientErrorHandler);
		ui.showToast({ class: 'alert-success', title: 'Validate Token URL Successfully Updated' });
		invalidateAll();
	};
</script>

<div class="form-control w-full mb-8">
	<div class="label font-semibold justify-start gap-2">
		<Icon icon="mdi:link" width={20} />
		Validate Token URL
	</div>
	<div class="join">
		<input
			type="text"
			placeholder="Type here"
			class="input input-bordered join-item w-full"
			bind:value={validateTokenUrl}
		/>
		<button class="btn btn-success join-item" on:click={saveValidateTokenUrl}>
			<Icon icon="mdi:content-save" width={18} />
			Save
		</button>
	</div>
</div>
