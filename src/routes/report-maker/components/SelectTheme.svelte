<script lang="ts">
	import Icon from '@iconify/svelte';
	import { themes } from '../../../data/themes';
	import { reportMaker } from '../../../stores/report-maker.store';
</script>

{#if $reportMaker.showSelectTheme}
	<div class="modal modal-open">
		<div class="modal-box max-w-5xl">
			<div class="flex justify-between">
				<div class="text-lg font-semibold mb-1">Themes:</div>
				<button
					class="btn btn-sm btn-circle btn-link text-error"
					on:click={() => ($reportMaker.showSelectTheme = false)}
				>
					<Icon icon="mdi:close" width={20} />
				</button>
			</div>

			<div class="flex flex-wrap justify-around gap-x-6">
				{#each themes as th}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						data-theme={th}
						class="card w-44 bg-base-100 my-3 lg:m-6 border cursor-pointer
               {$reportMaker.upsertReport.theme === th && 'outline outline-primary'}"
						on:click={() => {
							$reportMaker.upsertReport.theme = th;
							$reportMaker.showSelectTheme = false;
						}}
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
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
