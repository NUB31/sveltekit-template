import { db } from './database';
import { SECRET_JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

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
