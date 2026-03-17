<script lang="ts">
	import { store, CATEGORIES, INTENSITIES, type Category, type Intensity } from '$lib/stores/data';

	let tplName = $state('');
	let tplCategory: Category = $state('Exercise');
	let tplDuration = $state(30);
	let tplIntensity: Intensity = $state('Medium');
	let tplTags = $state('');
	let message = $state('');

	function addTemplate() {
		if (!tplName.trim()) return;
		const tags = tplTags.split(',').map((t) => t.trim()).filter(Boolean);
		store.addTemplate({
			activityName: tplName.trim(),
			category: tplCategory,
			durationMinutes: tplDuration,
			intensity: tplIntensity,
			tags
		});
		tplName = '';
		tplTags = '';
		tplDuration = 30;
	}

	function useTemplate(id: string) {
		const entry = store.addFromTemplate(id);
		if (entry) {
			message = 'Added: ' + entry.activityName;
			setTimeout(() => (message = ''), 2000);
		}
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

<svelte:head><title>Templates</title></svelte:head>

<h1 class="mb-2">Templates</h1>

{#if message}
	<div class="card mb-2" style="background:#dcfce7;border-color:#22c55e">
		<span class="text-sm">{message}</span>
	</div>
{/if}

<div class="grid-2 gap-2">
	<div class="card">
		<h2 class="mb-2">Create Template</h2>
		<form class="flex flex-col gap-1" onsubmit={(e) => { e.preventDefault(); addTemplate(); }}>
			<div>
				<label for="tpl-name">Activity Name</label>
				<input id="tpl-name" bind:value={tplName} placeholder="e.g. Morning Walk" required />
			</div>
			<div class="grid-2">
				<div>
					<label for="tpl-cat">Category</label>
					<select id="tpl-cat" bind:value={tplCategory}>
						{#each CATEGORIES as c}<option value={c}>{c}</option>{/each}
					</select>
				</div>
				<div>
					<label for="tpl-int">Intensity</label>
					<select id="tpl-int" bind:value={tplIntensity}>
						{#each INTENSITIES as i}<option value={i}>{i}</option>{/each}
					</select>
				</div>
			</div>
			<div>
				<label for="tpl-dur">Duration (minutes)</label>
				<input id="tpl-dur" type="number" bind:value={tplDuration} min="1" max="1440" />
			</div>
			<div>
				<label for="tpl-tags">Tags (comma-separated)</label>
				<input id="tpl-tags" bind:value={tplTags} placeholder="e.g. cardio, outdoor" />
			</div>
			<button type="submit" class="btn-primary mt-1">Save Template</button>
		</form>
	</div>

	<div class="card">
		<h2 class="mb-2">Saved Templates</h2>
		{#if store.templates.length === 0}
			<p class="text-muted text-sm">No templates yet. Create one to quickly log common activities.</p>
		{:else}
			<div class="flex flex-col gap-1">
				{#each store.templates as tpl (tpl.id)}
					<div class="tpl-row">
						<div>
							<span class="font-bold text-sm">{tpl.activityName}</span>
							<span class="badge {intensityBadge(tpl.intensity)}">{tpl.intensity}</span>
						</div>
						<div class="text-xs text-muted">{tpl.category} &middot; {formatDuration(tpl.durationMinutes)}</div>
						<div class="flex gap-1 mt-1">
							<button class="btn-primary btn-sm" onclick={() => useTemplate(tpl.id)}>+ Log Now</button>
							<button class="btn-danger btn-sm" onclick={() => store.deleteTemplate(tpl.id)}>Delete</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.tpl-row { padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
	.tpl-row:last-child { border-bottom: none; }
</style>
