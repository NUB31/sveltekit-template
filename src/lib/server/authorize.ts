import type { User } from '@prisma/client';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { SECRET_JWT_SECRET } from '$env/static/private';
import { errorResponse } from './response';
import type { Cookies } from '@sveltejs/kit';

export interface UserIDJwtPayload extends JwtPayload {
	user: User;
}

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
			const value = <UserIDJwtPayload>jwt.verify(cookie, SECRET_JWT_SECRET);
			return next(value.user);
		} catch (error) {
			throw new Error('Verification failed. Please log in again');
		}
	} catch (e) {
		const message = e instanceof Error ? e.message : 'An error occurred during authorization';
		return errorResponse(message, 403);
	}
}
