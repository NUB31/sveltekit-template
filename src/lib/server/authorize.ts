import type { User } from '@prisma/client';
import { errorResponse } from './response';
import type { Cookies } from '@sveltejs/kit';
import { parseJwt } from './jwtUtils';

export function authorize(
	cookies: Cookies,
	next: (user: User) => Response | Promise<Response>
): Response | Promise<Response> {
	const cookie = cookies.get('jwt');
	if (!cookie) {
		return errorResponse('JWT cookie not present');
	}

	try {
		try {
			const value = parseJwt(cookie);
			return next(value.user);
		} catch (error) {
			throw new Error('Verification failed. Please log in again');
		}
	} catch (e) {
		const message = e instanceof Error ? e.message : 'An error occurred during authorization';
		return errorResponse(message, 403);
	}
}
