<script lang="ts">
	import { goto } from '$app/navigation';
	import { Routes } from '$lib/global/routes';
	import { userStore } from '$lib/store/userStore';
	import type { User } from '@prisma/client';
	import { onMount } from 'svelte';

	export let showUnauthorizedMessage = false;
	export let redirectToLogin = false;

	// Dont ask
	let user: User;
	userStore.subscribe((v) => {
		if (v) {
			user = v;
		}
	});

	onMount(() => {
		if ($userStore == null && redirectToLogin) {
			goto(Routes.login);
		}
	});
</script>

{#if $userStore}
	<slot name="authorized" {user} />
{:else if showUnauthorizedMessage}
	<h1>Unauthorized</h1>
	<p>You must be logged in to see this content</p>
{:else}
	<slot name="unauthorized" />
{/if}
