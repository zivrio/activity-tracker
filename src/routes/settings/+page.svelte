<script lang="ts">
	import { store } from '$lib/stores/data';

	let importText = $state('');
	let message = $state('');
	let messageType = $state<'success' | 'error'>('success');

	const importPlaceholder = '{"entries": [...], "templates": [...]}';

	function showMessage(text: string, type: 'success' | 'error' = 'success') {
		message = text;
		messageType = type;
		setTimeout(() => (message = ''), 3000);
	}

	function handleExport() {
		const data = store.exportData();
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'activity-tracker-export.json';
		a.click();
		URL.revokeObjectURL(url);
		showMessage('Data exported successfully.');
	}

	function handleImport() {
		if (!importText.trim()) {
			showMessage('Paste JSON data first.', 'error');
			return;
		}
		const ok = store.importData(importText);
		if (ok) {
			showMessage('Data imported successfully.');
			importText = '';
		} else {
			showMessage('Invalid JSON data.', 'error');
		}
	}

	function handleFileImport(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			const ok = store.importData(text);
			if (ok) {
				showMessage('Data imported from file.');
			} else {
				showMessage('Invalid file format.', 'error');
			}
		};
		reader.readAsText(file);
	}

	function handleClear() {
		if (confirm('Delete ALL data? This cannot be undone.')) {
			store.clearAll();
			showMessage('All data cleared.');
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(store.exportData());
		showMessage('Copied to clipboard.');
	}

	let msgBg = $derived(messageType === 'success' ? '#dcfce7' : '#fee2e2');
	let msgBorder = $derived(messageType === 'success' ? '#22c55e' : '#ef4444');
</script>

<svelte:head><title>Settings</title></svelte:head>

<h1 class="mb-2">Settings</h1>

{#if message}
	<div class="card mb-2" style:background={msgBg} style:border-color={msgBorder}>
		<span class="text-sm">{message}</span>
	</div>
{/if}

<div class="flex flex-col gap-2">
	<div class="card">
		<h2 class="mb-2">Export Data</h2>
		<p class="text-sm text-muted mb-2">Download all your entries and templates as a JSON file.</p>
		<div class="flex gap-1">
			<button class="btn-primary" onclick={handleExport}>Download JSON</button>
			<button class="btn-ghost" onclick={copyToClipboard}>Copy to Clipboard</button>
		</div>
	</div>

	<div class="card">
		<h2 class="mb-2">Import Data</h2>
		<p class="text-sm text-muted mb-2">Import from a JSON file or paste JSON data below.</p>
		<div class="mb-2">
			<label for="import-file">Import from file</label>
			<input id="import-file" type="file" accept=".json" onchange={handleFileImport} />
		</div>
		<div class="mb-2">
			<label for="import-text">Or paste JSON</label>
			<textarea id="import-text" bind:value={importText} rows={4} placeholder={importPlaceholder}></textarea>
		</div>
		<button class="btn-primary" onclick={handleImport}>Import from Text</button>
	</div>

	<div class="card">
		<h2 class="mb-2">Danger Zone</h2>
		<p class="text-sm text-muted mb-2">Permanently delete all entries and templates.</p>
		<button class="btn-danger" onclick={handleClear}>Clear All Data</button>
	</div>

	<div class="card">
		<h2 class="mb-2">About</h2>
		<p class="text-sm text-muted">
			Activity Tracker v0.1 -- A minimalist activity and time tracking app.
			Data is stored locally in your browser.
		</p>
	</div>
</div>
