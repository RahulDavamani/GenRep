<script lang="ts">
	import Icon from '@iconify/svelte';
	import ApiKeys from './components/ApiKeys.svelte';
	import Themes from './components/Themes.svelte';
	import Databases from './components/Databases.svelte';
</script>

<div class="container mx-auto rounded-box shadow py-4">
	<div class="flex justify-between items-center px-4">
		<a href="/" class="btn btn-ghost">
			<Icon icon="material-symbols:arrow-back-ios-new-rounded" /> Back
		</a>
		<div class="text-center text-2xl font-semibold">Settings</div>
		<a href="/" class="btn btn-ghost opacity-0 pointer-events-none">
			<Icon icon="material-symbols:arrow-back-ios-new-rounded" /> Back
		</a>
	</div>
	<div class="divider mt-2" />

	<div class="px-8">
		<Databases />
		<ApiKeys />
		<Themes />
	</div>
</div>
