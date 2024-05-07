import { Routes } from '$lib/global/routes';
import { db } from '$lib/server/database';
import { generateJwt } from '$lib/server/generateJwt';
import { errorResponse, response } from '$lib/server/response';
import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!request.body) {
		return errorResponse('Request does not have a body', 422);
	}

	let body;
	try {
		body = await request.json();
	} catch (error) {
		return errorResponse('Could not parse JSON');
	}

	if (!body.username || !body.password) {
		return errorResponse('Body must contain a username and a password', 422);
	}

	const user = await db.user.findUnique({
		where: {
			username: body.username
		}
	});

	if (!user) {
		return errorResponse(`User with username: '${body.username}' does not exist`, 404);
	}

	const match = await bcrypt.compare(body.password, user.password);

	if (!match) {
		return errorResponse('Password is wrong', 401);
	}

	cookies.set('jwt', await generateJwt(user.id), {
		path: Routes.root
	});

	return response({
		data: { ...user, password: '' },
		error: null
	});
};
