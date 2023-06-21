import type { User } from '@prisma/client'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { SECRET_JWT_SECRET } from '$env/static/private'

export interface UserIDJwtPayload extends JwtPayload {
	user: User
}

export function authorize(
	request: Request,
	next: (err: string | null, user: User) => Response | Promise<Response>
): Response | Promise<Response> {
	let error: string | null = null
	let user: User | null = null
	const authHeader = request.headers.get('Authorization')

	try {
		if (!authHeader) throw new Error('No Authorization header present')
		if (!authHeader.startsWith('Bearer ') || authHeader.split('Bearer ').length < 2)
			throw new Error('Token needs to be in the following format: Bearer JWT_TOKEN')

		let token
		try {
			token = authHeader.split('Bearer ')[1]
		} catch (error) {
			throw new Error('Could not parse Bearer token')
		}

		try {
			user = (<UserIDJwtPayload>jwt.verify(token, SECRET_JWT_SECRET)).user
		} catch (error) {
			throw new Error('Verification failed. Please log in again')
		}
	} catch (e) {
		error = 'There was an error during authenticating'
		if (e instanceof Error) error = e.message
	}

	return next(error, user!)
}
