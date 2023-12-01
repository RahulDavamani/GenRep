<script lang="ts">
	import '../app.css';
	import Navbar from './components/Navbar.svelte';
	import Toast from './components/Toast.svelte';
	import Modal from './components/Modal.svelte';
	import { ui } from '../stores/ui.store';
	import Loader from './components/Loader.svelte';
	import { onMount } from 'svelte';

	export let data;
	onMount(() => ui.setTheme(data.theme));
	$: ({ loader } = $ui);
</script>

{#if data.session}
	<Navbar />
{/if}

{#if loader}
	{@const { title, overlay } = loader}
	<Loader {title} overlay={overlay ?? true} />
{/if}

{#if !loader || loader.overlay !== false}
	<div>
		<slot />
	</div>
{/if}

<Modal />
<Toast />
