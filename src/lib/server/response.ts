import type { ErrorOrT } from '$lib/types/ErrorOrT';
import { json } from '@sveltejs/kit';

export function response<T>(data: ErrorOrT<T>, errorCode = 500): Response {
	return json(data, {
		status: data.data != null ? 200 : errorCode
	});
}

export function errorResponse(error: string, errorCode = 500): Response {
	const data: ErrorOrT<boolean> = {
		error: error,
		data: null
	};

	return response(data, errorCode);
}
