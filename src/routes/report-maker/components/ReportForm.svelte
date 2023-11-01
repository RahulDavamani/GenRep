<script lang="ts">
	import Icon from '@iconify/svelte';
	import SelectTheme from './SelectTheme.svelte';
	import { reportMaker } from '../../../stores/report-maker.store';

	$: ({ zodErrors } = $reportMaker);
</script>

<div class="collapse collapse-arrow rounded-b-none">
	<input type="checkbox" class="peer" checked={true} />
	<div class="collapse-title">
		<div class="flex items-center gap-2 text-lg font-semibold">
			<Icon icon="mdi:tune" />
			Properties:
		</div>
	</div>
	<div class="collapse-content">
		<div class="flex gap-5 mb-2">
			<div class="form-control w-full">
				<div class="label font-semibold">Name</div>
				<input
					type="text"
					placeholder="Type here"
					class="input input-bordered {zodErrors?.name && 'input-error'}"
					bind:value={$reportMaker.upsertReport.name}
				/>
				{#if zodErrors?.name}
					<div class="label text-xs text-error">{zodErrors.name.message}</div>
				{/if}
			</div>

			<div class="form-control">
				<div class="label font-semibold">Theme</div>
				<button
					class="btn btn-primary w-52"
					data-theme={$reportMaker.upsertReport.theme}
					on:click={() => ($reportMaker.showSelectTheme = true)}
				>
					{$reportMaker.upsertReport.theme}
				</button>
			</div>
		</div>

		<div class="form-control w-full">
			<div class="label font-semibold justify-start">
				Description
				<span class="ml-2 font-normal opacity-80">(optional)</span>
			</div>
			<textarea
				placeholder="Type here"
				class="textarea textarea-bordered w-full"
				bind:value={$reportMaker.upsertReport.description}
			/>
			{#if zodErrors?.description}
				<div class="label text-xs text-error">{zodErrors.description.message}</div>
			{/if}
		</div>
	</div>
</div>

<SelectTheme />
