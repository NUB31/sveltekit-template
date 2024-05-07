<script lang="ts">
	import Button from '$lib/components/button/Button.svelte';
	import { login } from '$lib/util/auth';

	let username = '';
	let password = '';

	let errorMessage: string | null = null;
	let loading = false;

	async function invokeLogin() {
		if (username.trim().length == 0 && password.trim().length == 0) return;

		loading = true;
		try {
			await login(username, password);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	$: loading && (errorMessage = null);
</script>

<form class="centered" on:submit|preventDefault={invokeLogin}>
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
