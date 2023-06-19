<script lang="ts">
	import { browser } from '$app/environment'

	let sidebarOpen = browser ? document.body.clientWidth > 850 : false
</script>

<aside
	class={`sidebar ${!sidebarOpen ? 'contracted' : ''}`}
	style={`${!sidebarOpen ? '--sidebar-width: 4rem' : ''}`}
>
	<header>
		<a href="/"><img src="https://placehold.co/250x125" alt="logo" /></a>
	</header>
	<nav class="links-section">
		<ul role="list" class="links">
			<li class="link">
				<a href="/">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
					>
						<path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5Z" />
					</svg>
					<span> Home </span>
				</a>
			</li>
			<li class="link">
				<a href="/about">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"
						/>
					</svg>
					<span> About </span>
				</a>
			</li>
			<li class="link">
				<a target="_blank" href="https://github.com/nub31/sveltekit_template">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
						/>
					</svg>
					<span> GitHub </span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="contract-button-wrapper">
		<button class="contract-button" on:click={() => (sidebarOpen = !sidebarOpen)}>
			{#if sidebarOpen}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M21 15.61L19.59 17l-5.01-5l5.01-5L21 8.39L17.44 12L21 15.61M3 6h13v2H3V6m0 7v-2h10v2H3m0 5v-2h13v2H3Z"
					/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M3 6h10v2H3V6m0 10h10v2H3v-2m0-5h12v2H3v-2m13-4l-1.42 1.39L18.14 12l-3.56 3.61L16 17l5-5l-5-5Z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</aside>

<style>
	/* Expanded styling */
	.sidebar {
		width: var(--sidebar-width);
		background-color: var(--clr-background-end);
		padding: 0 var(--spacing-4) var(--spacing-4) var(--spacing-4);
		position: relative;
		z-index: 1;
		transition: width 100ms ease-in-out;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-8);
	}

	.links-section {
		flex: 1;
		overflow: auto;
	}

	.links {
		display: flex;
		flex-direction: column;
		padding: 0;
		gap: var(--spacing-4);
		margin: 0;
	}

	.link > a {
		display: flex;
		align-items: center;
		padding: var(--spacing-4);
		border-radius: var(--rounded-4);
		text-decoration: none;
		color: var(--clr-text);
		background-color: var(--clr-secondary-button);
		transition: background-color 100ms ease-in-out;
	}

	.link > a:hover,
	.link > a:focus-visible {
		background-color: var(--clr-secondary-button-hover);
	}

	.link > a > svg:first-of-type {
		margin-right: var(--spacing-8);
		flex-shrink: 0;
	}

	.link > a {
		display: flex;
	}

	.contract-button {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: var(--spacing-4);
		border-radius: var(--rounded-full);
		transition: background-color 100ms ease-in-out;
	}

	.contract-button:hover,
	.contract-button:focus-visible {
		background-color: var(--clr-secondary-button-hover);
	}

	/* Contracted Styling */
	.sidebar.contracted > header {
		display: none;
	}

	.sidebar.contracted .links {
		align-items: center;
		justify-content: center;
	}

	.sidebar.contracted .link > a {
		background-color: transparent;
		border-radius: var(--rounded-full);
	}

	.sidebar.contracted .link > a:hover,
	.sidebar.contracted .link > a:focus-visible {
		background-color: var(--clr-secondary-button-hover);
	}

	.sidebar.contracted .link > a > *:not(svg) {
		display: none;
	}

	.sidebar.contracted .link > a > svg:first-of-type {
		margin: 0;
	}

	.sidebar.contracted .link > a::after {
		display: none;
	}

	.sidebar.contracted .contract-button-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Rounded top left corner */
	.sidebar::after {
		--_corner-size: 15px;

		content: '';
		width: var(--_corner-size);
		aspect-ratio: 1;
		position: absolute;
		right: 0;
		top: 0;
		transform: translate(100%);
		border-top-left-radius: var(--rounded-full);
		box-shadow: calc(var(--_corner-size) / 5 * -1) calc(var(--_corner-size) / 5 * -1) 0
			calc(var(--_corner-size) / 5) var(--clr-background-end);
		filter: drop-shadow(var(--shadow-md));
		z-index: -1;
	}
</style>
