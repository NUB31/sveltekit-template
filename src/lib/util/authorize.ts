import type { User } from '@prisma/client';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { SECRET_JWT_SECRET } from '$env/static/private';
import type { ErrorOrT } from '$lib/types';

export interface UserIDJwtPayload extends JwtPayload {
	user: User;
}

export function authorize(
	request: Request,
	next: (param: ErrorOrT<User>) => Response | Promise<Response>
): Response | Promise<Response> {
	const authHeader = request.headers.get('Authorization');
	let value: ErrorOrT<User>;

	try {
		if (!authHeader) {
			throw new Error('No Authorization header present');
		}

		if (!authHeader.startsWith('Bearer ') || authHeader.split('Bearer ').length < 2) {
			throw new Error('Token needs to be in the following format: Bearer JWT_TOKEN');
		}

		const token = authHeader.split('Bearer ')[1];
		if (!token) {
			throw new Error('No token present in header');
		}

		try {
			value = {
				user: (<UserIDJwtPayload>jwt.verify(token, SECRET_JWT_SECRET)).user,
				error: null
			};
		} catch (error) {
			throw new Error('Verification failed. Please log in again');
		}
	} catch (e) {
		return next({
			error: e instanceof Error ? e : new Error('An error occurred during authorization'),
			user: null
		});
	}

	return next(value);
}
