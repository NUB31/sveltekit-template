import { Routes } from '$lib/global/routes';
import { db } from '$lib/server/database';
import { generateJwt } from '$lib/server/jwtUtils';
import { sendVerificationEmail } from '$lib/server/sendVerificationEmail';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const email = data.get('email');
		const phone = data.get('phone');

		if (!username) {
			return fail(422, { usernameEmpty: true });
		}

		if (!password) {
			return fail(422, { passwordEmpty: true });
		}

		if (!email) {
			return fail(422, { emailEmpty: true });
		}

		try {
			const user = await db.user.findUnique({
				where: {
					username: username.toString()
				}
			});

			if (user) {
				return fail(409, { usernameTaken: true });
			}
		} catch (error) {
			return fail(400, { dbError: true });
		}

		try {
			const user = await db.user.create({
				data: {
					username: username.toString(),
					password: await bcrypt.hash(password.toString(), 10),
					email: email.toString(),
					phone: phone?.toString()
				}
			});

			cookies.set('jwt', await generateJwt(user), { path: Routes.root });

			try {
				await sendVerificationEmail(user.id);
				throw redirect(303, Routes.verify);
			} catch {
				return { verificationEmailFailedToSend: true };
			}
		} catch (e) {
			return fail(400, { dbError: true });
		}
	}
} satisfies Actions;
