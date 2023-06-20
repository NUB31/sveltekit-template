import type { User } from '@prisma/client'
import { writable } from 'svelte/store'

function createUserStore() {
	const user: User | null = {
		username: 'oliste',
		email: 'oliverlhs@outlook.com',
		password: '1234',
		profilePicture: null,
		phone: null,
		id: '123',
		createdAt: new Date(),
		updatedAt: new Date()
	}

	const { subscribe } = writable(user)

	return {
		subscribe
	}
}

export const user = createUserStore()
