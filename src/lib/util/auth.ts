import { goto, invalidateAll } from '$app/navigation';
import { toast } from '$lib/components/toast/toast';
import { Routes } from '$lib/global/routes';
import { userStore } from '$lib/store/userStore';
import type { ErrorOrT } from '$lib/types/ErrorOrT';
import type { User } from '@prisma/client';

export async function login(username: string, password: string) {
	const res = await fetch(Routes.api.login, {
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
		await authStateChanged(data.data);
		if (data.data.isVerified === false) {
			await goto(Routes.verify);
		} else {
			await goto(Routes.home);
		}
	} else {
		toast.error(data.error);
		throw new Error(data.error);
	}
}

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

export async function signup(
	username: string,
	password: string,
	email: string,
	phone: string | null
) {
	const createUserRes = await fetch(Routes.api.signup, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password,
			email: email,
			phone: phone
		})
	});

	const data = (await createUserRes.json()) as ErrorOrT<User>;
	if (data.error) {
		toast.error(data.error);
		throw new Error(data.error);
	}

	try {
		await sendVerification();
	} catch {
		toast.warning(
			'Account created successfully, however the verification code was not able to be sent'
		);
	} finally {
		await authStateChanged(data.data);
		await goto(Routes.verify);
	}
}

export async function sendVerification() {
	const res = await fetch(Routes.api.sendVerification);

	const data = (await res.json()) as ErrorOrT<boolean>;
	if (data.error) {
		toast.error(data.error);
		throw new Error(data.error);
	}
}

export async function authStateChanged(newState: User | null = null) {
	userStore.set(newState);
	await invalidateAll();
}
