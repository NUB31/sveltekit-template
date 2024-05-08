import { goto, invalidateAll } from '$app/navigation';
import { toast } from '$lib/components/toast/toast';
import { Routes } from '$lib/global/routes';
import { userStore } from '$lib/store/userStore';
import type { ErrorOrT } from '$lib/types/ErrorOrT';
import type { User } from '@prisma/client';

export async function logout() {
	const res = await fetch(Routes.api.logout);
	const data = (await res.json()) as ErrorOrT<boolean>;

	if (data.data) {
		await authStateChanged();
		await goto(Routes.login);
	} else {
		toast.error(data.error);
		throw new Error(data.error ?? 'An error occurred logging you out');
	}
}

export async function authStateChanged(newState: User | null = null) {
	userStore.set(newState);
	await invalidateAll();
}
