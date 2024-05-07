import { db } from '$lib/util/database';
import bcrypt from 'bcrypt';
import { generateJwt } from '$lib/util/generateJwt';
import { errorResponse, response } from '$lib/util/response';
import type { RequestHandler } from '@sveltejs/kit';

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

	if (!body.username || !body.password || !body.email) {
		return errorResponse(
			'Body must contain a username, password and email address. You can also optionally include a phone number and a profile picture',
			422
		);
	}

	const existingUser = await db.user.findUnique({
		where: {
			username: body.username
		}
	});

	if (existingUser) {
		return errorResponse('Username is taken', 400);
	}

	const user = await db.user.create({
		data: {
			username: body.username,
			password: await bcrypt.hash(body.password, 10),
			email: body.email,
			phone: body.phone || null,
			profilePicture: body.profilePicture || null
		}
	});

	cookies.set('jwt', await generateJwt(user.id), {
		path: '/'
	});

	return response({
		data: { ...user, password: '' },
		error: null
	});
};
