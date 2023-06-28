import type { ApiResponse } from '$lib/types'
import { authorize, db, generateJwt } from '$lib/util'
import { json, type RequestHandler } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export const GET: RequestHandler = async ({ request }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	}

	return authorize(request, (err, user) => {
		if (err) {
			res.message = err
			return json(res, { status: 403 })
		}

		res.data = user

		res.success = true
		return json(res, { status: 200 })
	})
}

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const res: ApiResponse = {
		data: null,
		message: null,
		success: false
	}

	return authorize(request, async (err, user) => {
		if (err) {
			res.message = err
			return json(res, { status: 403 })
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

		const username = body.username || undefined
		let password = undefined
		const phone = body.phone || undefined
		const profilePicture = body.profilePicture || undefined

		if (body.password) password = await bcrypt.hash(body.password, 10)

		const updatedUser = await db.user.update({
			data: {
				username: username,
				password: password,
				phone: phone,
				profilePicture: profilePicture
			},
			where: {
				id: user.id
			}
		})

		cookies.set('jwt', await generateJwt(updatedUser.id), {
			path: '/'
		})

		res.data = user
		res.success = true
		return json(res, { status: 200 })
	})
}
