<script lang="ts">
	import '../app.css';
	import Navbar from './components/Navbar.svelte';
	import Toast from './components/Toast.svelte';
	import Modal from './components/Modal.svelte';
	import { ui } from '../stores/ui.store';
	import Loader from './components/Loader.svelte';
	import { onMount } from 'svelte';
	import { appUrls } from '$lib/data/appUrls';
	import { page } from '$app/stores';

	export let data;
	onMount(() => ui.setTheme(data.theme));
	$: ({ loader } = $ui);
	$: path = $page.url.pathname;
</script>

{#if appUrls.sessionRestricted.includes(path) || !appUrls.public.includes(path)}
	<Navbar />
{/if}

{#if loader}
	{@const { title, overlay } = loader}
	<Loader {title} overlay={overlay ?? true} />
{/if}

{#if !loader || loader.overlay !== false}
	{#if appUrls.sessionRestricted.includes(path) || !appUrls.public.includes(path)}
		<div class="py-6">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
{/if}

<Modal />
<Toast />
