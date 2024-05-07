<script lang="ts">
	import AuthorizedView from '$lib/components/authorizedView/AuthorizedView.svelte';
	import Button from '$lib/components/button/Button.svelte';
	import { toast } from '$lib/components/toast/toast';
	import { Routes } from '$lib/global/routes';
	import { userStore } from '$lib/store/userStore';
	import type { ErrorOrT } from '$lib/types/ErrorOrT';
	import { authStateChanged } from '$lib/util/auth';
	import type { User } from '@prisma/client';

	let username = $userStore?.username || '';
	let password = '';
	let profilePicture = $userStore?.profilePicture || '';
	let phone = $userStore?.phone || '';

	let files: FileList;

	let errorMessage: string | null = null;
	let userUpdateLoading = false;
	let fileUploadLoading = false;

	async function updateAccountSettings() {
		errorMessage = null;
		userUpdateLoading = true;

		const res = await fetch(Routes.api.myAccount, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: username.trim() !== $userStore?.username ? username : null,
				password: password.trim().length >= 1 ? password : null,
				profilePicture:
					profilePicture.trim() !== $userStore?.profilePicture ? profilePicture : null,
				phone: phone.trim() !== $userStore?.phone ? phone : null
			})
		});

		userUpdateLoading = false;

		const data = (await res.json()) as ErrorOrT<User>;
		if (data.data) {
			authStateChanged(data.data);
			toast.success('Successfully updated profile');
		} else {
			errorMessage = data.error;
			toast.error(data.error);
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

		const res = await fetch(Routes.api.upload, {
			method: 'POST',
			body: fd
		});

		fileUploadLoading = false;

		const data = (await res.json()) as ErrorOrT<string>;
		if (data.data) {
			profilePicture = data.data;
			toast.info('Image uploaded successfully');
		} else {
			toast.error(data.error);
		}
	}
</script>

<AuthorizedView redirectToLogin>
	<form slot="authorized" class="centered" on:submit|preventDefault={updateAccountSettings}>
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
</AuthorizedView>

<style>
	.file-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
