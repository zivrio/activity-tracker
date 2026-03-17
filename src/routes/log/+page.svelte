<script lang="ts">
	import { store, CATEGORIES, INTENSITIES, type Category, type Intensity } from '$lib/stores/data';

	let filterCategory = $state<string>('All');
	let editingId = $state<string | null>(null);
	let editName = $state('');
	let editCategory = $state<Category>('Exercise');
	let editDuration = $state(30);
	let editIntensity = $state<Intensity>('Medium');
	let editNotes = $state('');
	let editDate = $state('');

	let filtered = $derived(
		filterCategory === 'All'
			? store.entries
			: store.entries.filter((e) => e.category === filterCategory)
	);

	function startEdit(entry: typeof store.entries[0]) {
		editingId = entry.id;
		editName = entry.activityName;
		editCategory = entry.category;
		editDuration = entry.durationMinutes;
		editIntensity = entry.intensity;
		editNotes = entry.notes;
		editDate = entry.date;
	}

	function saveEdit() {
		if (!editingId) return;
		store.updateEntry(editingId, {
			activityName: editName,
			category: editCategory,
			durationMinutes: editDuration,
			intensity: editIntensity,
			notes: editNotes,
			date: editDate
		});
		editingId = null;
	}

	function cancelEdit() {
		editingId = null;
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

<svelte:head><title>Activity Log</title></svelte:head>

<div class="flex items-center justify-between mb-2">
	<h1>Activity Log</h1>
	<div class="flex items-center gap-1">
		<label for="filter-cat" class="text-sm" style="margin:0">Filter:</label>
		<select id="filter-cat" bind:value={filterCategory} style="width:auto">
			<option value="All">All Categories</option>
			{#each CATEGORIES as c}<option value={c}>{c}</option>{/each}
		</select>
	</div>
</div>

<div class="text-sm text-muted mb-2">
	{filtered.length} entr{filtered.length === 1 ? 'y' : 'ies'}
	{#if filterCategory !== 'All'} in {filterCategory}{/if}
</div>

{#if filtered.length === 0}
	<div class="card text-center text-muted">No entries found.</div>
{:else}
	<div class="flex flex-col gap-1">
		{#each filtered as entry (entry.id)}
			<div class="card">
				{#if editingId === entry.id}
					<form class="flex flex-col gap-1" onsubmit={(e) => { e.preventDefault(); saveEdit(); }}>
						<div class="grid-2">
							<div>
								<label for="edit-name">Activity</label>
								<input id="edit-name" bind:value={editName} required />
							</div>
							<div>
								<label for="edit-date">Date</label>
								<input id="edit-date" type="date" bind:value={editDate} />
							</div>
						</div>
						<div class="grid-3">
							<div>
								<label for="edit-cat">Category</label>
								<select id="edit-cat" bind:value={editCategory}>
									{#each CATEGORIES as c}<option value={c}>{c}</option>{/each}
								</select>
							</div>
							<div>
								<label for="edit-int">Intensity</label>
								<select id="edit-int" bind:value={editIntensity}>
									{#each INTENSITIES as i}<option value={i}>{i}</option>{/each}
								</select>
							</div>
							<div>
								<label for="edit-dur">Minutes</label>
								<input id="edit-dur" type="number" bind:value={editDuration} min="1" />
							</div>
						</div>
						<div>
							<label for="edit-notes">Notes</label>
							<input id="edit-notes" bind:value={editNotes} />
						</div>
						<div class="flex gap-1">
							<button type="submit" class="btn-primary btn-sm">Save</button>
							<button type="button" class="btn-ghost btn-sm" onclick={cancelEdit}>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="flex items-center justify-between">
						<div>
							<span class="font-bold">{entry.activityName}</span>
							<span class="badge {intensityBadge(entry.intensity)}">{entry.intensity}</span>
							{#each entry.tags as tag}
								<span class="badge">{tag}</span>
							{/each}
						</div>
						<div class="flex gap-1">
							<button class="btn-ghost btn-sm" onclick={() => startEdit(entry)}>Edit</button>
							<button class="btn-ghost btn-sm" onclick={() => store.duplicateEntry(entry.id)}>Dup</button>
							<button class="btn-danger btn-sm" onclick={() => store.deleteEntry(entry.id)}>Del</button>
						</div>
					</div>
					<div class="text-xs text-muted mt-1">
						{entry.category} &middot; {formatDuration(entry.durationMinutes)} &middot; {entry.date}
						{#if entry.notes} &middot; {entry.notes}{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
