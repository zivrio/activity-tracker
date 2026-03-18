<script lang="ts">
	import { store, CATEGORIES, INTENSITIES, type Category, type Intensity } from '$lib/stores/data.svelte';
	import ConsistencyHeatmap from '$lib/components/ConsistencyHeatmap.svelte';

	let activityName = $state('');
	let category: Category = $state('Exercise');
	let durationMinutes = $state(30);
	let intensity: Intensity = $state('Medium');
	let notes = $state('');
	let tagsInput = $state('');

	function handleAdd() {
		if (!activityName.trim()) return;
		const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
		store.addEntry({
			date: new Date().toISOString().slice(0, 10),
			activityName: activityName.trim(),
			category,
			durationMinutes,
			intensity,
			notes,
			tags
		});
		activityName = '';
		notes = '';
		tagsInput = '';
		durationMinutes = 30;
	}

	function formatDuration(mins: number): string {
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		if (h === 0) return m + 'm';
		return h + 'h ' + m + 'm';
	}

	function intensityBadge(i: string): string {
		if (i === 'High') return 'badge-orange';
		if (i === 'Medium') return 'badge-blue';
		return 'badge-green';
	}
</script>

<svelte:head><title>Dashboard - Activity Tracker</title></svelte:head>

<div class="dashboard-header"><h1>Activity Tracker</h1><p class="subtitle">Track your daily activities and monitor your progress</p></div>

<div class="grid-4 mb-2">
	<div class="card text-center stat-card">
		<div class="text-xs text-muted">Today</div>
		<div class="font-bold" style="font-size:1.5rem">{formatDuration(store.todayMinutes)}</div>
		<div class="text-xs text-muted">{store.todayCount} entries</div>
	</div>
	<div class="card text-center stat-card">
		<div class="text-xs text-muted">This Week</div>
		<div class="font-bold" style="font-size:1.5rem">{formatDuration(store.weekMinutes)}</div>
	</div>
	<div class="card text-center stat-card">
		<div class="text-xs text-muted">This Month</div>
		<div class="font-bold" style="font-size:1.5rem">{formatDuration(store.monthMinutes)}</div>
	</div>
	<div class="card text-center stat-card">
		<div class="text-xs text-muted">Streak</div>
		<div class="font-bold" style="font-size:1.5rem">{store.streak} day{store.streak !== 1 ? 's' : ''}</div>
	</div>
</div>

<div class="grid-2 gap-2">
	<div class="card">
		<h2 class="mb-2">Quick Add</h2>
		<form class="flex flex-col gap-1" onsubmit={(e) => { e.preventDefault(); handleAdd(); }}>
			<div>
				<label for="qa-name">Activity</label>
				<input id="qa-name" bind:value={activityName} placeholder="e.g. Morning run" required />
			</div>
			<div class="grid-2">
				<div>
					<label for="qa-cat">Category</label>
					<select id="qa-cat" bind:value={category}>
						{#each CATEGORIES as c}<option value={c}>{c}</option>{/each}
					</select>
				</div>
				<div>
					<label for="qa-int">Intensity</label>
					<select id="qa-int" bind:value={intensity}>
						{#each INTENSITIES as i}<option value={i}>{i}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				<label for="qa-dur">Duration (minutes)</label>
				<input id="qa-dur" type="number" bind:value={durationMinutes} min="1" max="1440" />
			</div>
			<div>
				<label for="qa-notes">Notes</label>
				<input id="qa-notes" bind:value={notes} placeholder="Optional notes" />
			</div>
			<div>
				<label for="qa-tags">Tags (comma-separated)</label>
				<input id="qa-tags" bind:value={tagsInput} placeholder="e.g. cardio, outdoor" />
			</div>
			<button type="submit" class="btn-primary mt-1">Add Entry</button>
		</form>
	</div>

	<div class="card">
		<h2 class="mb-2">Recent Activity</h2>
		{#if store.recentEntries.length === 0}
			<p class="text-muted text-sm">No entries yet. Add your first activity!</p>
		{:else}
			<div class="flex flex-col gap-1">
				{#each store.recentEntries as entry (entry.id)}
					<div class="entry-row">
						<div>
							<span class="font-bold text-sm">{entry.activityName}</span>
							<span class="badge {intensityBadge(entry.intensity)}">{entry.intensity}</span>
						</div>
						<div class="text-xs text-muted">
							{entry.category} &middot; {formatDuration(entry.durationMinutes)} &middot; {entry.date}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

<ConsistencyHeatmap />
</div>

<style>
	:global(body) { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); }
	.entry-row {
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border);
	}
	.entry-row:last-child { border-bottom: none; }
</style>
