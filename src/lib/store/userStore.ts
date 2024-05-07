import { writable, type Writable } from 'svelte/store';
import type { User } from '@prisma/client';
import { Routes } from '$lib/global/routes';
import type { ErrorOrT } from '$lib/types/ErrorOrT';

async function createUserStore(): Promise<Writable<User | null>> {
	const res = await fetch(`http://localhost:5173${Routes.api.myAccount}`);
	const data = (await res.json()) as ErrorOrT<User>;

	const store = writable<User | null>(data.data);
	return store;
}

export const userStore = await createUserStore();
