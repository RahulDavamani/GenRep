<script lang="ts">
	import type { UpsertCardComponent, UpsertProperties } from '$lib/reportSchema';
	import interact from 'interactjs';
	import { onMount } from 'svelte';
	import { reportMaker } from '../../../../stores/report-maker.store';

	export let cardComponent: UpsertCardComponent;
	$: ({ id, datasetId, name, title, column, rowNumber, properties } = cardComponent);
	$: ({ x, y, width, height } = properties);
	$: ({
		upsertReport: { cardComponents },
		dbDatas
	} = $reportMaker);
	$: console.log(dbDatas);
	$: value = dbDatas.find((d) => d.datasetId == datasetId)?.data?.[rowNumber - 1][column];

	let element: HTMLDivElement | undefined;
	$: if (element)
		Object.assign(element.style, {
			width: `${width}px`,
			height: `${height}px`,
			transform: `translate(${x}px, ${properties?.y}px)`
		});

	onMount(() => {
		interact(`#${id}`)
			.resizable({
				edges: { top: true, left: true, bottom: true, right: true },
				listeners: {
					move: function (event) {
						const {
							target: { id },
							deltaRect: { left, top },
							rect: { width, height }
						} = event;

						const properties: UpsertProperties = {
							id,
							x: x + left,
							y: y + top,
							width,
							height
						};
						$reportMaker.upsertReport.cardComponents = cardComponents.map((c) =>
							c.id === id ? { ...c, properties } : c
						);
					}
				},
				modifiers: [
					interact.modifiers.restrictEdges({
						outer: 'parent'
					}),
					interact.modifiers.restrictSize({
						min: { width: 100, height: 100 }
					})
				]
			})
			.draggable({
				listeners: {
					move(event) {
						const {
							target: { id },
							dx,
							dy
						} = event;

						const properties: UpsertProperties = {
							id,
							x: x + dx,
							y: y + dy,
							width,
							height
						};
						$reportMaker.upsertReport.cardComponents = cardComponents.map((c) =>
							c.id === id ? { ...c, properties } : c
						);
					}
				},
				modifiers: [
					interact.modifiers.restrictRect({
						restriction: 'parent',
						endOnly: true
					})
				]
			});
	});
</script>

<div
	{id}
	class="absolute border shadow rounded-lg overflow-auto p-4 flex flex-col justify-center items-center"
	bind:this={element}
>
	<div class="text-lg font-semibold">{title}</div>
	<div>{value}</div>
</div>
