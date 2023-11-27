<script lang="ts">
	import { componentProperties } from '$lib/data/componentProperties';
	import type { UpsertProperties } from '$lib/reportSchema';
	import { reportMaker } from '../../../../stores/report-maker.store';

	$: ({ upsertReport } = $reportMaker);

	export let properties: UpsertProperties;
</script>

<div class="collapse collapse-arrow mt-2">
	<input type="checkbox" class="peer" checked={false} />
	<div class="collapse-title p-1 flex items-center">
		<div class="text-lg font-bold">Properties</div>
	</div>
	<div class="collapse-content p-0 rounded-lg">
		<div class="grid grid-cols-2 gap-x-6 gap-y-1">
			<div class="form-control flex-grow">
				<div class="label">Position X</div>
				<input type="number" placeholder="Type here" class="input input-sm input-bordered" bind:value={properties.x} />
			</div>
			<div class="form-control flex-grow">
				<div class="label">Position Y</div>
				<input type="number" placeholder="Type here" class="input input-sm input-bordered" bind:value={properties.y} />
			</div>

			<div class="form-control flex-grow">
				<div class="label">Width</div>
				<input
					type="number"
					placeholder="Type here"
					class="input input-sm input-bordered"
					bind:value={properties.width}
				/>
			</div>
			<div class="form-control flex-grow">
				<div class="label">Height</div>
				<input
					type="number"
					placeholder="Type here"
					class="input input-sm input-bordered"
					bind:value={properties.height}
				/>
			</div>

			<div class="form-control flex-grow">
				<div class="label">Padding</div>
				<input
					type="number"
					placeholder="Type here"
					class="input input-sm input-bordered"
					bind:value={properties.padding}
				/>
			</div>
			<div class="form-control flex-grow">
				<div class="label">Opacity</div>
				<input
					type="range"
					min="0"
					max="100"
					class="range range-primary"
					style=" opacity: {properties.opacity / 100}"
					bind:value={properties.opacity}
				/>
			</div>

			<div class="form-control flex-grow">
				<div class="label">Background Color</div>
				<select
					placeholder="Type here"
					class="select select-sm select-bordered {properties.bgColor} {properties.textColor}"
					bind:value={properties.bgColor}
					data-theme={upsertReport.theme}
				>
					{#each componentProperties.bgColors as { key, value }}
						<option class={key} value={key}>{value}</option>
					{/each}
				</select>
			</div>
			<div class="form-control flex-grow">
				<div class="label">Text Color</div>
				<select
					placeholder="Type here"
					class="select select-sm select-bordered {properties.bgColor} {properties.textColor}"
					bind:value={properties.textColor}
					data-theme={upsertReport.theme}
				>
					{#each componentProperties.textColors as { key, value }}
						<option class={key} value={key}>{value}</option>
					{/each}
				</select>
			</div>

			<div class="form-control flex-grow">
				<div class="label">Shadow</div>
				<select
					placeholder="Type here"
					class="select select-sm select-bordered {properties.shadow}"
					bind:value={properties.shadow}
				>
					{#each componentProperties.shadowOptions as { key, value }}
						<option class={key} value={key}>{value}</option>
					{/each}
				</select>
			</div>
			<div class="form-control flex-grow">
				<div class="label">Rounded</div>
				<select
					placeholder="Type here"
					class="select select-sm select-bordered {properties.rounded}"
					bind:value={properties.rounded}
				>
					{#each componentProperties.roundedOptions as { key, value }}
						<option class={key} value={key}>{value}</option>
					{/each}
				</select>
			</div>

			<div class="form-control mt-4">
				<label class="label cursor-pointer">
					<span>Border</span>
					<input type="checkbox" class="checkbox checkbox-primary" bind:checked={properties.border} />
				</label>
			</div>
			<div class="form-control mt-4">
				<label class="label cursor-pointer">
					<span>Outline</span>
					<input type="checkbox" class="checkbox checkbox-primary" bind:checked={properties.outline} />
				</label>
			</div>
		</div>
	</div>
</div>
