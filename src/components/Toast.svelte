<script lang="ts">
	import Icon from '@iconify/svelte';
	import { ui } from '../stores/ui.store';
</script>

{#if $ui.toast}
	{@const { title, type } = $ui.toast}
	<div class="toast toast-bottom toast-end z-50 p-2">
		<div class="alert alert-{type} border p-3 pl-6">
			{title}
			<button on:click={() => ui.closeToast()}>
				<Icon icon="material-symbols:close" />
			</button>
		</div>
	</div>
{/if}
