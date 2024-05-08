import { Routes } from '$lib/global/routes';
import { response } from '$lib/server/response';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.delete('jwt', { path: Routes.root });

	return response({
		data: true,
		error: null
	});
};
