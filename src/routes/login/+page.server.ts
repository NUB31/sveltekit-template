import { Routes } from '$lib/global/routes';
import { db } from '$lib/server/database';
import { generateJwt } from '$lib/server/jwtUtils';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username) {
			return fail(422, { usernameEmpty: true });
		}

		if (!password) {
			return fail(422, { passwordEmpty: true });
		}

		const user = await db.user.findUnique({
			where: {
				username: username.toString()
			}
		});

		if (!user) {
			return fail(404, { userNotFound: false });
		}

		const match = await bcrypt.compare(password.toString(), user.password);
		if (!match) {
			return fail(401, { passwordIncorrect: true });
		}

		cookies.set('jwt', await generateJwt(user.id), { path: '/' });

		if (user.isVerified) {
			throw redirect(303, Routes.home);
		} else {
			throw redirect(303, Routes.verify);
		}
	}
} satisfies Actions;
