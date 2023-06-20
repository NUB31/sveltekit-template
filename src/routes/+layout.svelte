<script lang="ts">
	import '../styles/reset.css'
	import '../styles/global.css'
	import Topbar from './topbar.svelte'
	import Sidebar from './sidebar.svelte'
	import { CookieConsent } from '$lib/components'

	export let data
</script>

<Topbar user={data.user} />

<div class="wrapper">
	<Sidebar />
	<main>
		<slot />
	</main>
</div>

<CookieConsent />

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
