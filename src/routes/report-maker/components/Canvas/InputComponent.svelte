<script lang="ts">
	import { componentInteract } from '$lib/client/interact';
	import type { UpsertInputComponent } from '$lib/reportSchema';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';

	export let inputComponent: UpsertInputComponent;

	$: ({ id, queryParamId, label, type, properties } = inputComponent);
	$: ({ x, y, width, height, bgColor, textColor, shadow, rounded, border, outline } = properties);
	$: ({
		upsertReport: { datasets, inputComponents }
	} = $reportMaker);
	$: datasetI = datasets.findIndex((d) => d.queryParams.find((qp) => qp.id === queryParamId));
	$: qpI = datasets[datasetI].queryParams.findIndex((qp) => qp.id === queryParamId);

	onMount(() =>
		componentInteract(
			id,
			() => properties,
			(properties) =>
				($reportMaker.upsertReport.inputComponents = inputComponents.map((c) =>
					c.id === id ? { ...c, properties } : c
				))
		)
	);

	let element: HTMLDivElement | undefined;
	$: if (element)
		Object.assign(element.style, {
			width: `${width}px`,
			height: `${height}px`,
			transform: `translate(${x}px, ${y}px)`
		});
</script>

<div
	{id}
	class="absolute flex flex-col justify-center items-center {bgColor} {textColor} {shadow} {rounded} 
   {border && 'border'} {outline && 'outline'}
   overflow-auto p-4 hover:outline hover:outline-1 hover:outline-blue-300 active:outline-blue-700"
	bind:this={element}
>
	{#if type === 'text'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="text"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'number'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="number"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'email'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="email"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'password'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="password"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'date'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="date"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'time'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<input
				type="time"
				placeholder="Type here"
				class="input input-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'textarea'}
		<div class="form-control w-full">
			<div class="label font-semibold">{label}</div>
			<textarea
				placeholder="Type here"
				class="textarea textarea-bordered"
				bind:value={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value}
			/>
		</div>
	{:else if type === 'checkbox'}
		<div class="form-control">
			<button
				class="label cursor-pointer gap-4"
				on:click={() => {
					if ($reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === 'true')
						$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value = 'false';
					else $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value = 'true';
				}}
			>
				<span>{label}</span>
				<input
					type="checkbox"
					class="checkbox"
					checked={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === 'true'}
				/>
			</button>
		</div>
	{:else if type === 'toggle'}
		<div class="form-control">
			<button
				class="label cursor-pointer gap-4"
				on:click={() => {
					if ($reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === 'true')
						$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value = 'false';
					else $reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value = 'true';
				}}
			>
				<span>{label}</span>
				<input
					type="checkbox"
					class="toggle"
					checked={$reportMaker.upsertReport.datasets[datasetI].queryParams[qpI].value === 'true'}
				/>
			</button>
		</div>
	{/if}
</div>
