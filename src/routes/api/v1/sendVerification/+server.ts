import { authorize } from '$lib/util/authorize';
import { errorResponse, response } from '$lib/util/response';
import { sendVerificationEmail } from '$lib/util/sendVerificationEmail';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) =>
	authorize(cookies, async (user) => {
		try {
			const log = await sendVerificationEmail(user.id);
			console.log(log);
		} catch (error: unknown) {
			let message = 'There was an error sending your verification code';
			if (error instanceof Error) message = error.message;

			return errorResponse(message);
		}

		return response({
			data: true,
			error: null
		});
	});
