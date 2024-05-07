import { Routes } from '$lib/global/routes.js';
import { userStore } from '$lib/store/userStore.js';
import type { ErrorOrT } from '$lib/types/ErrorOrT.js';
import type { User } from '@prisma/client';

export async function load({ fetch }) {
	const res = await fetch(Routes.api.myAccount);
	const data = (await res.json()) as ErrorOrT<User>;

	if (data.data) {
		userStore.set(data.data);
	}

	return {};
}
