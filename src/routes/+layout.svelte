<script lang="ts">
	import '../styles/reset.css';
	import '../styles/global.css';
	import Topbar from './Topbar.svelte';
	import Sidebar from './Sidebar.svelte';
	import CookieConsent from '$lib/components/cookieConsent/CookieConsent.svelte';
	import ToastProvider from '$lib/components/toast/ToastProvider.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/store/userStore';
	import { Routes } from '$lib/global/routes';

	onMount(async () => {
		if ($userStore && $userStore.isVerified == false) {
			await goto(Routes.verify);
		}
	});
</script>

<Topbar />

<div class="wrapper">
	<Sidebar />
	<main>
		<slot />
	</main>
</div>

<CookieConsent />
<ToastProvider />

<style>
	/* Wrapper */
	.wrapper {
		display: flex;
		height: calc(100% - var(--topbar-height));
		position: relative;
		overflow: hidden;
	}

	/* Main */
	main {
		flex: 1;
		padding: var(--spacing-16);
		overflow: auto;
		border-radius: var(--rounded-4);
	}
</style>
