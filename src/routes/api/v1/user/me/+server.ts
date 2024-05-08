import { Routes } from '$lib/global/routes';
import { authorize } from '$lib/server/authorize';
import { db } from '$lib/server/database';
import { generateJwt } from '$lib/server/jwtUtils';
import { errorResponse, response } from '$lib/server/response';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const GET: RequestHandler = async ({ cookies }) =>
	authorize(cookies, (user) => {
		return response({
			data: user,
			error: null
		});
	});

export const PATCH: RequestHandler = async ({ request, cookies }) =>
	authorize(cookies, async (user) => {
		if (!request.body) {
			return errorResponse('Request does not have a body', 422);
		}

		let body;
		try {
			body = await request.json();
		} catch (error) {
			return errorResponse('Could not parse JSON');
		}

		const username = body.username || undefined;
		const phone = body.phone || undefined;
		const profilePicture = body.profilePicture || undefined;
		let password = undefined;
		if (body.password) password = await bcrypt.hash(body.password, 10);

		const updatedUser = await db.user.update({
			data: {
				username: username,
				password: password,
				phone: phone,
				profilePicture: profilePicture
			},
			where: {
				id: user.id
			}
		});

		cookies.set('jwt', await generateJwt(updatedUser.id), {
			path: Routes.root
		});

		return response({
			data: { ...updatedUser, password: '' },
			error: null
		});
	});
