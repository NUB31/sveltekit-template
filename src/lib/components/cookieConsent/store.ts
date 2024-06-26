import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Consent } from '$lib/types/Consent';
import { LocalStorageKeys } from '$lib/global/localStorageKeys';

function createCookieConsentStore() {
	let consent: Consent = {
		functional: true,
		dismissed: false
	};

	if (browser) {
		const stored = localStorage.getItem(LocalStorageKeys.cookieConsent);
		if (stored) {
			consent = JSON.parse(stored) as Consent;
		}
	}

	const { subscribe, update } = writable(consent);

	return {
		subscribe,
		set: (value: Consent) => {
			update(() => value);
			localStorage.setItem(LocalStorageKeys.cookieConsent, JSON.stringify(value));
		}
	};
}

export const cookieConsent = createCookieConsentStore();
