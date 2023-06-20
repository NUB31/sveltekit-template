import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import type { Consent } from '$lib/types'

function createCookieConsentEditor() {
	const storedJson = browser ? localStorage.getItem('cookie_consent') || null : null
	let storedConsent

	try {
		storedConsent = storedJson ? JSON.parse(storedJson) : null
	} catch {
		if (browser) localStorage.removeItem('cookie_consent')
	}

	const consent = storedConsent || {
		functional: true,
		tracking: false,
		advertising: false,
		marketing: false,
		displayModal: true
	}

	const { subscribe, update } = writable(consent)

	return {
		subscribe,
		set: (value: Consent) => {
			update(() => value)
			localStorage.setItem('cookie_consent', JSON.stringify(value))
		}
	}
}

export const cookieConsent = createCookieConsentEditor()
