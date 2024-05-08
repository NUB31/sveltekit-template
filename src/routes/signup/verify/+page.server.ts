import { Routes } from '$lib/global/routes';
import { db } from '$lib/server/database';
import { generateJwt, parseJwt } from '$lib/server/jwtUtils';
import { sendVerificationEmail } from '$lib/server/sendVerificationEmail';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions = {
	sendCode: async ({ cookies }) => {
		const token = cookies.get('jwt');
		if (!token) {
			return fail(401, { jwtTokenNotPresent: true });
		}

		const user = parseJwt(token);
		try {
			await sendVerificationEmail(user.id);
		} catch {
			return { verificationEmailFailedToSend: true };
		}
	},

	verify: async ({ cookies, request }) => {
		const data = await request.formData();
		const code = data.get('code');
		const token = cookies.get('jwt');
		if (!token) {
			return fail(401, { jwtTokenNotPresent: true });
		}

		const user = parseJwt(token);

		if (!code) {
			return fail(422, { codeMissing: true });
		}

		if (isNaN(Number(code.toString()))) {
			return fail(422, { codeNotANumber: true });
		}

		const dbCode = await db.verificationCode.findFirst({
			where: {
				AND: {
					code: Number(code),
					userId: user.id,
					createdAt: {
						gt: new Date(Date.now() - 10000 * 60) // 10 Minutes
					}
				}
			}
		});

		if (!dbCode) {
			return fail(404, { missingOrExpired: true });
		}

		try {
			await db.user.update({
				data: {
					isVerified: true
				},
				where: {
					id: user.id
				}
			});

			cookies.set('jwt', await generateJwt(user.id), {
				path: Routes.root
			});

			throw redirect(303, Routes.home);
		} catch (error) {
			return fail(500, { dbError: true });
		}
	}
} satisfies Actions;
