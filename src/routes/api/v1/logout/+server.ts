import { response } from '$lib/util/response';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.set('jwt', '', {
		path: '/'
	});

	return response({
		data: true,
		error: null
	});
};
