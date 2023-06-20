<script lang="ts">
	import { goto } from '$app/navigation'
	import { Button } from '$lib/components'

	let username = ''
	let password = ''
	let email = ''
	let phone = ''

	let errorMessage: string | null = null
	let loading = false

	async function login() {
		if (username.trim().length == 0 && password.trim().length == 0) return

		loading = true
		const res = await fetch('/api/v1/signup', {
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

		loading = false

		if (!res.ok) {
			try {
				let data = await res.json()
				if (data.message) errorMessage = data.message
			} catch (error) {
				errorMessage = 'Something went really wrong here!'
			}
		} else {
			goto('/')
		}
	}

	$: loading && (errorMessage = null)
</script>

<form class="login-form" on:submit|preventDefault={login}>
	<caption>Sign Up</caption>
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
			placeholder="username"
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
			placeholder="password"
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
			placeholder="email"
			name="email"
			id="email"
			required
		/>
	</div>
	<div class="form-group">
		<label for="phone">Phone Number</label>
		<input bind:value={phone} type="tel" placeholder="phone number" name="phone" id="phone" />
	</div>
	<Button {loading} style="primary">Log In</Button>
</form>

<style>
	.login-form {
		display: flex;
		flex-direction: column;
		width: min(100%, 55ch);
		margin-inline: auto;
		gap: var(--spacing-8);
	}

	.login-form > caption {
		text-align: left;
		font-weight: var(--weight-700);
		font-size: var(--font-20);
	}

	.error-message {
		background-color: var(--clr-accent);
		padding: var(--spacing-4);
		border-radius: var(--rounded-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2);
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
</style>
