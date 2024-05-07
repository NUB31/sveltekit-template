import { authorize } from '$lib/util/authorize';
import { db } from '$lib/util/database';
import { generateJwt } from '$lib/util/generateJwt';
import { errorResponse, response } from '$lib/util/response';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }): Promise<Response> =>
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

		if (!body.code) {
			return errorResponse('Body must contain a verification code', 422);
		}

		if (isNaN(Number(body.code))) {
			return errorResponse('Code must be of type: number', 422);
		}

		const code = await db.verificationCode.findFirst({
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

		if (!code) {
			return errorResponse('Code is invalid or expired', 403);
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
			return errorResponse('There was an error updating the database');
		}

		cookies.set('jwt', await generateJwt(user.id), {
			path: '/'
		});

		return response({
			data: true,
			error: null
		});
	});
