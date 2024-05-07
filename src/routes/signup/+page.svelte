<script lang="ts">
	import Button from '$lib/components/button/Button.svelte';
	import { signup } from '$lib/util/auth';

	let username = '';
	let password = '';
	let email = '';
	let phone = '';

	let errorMessage: string | null = null;
	let loading = false;

	async function invokeSignup() {
		loading = true;
		errorMessage = null;

		try {
			await signup(username, password, email, phone.length >= 1 ? phone : null);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'Something went really wrong here!';
		} finally {
			loading = false;
		}
	}
</script>

<form class="centered" on:submit|preventDefault={invokeSignup}>
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
