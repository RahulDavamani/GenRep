<script lang="ts">
	import Icon from '@iconify/svelte';

	export let data;
</script>

<div class="container mx-auto">
	<div class="flex justify-between items-center mt-4 mb-6">
		<div class="flex gap-2 items-center text-xl font-semibold">
			<Icon icon="mdi:report-box-outline" width={24} />
			Reports: <span>({data.reports.length})</span>
		</div>
		<a href="/report-maker" class="btn btn-success">
			<Icon icon="mdi:report-box-plus-outline" width={22} /> Create New Report
		</a>
	</div>
</div>
