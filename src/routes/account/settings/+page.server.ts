import { Routes } from '$lib/global/routes';
import { db } from '$lib/server/database';
import { generateJwt, parseJwt } from '$lib/server/jwtUtils';
import { fail, type Actions, type Cookies } from '@sveltejs/kit';
import path from 'path';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import type { User } from '@prisma/client';

async function updater(cookies: Cookies, key: string, value: string) {
	const token = cookies.get('jwt');
	if (!token) {
		return fail(401, { jwtTokenNotPresent: true });
	}

	let user: User;
	try {
		user = parseJwt(token).user;
	} catch {
		return fail(401, { jwtInvalid: true });
	}

	const x: { [id: string]: string } = {};
	x[key] = value;

	try {
		const updatedUser = await db.user.update({
			data: x,
			where: {
				id: user.id
			}
		});

		cookies.set('jwt', await generateJwt(updatedUser), {
			path: Routes.root
		});

		return { success: true };
	} catch {
		return fail(500, { dbError: true });
	}
}

export const actions = {
	updateUsername: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(422, { usernameMissing: true });
		}

		return await updater(cookies, 'username', username.toString());
	},
	updateEmail: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		if (!email) {
			return fail(422, { emailMissing: true });
		}

		return await updater(cookies, 'email', email.toString());
	},
	updatePhone: async ({ cookies, request }) => {
		const data = await request.formData();
		const phone = data.get('phone');
		if (!phone) {
			return fail(422, { phoneMissing: true });
		}

		return await updater(cookies, 'phone', phone.toString());
	},
	updatePassword: async ({ cookies, request }) => {
		const data = await request.formData();
		const password = data.get('password');
		if (!password) {
			return fail(422, { passwordMissing: true });
		}

		const hashedPassword = await bcrypt.hash(password.toString(), 10);

		return await updater(cookies, 'password', hashedPassword);
	},
	updateProfilePicture: async ({ cookies, request }) => {
		const token = cookies.get('jwt');
		if (!token) {
			return fail(401, { jwtTokenNotPresent: true });
		}

		parseJwt(token);

		const data = await request.formData();

		const file = data.get('file');
		if (!file) {
			return fail(422, { fileMissing: true });
		}

		const relativeFilePath = path.join(
			'upload',
			`${crypto.randomUUID()}.${(file as File).type.split('/')[1]}`
		);

		try {
			await fs.access(path.join(process.cwd(), 'static', 'upload'));
		} catch (error) {
			await fs.mkdir(path.join(process.cwd(), 'static', 'upload'));
		}

		await fs.writeFile(
			path.join(process.cwd(), 'static', relativeFilePath),
			Buffer.from(await (file as Blob).arrayBuffer())
		);

		await updater(cookies, 'profilePicture', `/${relativeFilePath}`);
	}
} satisfies Actions;
