import type { ApiResponse } from '$lib/types'
import { authorize } from '$lib/util'
import { json, type RequestHandler } from '@sveltejs/kit'

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
