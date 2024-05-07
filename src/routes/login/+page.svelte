<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Button from '$lib/components/button/button.svelte';

	export let data;

	let username = '';
	let password = '';

	let errorMessage: string | null = null;
	let loading = false;

	async function login() {
		if (username.trim().length == 0 && password.trim().length == 0) return;

		loading = true;
		const res = await fetch('/api/v1/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username,
				password: password
			})
		});

		loading = false;

		if (!res.ok) {
			try {
				let data = await res.json();
				if (data.message) errorMessage = data.message;
			} catch (error) {
				errorMessage = 'Something went really wrong here!';
			}
		} else {
			await invalidateAll();
			if (data?.user?.isVerified === false) goto('/signup/verify');
			else await goto('/');
		}
	}

	$: loading && (errorMessage = null);
</script>

<form class="centered" on:submit|preventDefault={login}>
	<caption>Log in</caption>
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
	<Button {loading} --margin-top="var(--spacing-16)" style="primary">Log in</Button>
</form>
