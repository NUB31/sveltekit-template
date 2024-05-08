import { db } from './database';
import { SECRET_JWT_SECRET } from '$env/static/private';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';

export async function generateJwt(userId: string) {
	const user = await db.user.findUnique({
		where: {
			id: userId
		}
	});

	if (!user) {
		throw new Error(`Could not find user with id: ${userId}`);
	}

	user.password = '';
	return jwt.sign({ user: { ...user, password: '' } }, SECRET_JWT_SECRET, { expiresIn: '30d' });
}

export interface UserJwtPayload extends JwtPayload {
	user: User;
}

export function parseJwt(token: string): UserJwtPayload {
	return <UserJwtPayload>jwt.verify(token, SECRET_JWT_SECRET);
}
