import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import type { Consent } from '../../types/Consent'

function createCookieConsentEditor() {
	let consent: Consent

	const storedConsent = browser ? localStorage.getItem('cookie_consent') || null : null

	if (storedConsent) consent = JSON.parse(storedConsent)
	else
		consent = {
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
