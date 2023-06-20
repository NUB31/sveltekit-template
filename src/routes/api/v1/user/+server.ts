import { SECRET_JWT_SECRET } from '$env/static/private'
import type { ApiResponse } from '$lib/types/ApiResponse'
import type { User } from '@prisma/client'
import { json, type RequestHandler } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export const GET: RequestHandler = async ({ cookies }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	}

	const token = cookies.get('jwt')

	if (token) {
		const { user } = jwt.verify(token, SECRET_JWT_SECRET) as { user: User }

		res.success = true
		return json(user)
	} else {
		return json(null)
	}
}
