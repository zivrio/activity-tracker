<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();
	let menuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Dashboard', icon: '◉' },
		{ href: '/log', label: 'Activity Log', icon: '☰' },
		{ href: '/analytics', label: 'Analytics', icon: '▤' },
		{ href: '/templates', label: 'Templates', icon: '◫' },
		{ href: '/settings', label: 'Settings', icon: '⚙' }
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="layout">
	<button class="menu-toggle" onclick={() => (menuOpen = !menuOpen)}>☰</button>
	<aside class="sidebar" class:open={menuOpen}>
		<div class="sidebar-header">
			<h2>Activity Tracker</h2>
		</div>
		<nav>
			{#each navItems as item}
				<a
					href={item.href}
					class="nav-item"
					class:active={isActive(item.href)}
					onclick={() => (menuOpen = false)}
				>
					<span class="nav-icon">{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>
	</aside>
	{#if menuOpen}
		<div class="overlay" role="presentation" onclick={() => (menuOpen = false)}></div>
	{/if}
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.layout { display: flex; min-height: 100vh; }
	.sidebar {
		width: var(--sidebar-w);
		background: var(--bg-sidebar);
		color: var(--text-sidebar);
		padding: 1.5rem 0;
		flex-shrink: 0;
		position: fixed;
		top: 0; left: 0; bottom: 0;
		z-index: 100;
		transition: transform 0.2s;
	}
	.sidebar-header { padding: 0 1.25rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
	.sidebar-header h2 { font-size: 1.1rem; font-weight: 700; }
	nav { padding: 0.75rem 0; display: flex; flex-direction: column; gap: 0.15rem; }
	.nav-item {
		display: flex; align-items: center; gap: 0.6rem;
		padding: 0.6rem 1.25rem;
		color: var(--text-sidebar); font-size: 0.875rem;
		text-decoration: none; transition: background 0.15s;
	}
	.nav-item:hover { background: rgba(255,255,255,0.08); }
	.nav-item.active { background: rgba(59,130,246,0.25); color: #93c5fd; }
	.nav-icon { font-size: 1rem; width: 1.25rem; text-align: center; }
	.content { flex: 1; margin-left: var(--sidebar-w); padding: 2rem; max-width: 960px; }
	.menu-toggle { display: none; position: fixed; top: 0.75rem; left: 0.75rem; z-index: 200; background: var(--bg-sidebar); color: #fff; padding: 0.4rem 0.7rem; border-radius: var(--radius); font-size: 1.2rem; }
	.overlay { display: none; }

	@media (max-width: 768px) {
		.sidebar { transform: translateX(-100%); }
		.sidebar.open { transform: translateX(0); }
		.content { margin-left: 0; padding: 1rem; padding-top: 3.5rem; }
		.menu-toggle { display: block; }
		.overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 50; }
	}
</style>
