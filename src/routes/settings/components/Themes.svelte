<script lang="ts">
	import { page } from '$app/stores';
	import { ui } from '../../../stores/ui.store';
	import type { PageData } from '../$types';
	import { trpc } from '../../../trpc/client';
	import { trpcClientErrorHandler } from '../../../trpc/trpcErrorhandler';
	import { invalidateAll } from '$app/navigation';
	import { themes } from '$lib/data/themes';

	$: data = $page.data as PageData;

	const updateTheme = async (theme: string) => {
		ui.setTheme(theme);
		await trpc($page).theme.update.query({ theme }).catch(trpcClientErrorHandler);
		invalidateAll();
	};
</script>

<div class="mt-10">
	<div class="text-lg font-semibold mb-1">Themes:</div>

	<div class="flex flex-wrap justify-around gap-x-6">
		{#each themes as th}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				data-theme={th}
				class="card w-44 bg-base-100 my-3 lg:m-6 border cursor-pointer
            {data.theme === th && 'outline outline-primary'}"
				on:click={() => updateTheme(th)}
			>
				<div class="card-body p-0 text-center">
					<div class="grid grid-cols-5 grid-rows-3">
						<div class="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
							<div class="flex-grow text-sm font-bold">{th.toUpperCase()}</div>
							<div class="flex flex-shrink-0 flex-wrap gap-1">
								<div class="bg-primary w-2 rounded"></div>
								<div class="bg-secondary w-2 rounded"></div>
								<div class="bg-accent w-2 rounded"></div>
								<div class="bg-neutral w-2 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
