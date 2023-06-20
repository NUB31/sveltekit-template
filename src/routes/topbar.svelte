<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import { Button } from '$lib/components'
	import type { User } from '@prisma/client'

	export let user: User | null | undefined

	let accountDialogOpen = false

	async function logout() {
		let res = await fetch('/api/v1/logout')

		if (res.ok) {
			accountDialogOpen = false
			await invalidateAll()
			await goto('/login')
		}
	}
</script>

<header class="top">
	{#if user}
		<div class="profile">
			<button on:click={() => (accountDialogOpen = !accountDialogOpen)}>
				{#if user.profilePicture}
					<img class="avatar" src={user.profilePicture} alt="avatar" />
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.232 7.232 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10Z"
						/>
					</svg>
				{/if}
			</button>
			<dialog open={accountDialogOpen}>
				<ul role="list" class="user-links">
					<li>
						<a href="/account">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"
								/>
							</svg>
							<span> Account </span>
						</a>
					</li>
				</ul>

				<div class="user-actions">
					<a href="/account/settings">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"
							/>
						</svg>
					</a>
					<button class="logout-button" on:click={logout}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="m17 8l-1.4 1.4l1.6 1.6H9v2h8.2l-1.6 1.6L17 16l4-4l-4-4M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5Z"
							/>
						</svg>
					</button>
				</div>
			</dialog>
		</div>
	{:else}
		<div class="button-group">
			<a href="/signup">
				<Button
					style="custom"
					--background-color-hover="hsl(0, 0%, 18%)"
					--background-color="hsl(0, 0%, 20%)"
					>Sign up
				</Button>
			</a>
			<a href="/login"><Button style="primary">Log in</Button></a>
		</div>
	{/if}
</header>

<style>
	.top {
		display: flex;
		height: var(--topbar-height);
		padding: var(--spacing-2) var(--spacing-8);

		align-items: center;
		justify-content: end;
		box-shadow: var(--shadow-md);
		background-color: var(--clr-background-end);
	}

	.profile {
		padding: var(--spacing-4);
		height: 100%;
		aspect-ratio: 1;
		position: relative;
		z-index: 999;
	}

	.profile > button {
		cursor: pointer;
		background: none;
		border: none;
		height: 100%;
		padding: 0;
	}

	.profile > button > img:first-of-type,
	.profile > button > svg:first-of-type {
		border-radius: var(--rounded-full);
		height: 100%;
		width: 100%;
	}

	.profile > dialog {
		border-radius: var(--rounded-4);
		inset: calc(var(--topbar-height) + 5px) 0 auto auto;
		padding: var(--spacing-8);
		min-width: 250px;
		border: none;
		background-color: var(--clr-background-end);
		box-shadow: var(--shadow-sm);
	}

	.user-links {
		padding: var(--spacing-4);
		margin: 0;
	}

	.user-links > li {
		background-color: var(--clr-secondary-button);
		border-radius: var(--rounded-4);
		display: flex;
		transition: background-color 100ms ease-in-out;
	}

	.user-links > li:hover,
	.user-links > li:focus-visible {
		background-color: var(--clr-secondary-button-hover);
	}

	.user-links > li > a {
		color: var(--clr-text);
		text-decoration: none;
		padding: var(--spacing-4) var(--spacing-8);
		flex: 1;
		display: flex;
		gap: var(--spacing-8);
	}

	.user-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: var(--spacing-8);
		padding: var(--spacing-4);
	}

	.user-actions > a,
	button {
		cursor: pointer;
		color: var(--clr-text);
	}

	.logout-button {
		border: none;
		background: none;
		color: var(--clr-accent);
	}

	.button-group {
		display: flex;
		gap: var(--spacing-8);
	}
</style>
