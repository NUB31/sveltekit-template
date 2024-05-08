<script lang="ts">
	import { enhance } from '$app/forms';
	import AuthorizedView from '$lib/components/authorizedView/AuthorizedView.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import { userStore } from '$lib/store/userStore';
	import { toast } from '$lib/components/toast/toast';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let files: FileList;
	let username = $userStore?.username ?? '';
	let phone = $userStore?.phone ?? '';

	$: {
		if (form?.success) {
			toast.success();
		} else if (form?.fileMissing) {
			toast.error('No file provided');
		} else if (form?.jwtTokenNotPresent) {
			toast.error('An error occurred, please log in again');
		} else if (form?.emailMissing) {
			toast.error('Email cannot be empty');
		} else if (form?.jwtInvalid) {
			toast.error('Token is invalid, please log in again');
		} else if (form?.passwordMissing) {
			toast.error('Password cannot be empty');
		} else if (form?.phoneMissing) {
			toast.error('Phone number cannot be empty');
		} else if (form?.usernameMissing) {
			toast.error('Username cannot be empty');
		}
	}
</script>

<AuthorizedView redirectToLogin>
	<form slot="authorized" class="centered" let:user>
		<caption>Account Settings</caption>
		<hr />
		<form action="?/updateUsername" method="POST" use:enhance class="form-group">
			<label for="username">Username: </label>
			<div class="form-row">
				<input bind:value={username} type="text" name="username" id="username" />
				<Button disabled={username == user.username} style="primary">Save</Button>
			</div>
		</form>
		<form action="?/updatePassword" method="POST" use:enhance class="form-group">
			<label for="password">Password: </label>
			<div class="form-row">
				<input type="password" name="password" id="password" />
				<Button style="primary">Save</Button>
			</div>
		</form>
		<form action="?/updatePhone" method="POST" use:enhance class="form-group">
			<label for="phone">Phone number: </label>
			<div class="form-row">
				<input bind:value={phone} type="text" name="phone" id="phone" />
				<Button disabled={phone == user.phone} style="primary">Save</Button>
			</div>
		</form>
		<form
			action="?/updateProfilePicture"
			enctype="multipart/form-data"
			method="POST"
			use:enhance
			class="form-group"
		>
			<label for="file">Profile picture: </label>
			<div class="form-row">
				<input
					bind:files
					id="file"
					multiple={false}
					name="file"
					type="file"
					accept="image/*"
				/>
				<Button style="primary" disabled={!files}>Save</Button>
			</div>
		</form>
	</form>
</AuthorizedView>
