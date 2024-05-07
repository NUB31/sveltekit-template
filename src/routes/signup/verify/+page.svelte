<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/button/Button.svelte';
	import type { ErrorOrT } from '$lib/types/ErrorOrT.js';
	import { userStore } from '$lib/store/userStore';

	let code = '';

	let errorMessage: string | null = null;
	let loading = false;
	let buttonDisabled = true;

	async function sendCode() {
		buttonDisabled = true;
		try {
			const res = await fetch('/api/v1/sendVerification');

			if (!res.ok) {
				try {
					let data = await res.json();
					if (data.message) throw new Error(data.message);
					else throw new Error('Your verification email failed to send');
				} catch (error) {
					throw error;
				}
			}
		} catch (error: unknown) {
			let message = 'Something went really wrong here!';
			if (error instanceof Error) message = error.message;
			errorMessage = message;
		} finally {
			buttonDisabled = false;
		}
	}

	async function verify() {
		loading = true;
		errorMessage = null;

		try {
			const res = await fetch('/api/v1/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code: code
				})
			});

			if (!res.ok) {
				let data = (await res.json()) as ErrorOrT<boolean>;
				try {
					if (data.error) throw new Error(data.error);
					else throw new Error('Could not verify your code');
				} catch (error) {
					throw error;
				}
			}

			await invalidateAll();
			await goto('/');
		} catch (error: unknown) {
			let message = 'Something went really wrong here!';
			if (error instanceof Error) message = error.message;
			errorMessage = message;
		} finally {
			loading = false;
		}
	}

	$: buttonDisabled = !(code.length === 6);
</script>

<form class="login-form" on:submit|preventDefault={verify}>
	<caption>Verify email address</caption>
	<hr />
	<p>
		We have sent a verification code to '{$userStore?.email}'.
	</p>
	{#if errorMessage}
		<div class="error-message">
			{errorMessage}
		</div>
	{/if}
	<div class="form-group">
		<label for="phone">Verification code</label>
		<input
			bind:value={code}
			maxlength="6"
			type="text"
			placeholder="xxxxxx"
			name="code"
			id="code"
			required
		/>
	</div>
	<div class="button-wrapper">
		<Button
			on:click={sendCode}
			disabled={loading}
			--width="100%"
			style="secondary"
			type="button"
		>
			Send new code
		</Button>
		<Button disabled={buttonDisabled} {loading} --width="100%" style="primary">Verify</Button>
	</div>
</form>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		width: min(100%, 32ch);
		margin-inline: auto;
		text-align: center;
	}

	.login-form > p {
		text-wrap: balance;
		text-align: left;
	}

	.login-form > caption {
		font-weight: var(--weight-700);
		font-size: var(--font-20);
	}

	.login-form > hr {
		width: 100%;
		margin-right: 100%;
		margin-bottom: var(--spacing-12);
		height: 3px;
		background-color: var(--clr-accent);
		border: none;
		border-radius: var(--rounded-full);
	}

	.error-message {
		background-color: var(--clr-accent);
		padding: var(--spacing-4);
		border-radius: var(--rounded-4);
		margin-top: var(--spacing-12);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.form-group > label {
		text-align: left;
	}

	.form-group:not(:first-of-type) {
		margin-top: var(--spacing-16);
	}

	.form-group:first-of-type {
		margin-top: var(--spacing-16);
	}

	input[type='text'] {
		padding: var(--spacing-4) var(--spacing-8);
		border-radius: var(--rounded-8);
		background-color: var(--clr-secondary-button);
		border: none;
	}

	input[type='text']:focus {
		outline: 2px solid var(--clr-accent);
	}

	.button-wrapper {
		margin-top: var(--spacing-16);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
	}
</style>
