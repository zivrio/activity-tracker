<script lang="ts">
	import { store, CATEGORIES } from '$lib/stores/data';

	let categoryStats = $derived(
		CATEGORIES.map((cat) => {
			const entries = store.entries.filter((e) => e.category === cat);
			const totalMin = entries.reduce((s, e) => s + e.durationMinutes, 0);
			return { category: cat, count: entries.length, totalMinutes: totalMin };
		}).filter((c) => c.count > 0).sort((a, b) => b.totalMinutes - a.totalMinutes)
	);

	let intensityStats = $derived(() => {
		const map: Record<string, { count: number; minutes: number }> = {};
		for (const e of store.entries) {
			if (!map[e.intensity]) map[e.intensity] = { count: 0, minutes: 0 };
			map[e.intensity].count++;
			map[e.intensity].minutes += e.durationMinutes;
		}
		return Object.entries(map).map(([k, v]) => ({ intensity: k, ...v }));
	});

	let topActivities = $derived(
		(() => {
			const map: Record<string, { count: number; minutes: number }> = {};
			for (const e of store.entries) {
				if (!map[e.activityName]) map[e.activityName] = { count: 0, minutes: 0 };
				map[e.activityName].count++;
				map[e.activityName].minutes += e.durationMinutes;
			}
			return Object.entries(map)
				.map(([name, v]) => ({ name, ...v }))
				.sort((a, b) => b.minutes - a.minutes)
				.slice(0, 10);
		})()
	);

	let totalEntries = $derived(store.entries.length);
	let totalMinutes = $derived(store.entries.reduce((s, e) => s + e.durationMinutes, 0));
	let avgDuration = $derived(totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0);
	let uniqueDays = $derived(new Set(store.entries.map((e) => e.date)).size);

	function formatDuration(mins: number): string {
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		if (h === 0) return m + 'm';
		return h + 'h ' + m + 'm';
	}
</script>

<svelte:head><title>Analytics</title></svelte:head>

<h1 class="mb-2">Analytics</h1>

<div class="grid-4 mb-2">
	<div class="card text-center">
		<div class="text-xs text-muted">Total Entries</div>
		<div class="font-bold" style="font-size:1.5rem">{totalEntries}</div>
	</div>
	<div class="card text-center">
		<div class="text-xs text-muted">Total Time</div>
		<div class="font-bold" style="font-size:1.5rem">{formatDuration(totalMinutes)}</div>
	</div>
	<div class="card text-center">
		<div class="text-xs text-muted">Avg Duration</div>
		<div class="font-bold" style="font-size:1.5rem">{avgDuration}m</div>
	</div>
	<div class="card text-center">
		<div class="text-xs text-muted">Active Days</div>
		<div class="font-bold" style="font-size:1.5rem">{uniqueDays}</div>
	</div>
</div>

<div class="grid-2 gap-2">
	<div class="card">
		<h2 class="mb-2">By Category</h2>
		{#if categoryStats.length === 0}
			<p class="text-muted text-sm">No data yet.</p>
		{:else}
			<table class="stat-table">
				<thead><tr><th>Category</th><th>Entries</th><th>Time</th></tr></thead>
				<tbody>
					{#each categoryStats as row}
						<tr><td>{row.category}</td><td>{row.count}</td><td>{formatDuration(row.totalMinutes)}</td></tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="card">
		<h2 class="mb-2">Top Activities</h2>
		{#if topActivities.length === 0}
			<p class="text-muted text-sm">No data yet.</p>
		{:else}
			<table class="stat-table">
				<thead><tr><th>Activity</th><th>Count</th><th>Time</th></tr></thead>
				<tbody>
					{#each topActivities as row}
						<tr><td>{row.name}</td><td>{row.count}</td><td>{formatDuration(row.minutes)}</td></tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<style>
	.stat-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
	.stat-table th { text-align: left; padding: 0.4rem 0.5rem; border-bottom: 2px solid var(--border); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
	.stat-table td { padding: 0.4rem 0.5rem; border-bottom: 1px solid var(--border); }
</style>
