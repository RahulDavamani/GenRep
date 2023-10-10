<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Navbar.svelte';
	import Toast from '../components/Toast.svelte';
	import Modal from '../components/Modal.svelte';
	import { ui } from '../stores/ui.store';
	import Loader from '../components/Loader.svelte';

	export let data;
	$: ({ loader } = $ui);
</script>

{#if data.session}
	<Navbar />
{/if}

{#if loader}
	{@const { title, overlay } = loader}
	<Loader {title} {overlay} center />
{/if}

{#if !loader || loader.overlay}
	<slot />
{/if}

<Modal />
<Toast />
