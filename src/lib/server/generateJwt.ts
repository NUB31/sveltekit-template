import type { User } from '@prisma/client';
import { db } from './database';
import { SECRET_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function generateJwt(userId: string) {
	let user: User;

	try {
		user = await db.user.findUniqueOrThrow({
			where: {
				id: userId
			}
		});
	} catch (error) {
		throw new Error(`Could not find user with id: ${userId}`);
	}

	user.password = '';
	return jwt.sign({ user: { ...user, password: '' } }, SECRET_JWT_SECRET, { expiresIn: '30d' });
}
