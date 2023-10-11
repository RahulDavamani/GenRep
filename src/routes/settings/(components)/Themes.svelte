<script lang="ts">
	import { page } from '$app/stores';
	import { ui } from '../../../stores/ui.store';
	import type { PageData } from '../$types';
	import { triggerAction } from '../../../utils/triggerAction';
	import type { UpdateTheme } from '../(actions)/updateTheme';

	const themes = [
		'light',
		'dark',
		'cupcake',
		'bumblebee',
		'emerald',
		'corporate',
		'synthwave',
		'retro',
		'cyberpunk',
		'valentine',
		'halloween',
		'garden',
		'forest',
		'aqua',
		'lofi',
		'pastel',
		'fantasy',
		'wireframe',
		'black',
		'luxury',
		'dracula',
		'cmyk',
		'autumn',
		'business',
		'acid',
		'lemonade',
		'night',
		'coffee',
		'winter'
	];

	$: data = $page.data as PageData;

	const updateTheme = (theme: string) => {
		triggerAction<UpdateTheme>('/settings/?/updateTheme', { theme });
		ui.setTheme(theme);
	};
</script>

<div class="px-8 mt-8">
	<div class="text-lg font-semibold mb-1">Themes:</div>

	<div class="flex flex-wrap">
		{#each themes as th}
			<button
				data-theme={th}
				class="card w-44 bg-base-100 my-3 lg:m-6 rounded-none cursor-pointer
            {data.theme == th && 'outline outline-primary'}"
				on:click={() => updateTheme(th)}
			>
				<div class="card-body p-0">
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
			</button>
		{/each}
	</div>
</div>
