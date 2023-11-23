<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
	$: ({ reports } = data);
</script>

<div class="container mx-auto">
	<div class="flex justify-between items-center mt-4 mb-10">
		<div class="flex gap-2 items-center text-xl font-semibold">
			<Icon icon="mdi:report-box-outline" width={24} />
			Reports: <span class="font-mono">({reports.length})</span>
		</div>
		<a href="/report-maker" class="btn btn-success">
			<Icon icon="mdi:report-box-plus-outline" width={22} /> Create New Report
		</a>
	</div>

	<div class="flex flex-wrap justify-start gap-10">
		{#each reports as { id, name, description, theme, _count: { datasets, cardComponents, tableComponents } }}
			{@const totalComponents = cardComponents + tableComponents}
			<a href="/report-maker?id={id}">
				<div class="border shadow rounded-box w-96 cursor-pointer flex flex-col h-full" data-theme={theme}>
					<div class="p-4">
						<div class="flex justify-between items-center mb-2">
							<div class="text-lg font-bold">{name}</div>
							<div class="capitalize">Theme: <span class="text-primary">{theme}</span></div>
						</div>
						<div class="break-all mb-2">
							<span class="font-semibold"> Description: </span>
							{description}
						</div>
					</div>
					<div class="mt-auto border rounded-b-box flex">
						<div class="border-r w-full p-2 text-center">Datasets: {datasets}</div>
						<div class="w-full p-2 text-center">Components: {totalComponents}</div>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
