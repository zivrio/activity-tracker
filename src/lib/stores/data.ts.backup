import { browser } from '$app/environment';

export const CATEGORIES = [
	'Exercise', 'Walking', 'Mobility', 'Stretching', 'Work', 'Deep Work',
	'Housework', 'Recovery', 'Hobby', 'Admin', 'Social', 'Other'
] as const;

export const INTENSITIES = ['Low', 'Medium', 'High'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Intensity = (typeof INTENSITIES)[number];

export interface ActivityEntry {
	id: string;
	date: string;
	activityName: string;
	category: Category;
	durationMinutes: number;
	intensity: Intensity;
	notes: string;
	tags: string[];
}

export interface ActivityTemplate {
	id: string;
	activityName: string;
	category: Category;
	durationMinutes: number;
	intensity: Intensity;
	tags: string[];
}

function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadFromStorage<T>(key: string, fallback: T): T {
	if (!browser) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;
	localStorage.setItem(key, JSON.stringify(value));
}

function todayStr(): string {
	return new Date().toISOString().slice(0, 10);
}

function startOfWeek(): string {
	const d = new Date();
	d.setDate(d.getDate() - d.getDay());
	return d.toISOString().slice(0, 10);
}

function startOfMonth(): string {
	const d = new Date();
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	return y + '-' + m + '-01';
}

class ActivityStore {
	entries: ActivityEntry[] = $state(loadFromStorage<ActivityEntry[]>('at_entries', []));
	templates: ActivityTemplate[] = $state(loadFromStorage<ActivityTemplate[]>('at_templates', []));

	private persist(): void {
		saveToStorage('at_entries', this.entries);
	}

	private persistTemplates(): void {
		saveToStorage('at_templates', this.templates);
	}

	addEntry(data: Omit<ActivityEntry, 'id'>): ActivityEntry {
		const entry: ActivityEntry = { ...data, id: generateId() };
		this.entries = [entry, ...this.entries];
		this.persist();
		return entry;
	}

	updateEntry(id: string, data: Partial<ActivityEntry>): void {
		this.entries = this.entries.map((e) => (e.id === id ? { ...e, ...data } : e));
		this.persist();
	}

	deleteEntry(id: string): void {
		this.entries = this.entries.filter((e) => e.id !== id);
		this.persist();
	}

	duplicateEntry(id: string): ActivityEntry | undefined {
		const source = this.entries.find((e) => e.id === id);
		if (!source) return undefined;
		return this.addEntry({ ...source, date: todayStr() });
	}

	get todayMinutes(): number {
		const t = todayStr();
		return this.entries.filter((e) => e.date === t).reduce((s, e) => s + e.durationMinutes, 0);
	}

	get weekMinutes(): number {
		const w = startOfWeek();
		return this.entries.filter((e) => e.date >= w).reduce((s, e) => s + e.durationMinutes, 0);
	}

	get monthMinutes(): number {
		const m = startOfMonth();
		return this.entries.filter((e) => e.date >= m).reduce((s, e) => s + e.durationMinutes, 0);
	}

	get todayCount(): number {
		return this.entries.filter((e) => e.date === todayStr()).length;
	}

	get streak(): number {
		const dates = [...new Set(this.entries.map((e) => e.date))].sort().reverse();
		if (dates.length === 0) return 0;
		let streak = 0;
		const d = new Date();
		for (let i = 0; i < 365; i++) {
			const ds = d.toISOString().slice(0, 10);
			if (dates.includes(ds)) {
				streak++;
			} else if (i > 0) {
				break;
			}
			d.setDate(d.getDate() - 1);
		}
		return streak;
	}

	get recentEntries(): ActivityEntry[] {
		return this.entries.slice(0, 10);
	}

	addTemplate(data: Omit<ActivityTemplate, 'id'>): void {
		this.templates = [...this.templates, { ...data, id: generateId() }];
		this.persistTemplates();
	}

	deleteTemplate(id: string): void {
		this.templates = this.templates.filter((t) => t.id !== id);
		this.persistTemplates();
	}

	addFromTemplate(templateId: string): ActivityEntry | undefined {
		const tmpl = this.templates.find((t) => t.id === templateId);
		if (!tmpl) return undefined;
		return this.addEntry({
			date: todayStr(),
			activityName: tmpl.activityName,
			category: tmpl.category,
			durationMinutes: tmpl.durationMinutes,
			intensity: tmpl.intensity,
			notes: '',
			tags: [...tmpl.tags]
		});
	}

	exportData(): string {
		return JSON.stringify({ entries: this.entries, templates: this.templates }, null, 2);
	}

	importData(json: string): boolean {
		try {
			const data = JSON.parse(json);
			if (Array.isArray(data.entries)) {
				this.entries = data.entries;
				this.persist();
			}
			if (Array.isArray(data.templates)) {
				this.templates = data.templates;
				this.persistTemplates();
			}
			return true;
		} catch {
			return false;
		}
	}

	clearAll(): void {
		this.entries = [];
		this.templates = [];
		this.persist();
		this.persistTemplates();
	}
}

export const store = new ActivityStore();
