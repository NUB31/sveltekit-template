<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button/Button.svelte';
	import { toast } from '$lib/components/toast/toast';
	import { Routes } from '$lib/global/routes';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: {
		if (form?.dbError) {
			toast.error();
		} else if (form?.emailEmpty) {
			toast.error('Email cannot be empty');
		} else if (form?.passwordEmpty) {
			toast.error('Password cannot be empty');
		} else if (form?.usernameEmpty) {
			toast.error('Username cannot be empty');
		} else if (form?.usernameTaken) {
			toast.error('Username is already taken');
		} else if (form?.verificationEmailFailedToSend) {
			toast.warning(
				'Your account was created, however your verification email failed to send'
			);
			goto(Routes.home);
		}
	}
</script>

<form class="centered" method="POST" use:enhance>
	<caption>Sign up</caption>
	<hr />
	<div class="form-group">
		<label class="required" for="username">Username</label>
		<input type="text" placeholder="Username" name="username" id="username" required />
	</div>
	<div class="form-group">
		<label class="required" for="password">Password</label>
		<input type="password" placeholder="Password" name="password" id="password" required />
	</div>
	<div class="form-group">
		<label class="required" for="email">Email</label>
		<input type="email" placeholder="Email" name="email" id="email" required />
	</div>
	<div class="form-group">
		<label for="phone">Phone number</label>
		<input type="tel" placeholder="Phone number" name="phone" id="phone" />
	</div>
	<Button --margin-top="var(--spacing-16)" style="primary">Next</Button>
</form>
