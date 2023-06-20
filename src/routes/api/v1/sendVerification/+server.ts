import type { ApiResponse } from '$lib/types'
import { authorize, sendVerificationEmail } from '$lib/util'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ request }) => {
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

		try {
			const log = await sendVerificationEmail(user.id)
			console.log(log)
		} catch (error: unknown) {
			let message = 'There was an error sending your verification code'
			if (error instanceof Error) message = error.message

			res.message = message
			return json(res, { status: 500 })
		}

		res.success = true
		return json(res, { status: 200 })
	})
}
