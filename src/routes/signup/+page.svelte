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

<form class="centered" on:submit|preventDefault={signup}>
	<caption>Sign up</caption>
	<hr />
	{#if errorMessage}
		<div class="error-message" style="margin-top: var(--spacing-12);">
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
	<Button {loading} --margin-top="var(--spacing-16)" style="primary">Next</Button>
</form>
