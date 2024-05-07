import { writable } from 'svelte/store';

export const toasts = writable<Toast[]>([]);

type Toast = {
	id: string;
	type: 'success' | 'error' | 'info' | 'warning';
	text: string;
};

function addToast(
	text: string,
	type: 'success' | 'error' | 'warning' | 'info' = 'info',
	dismissible: boolean
) {
	const id = `toast-${
		crypto.randomUUID
			? crypto.randomUUID()
			: Math.floor(Date.now() * Math.random() * 100).toString()
	}`;

	toasts.update((all) => [
		...all,
		{
			id: id,
			text: text,
			dismissible: dismissible,
			type: type
		}
	]);
}

function dismiss(id: string) {
	toasts.update((all) => all.filter((x) => x.id !== id));
}

export const toast = {
	clear: () => toasts.set([]),
	error: (text: string | null, dismissible = true) =>
		addToast(text ?? 'En feil oppstod', 'error', dismissible),
	info: (text: string, dismissible = true) => addToast(text, 'info', dismissible),
	warning: (text: string, dismissible = true) => addToast(text, 'warning', dismissible),
	success: (text: string | null, dismissible = true) =>
		addToast(text ?? 'Suksess', 'success', dismissible),
	dismiss: dismiss
};
