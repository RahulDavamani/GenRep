<script lang="ts">
	import Icon from '@iconify/svelte';
	import ApiKeys from './components/ApiKeys.svelte';
	import Themes from './components/Themes.svelte';
	import Databases from './components/Databases.svelte';
	import ValidateTokenUrl from './components/ValidateTokenURL.svelte';
</script>

<div class="container mx-auto rounded-box shadow py-4">
	<div class="flex justify-between items-center px-4">
		<button on:click={() => history.back()} class="btn btn-ghost">
			<Icon icon="mdi:chevron-left" width={22} /> Back
		</button>
		<div class="text-center text-2xl font-semibold">Settings</div>
		<button on:click={() => history.back()} class="btn btn-ghost opacity-0 pointer-events-none">
			<Icon icon="mdi:chevron-left" width={22} /> Back
		</button>
	</div>
	<div class="divider mt-2" />

	<div class="px-8">
		<ValidateTokenUrl />
		<Databases />
		<ApiKeys />
		<Themes />
	</div>
</div>
