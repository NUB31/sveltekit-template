<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import { Button } from '$lib/components'

	export let data

	let username = ''
	let password = ''
	let email = ''
	let phone = ''

	let errorMessage: string | null = null
	let loading = false

	async function signup() {
		loading = true
		errorMessage = null

		try {
			const createUserRes = await fetch('/api/v1/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password,
					email: email,
					phone: phone.trim().length >= 1 ? phone : null
				})
			})

			if (!createUserRes.ok) {
				try {
					let data = await createUserRes.json()
					if (data.message) throw new Error(data.message)
					else {
						throw new Error('Could not create your account')
					}
				} catch (error) {
					throw error
				}
			}

			await invalidateAll()

			const sendVerificationRes = await fetch('/api/v1/sendVerification', {
				headers: {
					Authorization: `Bearer ${data.token}`
				}
			})

			if (!sendVerificationRes.ok) {
				try {
					let data = await sendVerificationRes.json()
					if (data.message) throw new Error(data.message)
					else
						throw new Error(
							'Your account has been created, but your verification email failed to send'
						)
				} catch (error) {
					throw error
				}
			}

			await goto('/signup/verify')
		} catch (error: unknown) {
			let message = 'Something went really wrong here!'
			if (error instanceof Error) message = error.message
			errorMessage = message
		} finally {
			loading = false
		}
	}
</script>

<form class="login-form" on:submit|preventDefault={signup}>
	<caption>Sign up</caption>
	<hr />
	{#if errorMessage}
		<div class="error-message">
			{errorMessage}
		</div>
	{/if}
	<div class="form-group">
		<label class="required" for="username">Username</label>
		<input
			bind:value={username}
			type="text"
			placeholder="Username"
			name="username"
			id="username"
			required
		/>
	</div>
	<div class="form-group">
		<label class="required" for="password">Password</label>
		<input
			bind:value={password}
			type="password"
			placeholder="Password"
			name="password"
			id="password"
			required
		/>
	</div>
	<div class="form-group">
		<label class="required" for="email">Email</label>
		<input
			bind:value={email}
			type="email"
			placeholder="Email"
			name="email"
			id="email"
			required
		/>
	</div>
	<div class="form-group">
		<label for="phone">Phone number</label>
		<input bind:value={phone} type="tel" placeholder="Phone number" name="phone" id="phone" />
	</div>
	<div class="button-wrapper">
		<Button {loading} --width="100%" style="primary">Next</Button>
	</div>
</form>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		width: min(100%, 55ch);
		margin-inline: auto;
	}

	.login-form > caption {
		text-align: left;
		font-weight: var(--weight-700);
		font-size: var(--font-20);
	}

	.login-form > hr {
		width: 50%;
		margin-right: 100%;
		height: 3px;
		background-color: var(--clr-accent);
		border: none;
		border-radius: var(--rounded-full);
	}

	.error-message {
		background-color: var(--clr-accent);
		padding: var(--spacing-4);
		border-radius: var(--rounded-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-4);
	}

	.form-group:not(:first-of-type) {
		margin-top: var(--spacing-16);
	}

	.form-group:first-of-type {
		margin-top: var(--spacing-16);
	}

	input[type='text'],
	input[type='email'],
	input[type='tel'],
	input[type='password'] {
		padding: var(--spacing-4) var(--spacing-8);
		border-radius: var(--rounded-8);
		background-color: var(--clr-secondary-button);
		border: none;
	}

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='tel']:focus,
	input[type='password']:focus {
		outline: 2px solid var(--clr-accent);
	}

	.button-wrapper {
		margin-top: var(--spacing-16);
	}
</style>
