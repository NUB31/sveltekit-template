import type { ApiResponse } from '$lib/types';
import { db, authorize, generateJwt } from '$lib/util';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	};

	return authorize(request, async (err, user) => {
		if (err) {
			res.message = err;
			return json(res, { status: 403 });
		}

		if (!request.body) {
			res.message = 'Request does not have a body';
			return json(res, { status: 422 });
		}

		let body;
		try {
			body = await request.json();
		} catch (error) {
			res.message = 'Could not parse JSON';
			return json(res, { status: 400 });
		}

		if (!body.code) {
			res.message = 'Body must contain a verification code';
			return json(res, { status: 422 });
		}

		if (isNaN(Number(body.code))) {
			res.message = 'Code must be of type: number';
			return json(res, { status: 422 });
		}

		try {
			await db.verificationCode.findFirstOrThrow({
				where: {
					AND: {
						code: Number(body.code),
						userId: user.id,
						createdAt: {
							gt: new Date(Date.now() - 10000 * 60) // 10 Minutes
						}
					}
				}
			});
		} catch (error) {
			res.message = 'Code is invalid or expired';
			return json(res, { status: 422 });
		}

		try {
			await db.user.update({
				data: {
					isVerified: true
				},
				where: {
					username: user.username
				}
			});
		} catch (error) {
			res.message = 'There was an error updating the database';
			return json(res, { status: 500 });
		}

		cookies.set('jwt', await generateJwt(user.id), {
			path: '/'
		});

		res.success = true;
		return json(res, { status: 200 });
	});
};
