<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/button/button.svelte';

	export let data;

	let username = data.user?.username || '';
	let password = '';
	let profilePicture = data.user?.profilePicture || '';
	let phone = data.user?.phone || '';

	let files: FileList;

	let errorMessage: string | null = null;
	let userUpdateLoading = false;
	let fileUploadLoading = false;

	async function updateAccountSettings() {
		errorMessage = null;
		userUpdateLoading = true;

		const res = await fetch('/api/v1/user/me', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`
			},
			body: JSON.stringify({
				username: username.trim() !== data.user?.username ? username : null,
				password: password.trim().length >= 1 ? password : null,
				profilePicture:
					profilePicture.trim() !== data.user?.profilePicture ? profilePicture : null,
				phone: phone.trim() !== data.user?.phone ? phone : null
			})
		});

		userUpdateLoading = false;

		if (!res.ok) {
			try {
				let data = await res.json();
				if (data.message) errorMessage = data.message;
			} catch (error) {
				errorMessage = 'Something went really wrong here!';
			}
		} else {
			await invalidateAll();
		}
	}

	async function uploadProfilePicture() {
		errorMessage = null;
		fileUploadLoading = true;

		if (!files || files.length == 0) return;
		if (files[0].size > 10000000) {
			errorMessage = 'Maximum file size allowed is 10mb';
			return;
		}

		let fd = new FormData();
		fd.append('file', files[0]);

		const res = await fetch('/api/v1/upload', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${data.token}`
			},
			body: fd
		});

		fileUploadLoading = false;

		if (!res.ok) {
			try {
				let data = await res.json();
				if (data.message) errorMessage = data.message;
			} catch (error) {
				errorMessage = 'Something went really wrong here!';
			}
		} else {
			let data = await res.json();
			profilePicture = data.data;
		}
	}
</script>

<form class="centered" on:submit|preventDefault={updateAccountSettings}>
	<caption>Account Settings</caption>
	<hr />
	{#if errorMessage}
		<div class="error-message" style="margin-top: var(--spacing-12);">
			{errorMessage}
		</div>
	{/if}
	<div class="form-group">
		<label for="username">Username: </label>
		<input type="text" id="username" bind:value={username} />
	</div>
	<div class="form-group">
		<label for="password">Password: </label>
		<input type="password" id="password" bind:value={password} />
	</div>
	<div class="form-group">
		<label for="phone">Phone number: </label>
		<input type="text" id="phone" bind:value={phone} />
	</div>
	<div class="form-group">
		<label for="profile-picture">Profile picture: </label>
		<div class="file-group">
			<input bind:files type="file" accept="image/*" />
			<Button
				loading={fileUploadLoading}
				disabled={!files}
				on:click={uploadProfilePicture}
				type="button"
			>
				Upload
			</Button>
		</div>
		<input disabled type="text" id="profile-picture" bind:value={profilePicture} />
	</div>
	<Button loading={userUpdateLoading} style="primary" --margin-top="var(--spacing-16)">
		Save
	</Button>
</form>

<style>
	.file-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
