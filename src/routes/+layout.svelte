<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	export let data;
</script>

{#if data.session}
	<Navbar />
{/if}

<slot />
