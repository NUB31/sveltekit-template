<script lang="ts">
	import Button from '$lib/components/button/Button.svelte';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { toast } from '$lib/components/toast/toast';

	export let form: ActionData;

	$: {
		if (form?.passwordEmpty) {
			toast.error('Password cannot be empty');
		} else if (form?.passwordIncorrect) {
			toast.error('Password is incorrect');
		} else if (form?.userNotFound) {
			toast.error('User was not found');
		} else if (form?.usernameEmpty) {
			toast.error('Username cannot be empty');
		}
	}
</script>

<form method="POST" class="centered" use:enhance>
	<caption>Log in</caption>
	<hr />
	<div class="form-group">
		<label class="required" for="username">Username</label>
		<input type="text" placeholder="Username" name="username" id="username" required />
	</div>
	<div class="form-group">
		<label class="required" for="password">Password</label>
		<input type="password" placeholder="Password" name="password" id="password" required />
	</div>
	<Button --margin-top="var(--spacing-16)" style="primary">Log in</Button>
</form>
