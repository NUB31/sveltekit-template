import type { User } from '@prisma/client'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	let user: User | null = null
	const token = cookies.get('jwt')

	if (token) {
		const res = await fetch('/api/v1/user/me', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		if (res.ok) {
			const data = await res.json()
			user = data.data
		}
	}

	return {
		user: user,
		token: token
	}
}
