import { goto, invalidate } from '$app/navigation';
import { userStore } from '$lib/store/userStore';
import type { ErrorOrT } from '$lib/types/ErrorOrT';
import type { User } from '@prisma/client';

export async function login(username: string, password: string) {
	const res = await fetch('/api/v1/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password
		})
	});

	const data = (await res.json()) as ErrorOrT<User>;
	if (data.data) {
		userStore.set(data.data);
		await invalidate('/api/v1/user/me');
		if (data.data.isVerified === false) {
			await goto('/signup/verify');
		} else {
			await goto('/');
		}
	} else {
		throw new Error(data.error);
	}
}

export async function logout() {
	const res = await fetch('/api/v1/logout');

	if (res.ok) {
		await goto('/login');
	}
}

export async function me(): Promise<User> {
	const res = await fetch('/api/v1/user/me');
	const data = (await res.json()) as ErrorOrT<User>;

	if (data.data) {
		return data.data;
	} else {
		throw new Error(data.error);
	}
}
