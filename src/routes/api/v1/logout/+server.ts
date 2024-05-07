import type { ApiResponse } from '$lib/types';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	};

	cookies.set('jwt', '', {
		path: '/'
	});

	res.success = true;
	return json(res);
};
