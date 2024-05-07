<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button/Button.svelte';
	import type { ErrorOrT } from '$lib/types/ErrorOrT.js';
	import { Routes } from '$lib/global/routes';
	import { authStateChanged, sendVerification } from '$lib/util/auth';
	import type { User } from '@prisma/client';
	import AuthorizedView from '$lib/components/authorizedView/AuthorizedView.svelte';

	let code = '';

	let errorMessage: string | null = null;
	let loading = false;
	let buttonDisabled = true;

	async function invokeSendVerificationCode() {
		buttonDisabled = true;
		try {
			await sendVerification();
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Something went really wrong here!';
		} finally {
			buttonDisabled = false;
		}
	}

	async function verify() {
		loading = true;
		errorMessage = null;

		try {
			const res = await fetch(Routes.api.verify, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					code: code
				})
			});

			let data = (await res.json()) as ErrorOrT<User>;
			if (data.error) {
				throw new Error(data.error);
			}

			await authStateChanged(data.data);
			await goto(Routes.home);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Something went really wrong here!';
		} finally {
			loading = false;
		}
	}

	$: buttonDisabled = !(code.length === 6);
</script>

<AuthorizedView showUnauthorizedMessage>
	<form slot="authorized" class="login-form" on:submit|preventDefault={verify} let:user>
		<caption>Verify email address</caption>
		<hr />
		<p>
			We have sent a verification code to '{user.email}'.
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
				on:click={invokeSendVerificationCode}
				disabled={loading}
				--width="100%"
				style="secondary"
				type="button"
			>
				Send new code
			</Button>
			<Button disabled={buttonDisabled} {loading} --width="100%" style="primary"
				>Verify</Button
			>
		</div>
	</form>
</AuthorizedView>

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
