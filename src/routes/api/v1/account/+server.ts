import { authorize } from '$lib/server/authorize';
import { response } from '$lib/server/response';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) =>
	authorize(cookies, (user) =>
		response({
			data: user,
			error: null
		})
	);
