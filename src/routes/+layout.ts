import { goto } from '$app/navigation'
import type { User } from '@prisma/client'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async ({ fetch }) => {
	const res = await fetch('/api/v1/user', {
		credentials: 'include'
	})

	if (!res.ok) goto('/login')
	else {
		const user: User | null = await res.json()

		return {
			user: user
		}
	}
}
