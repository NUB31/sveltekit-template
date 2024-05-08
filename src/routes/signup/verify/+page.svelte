<script lang="ts">
	import Button from '$lib/components/button/Button.svelte';
	import AuthorizedView from '$lib/components/authorizedView/AuthorizedView.svelte';
	import { toast } from '$lib/components/toast/toast';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let code = '';

	$: buttonDisabled = !(code.length === 6);

	$: {
		if (form?.dbError) {
			toast.error();
		} else if (form?.codeMissing) {
			toast.error('Code cannot be empty');
		} else if (form?.codeNotANumber) {
			toast.error('Code must be a number');
		} else if (form?.jwtTokenNotPresent) {
			toast.error('You do not appear to be logged in');
		} else if (form?.missingOrExpired) {
			toast.error('Code is invalid or expired');
		} else if (form?.verificationEmailFailedToSend) {
			toast.error('Unable to send verification code');
		}
	}
</script>

<AuthorizedView showUnauthorizedMessage>
	<form slot="authorized" action="?/verify" class="login-form" method="POST" use:enhance let:user>
		<caption>Verify email address</caption>
		<hr />
		<p>
			We have sent a verification code to '{user.email}'.
		</p>
		<div class="form-group">
			<label for="phone">Verification code</label>
			<input
				maxlength="6"
				type="text"
				bind:value={code}
				placeholder="xxxxxx"
				name="code"
				id="code"
				required
			/>
		</div>
		<div class="button-wrapper">
			<form method="POST" action="?/sendCode" use:enhance>
				<Button --width="100%" style="secondary">Send new code</Button>
			</form>
			<Button disabled={buttonDisabled} --width="100%" style="primary">Verify</Button>
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
