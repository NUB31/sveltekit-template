import { SECRET_JWT_SECRET } from '$env/static/private'
import { db } from '$lib/database'
import type { ApiResponse } from '$lib/types/ApiResponse'
import { json, type RequestHandler } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const POST: RequestHandler = async ({ request, cookies }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	}

	if (!request.body) {
		res.message = 'Request does not have a body'
		return json(res, { status: 422 })
	}

	let body
	try {
		body = await request.json()
	} catch (error) {
		res.message = 'Could not parse JSON'
		return json(res, { status: 400 })
	}

	if (!body.username || !body.password || !body.email) {
		res.message =
			'Body must contain a username, password and email address. You can also optionally include a phone number and a profile picture'
		return json(res, { status: 422 })
	}

	const user = await db.user.create({
		data: {
			username: body.username,
			password: await bcrypt.hash(body.password, 10),
			email: body.email,
			phone: body.phone || null,
			profilePicture: body.profilePicture || null
		}
	})

	user.password = '' // Hide password from jwt
	const token = jwt.sign({ user: user }, SECRET_JWT_SECRET, {
		expiresIn: '30d'
	})

	cookies.set('jwt', token)

	res.success = true
	return json(res, { status: 201 })
}
