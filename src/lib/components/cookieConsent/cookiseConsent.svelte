<script lang="ts">
	import { cookieConsent } from './store'
	import { Button, Modal } from '..'
</script>

<Modal
	on:cancel={(e) => {
		e.preventDefault()
	}}
	open={$cookieConsent.displayModal}
>
	<h2>Do you consent to using cookies?</h2>
	<p class="description">
		This site uses some purely functional cookies for functionality such as dark/light theme,
		language and saving your cookie consent choice.
	</p>
	<p class="description">
		The site also uses some non-functional cookies for functionality such as analytics and 3rd
		party content (google maps, payments etc.)
	</p>
	<div class="selection-group">
		<span class="checkbox-group">
			<label for="tracking">Allow tracking</label>
			<input
				bind:checked={$cookieConsent.tracking}
				type="checkbox"
				name="tracking"
				id="tracking"
			/>
		</span>
		<span class="checkbox-group">
			<label for="marketing">Allow marketing</label>
			<input
				bind:checked={$cookieConsent.marketing}
				type="checkbox"
				name="marketing"
				id="marketing"
			/>
		</span>
		<span class="checkbox-group">
			<label for="advertising">Allow advertising</label>
			<input
				bind:checked={$cookieConsent.advertising}
				type="checkbox"
				name="advertising"
				id="advertising"
			/>
		</span>
	</div>
	<div class="button-group">
		<Button
			on:click={() => {
				$cookieConsent = {
					functional: true,
					advertising: false,
					marketing: false,
					tracking: false,
					displayModal: false
				}
			}}
			style="secondary">Reject All</Button
		>
		<Button
			on:click={() => {
				$cookieConsent.displayModal = false
			}}
			style="primary">Accept Selected</Button
		>
	</div>
</Modal>

<button on:click={() => ($cookieConsent.displayModal = true)} class="cookie-button">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			d="M12 3a9 9 0 0 0-9 9a9 9 0 0 0 9 9a9 9 0 0 0 9-9c0-.5-.04-1-.13-1.5C20.6 10 20 10 20 10h-2V9c0-1-1-1-1-1h-2V7c0-1-1-1-1-1h-1V4c0-1-1-1-1-1M9.5 6A1.5 1.5 0 0 1 11 7.5A1.5 1.5 0 0 1 9.5 9A1.5 1.5 0 0 1 8 7.5A1.5 1.5 0 0 1 9.5 6m-3 4A1.5 1.5 0 0 1 8 11.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 5 11.5A1.5 1.5 0 0 1 6.5 10m5 1a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5m5 2a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5M11 16a1.5 1.5 0 0 1 1.5 1.5A1.5 1.5 0 0 1 11 19a1.5 1.5 0 0 1-1.5-1.5A1.5 1.5 0 0 1 11 16Z"
		/>
	</svg>
</button>

<style>
	.description:not(:first-of-type) {
		margin-top: var(--spacing-4);
	}

	.selection-group {
		margin-top: var(--spacing-16);
		display: flex;
		justify-content: space-evenly;
		gap: var(--spacing-8);
		flex-wrap: wrap;
	}

	.button-group {
		margin-top: var(--spacing-16);
		display: flex;
		justify-content: end;
		gap: var(--spacing-8);
		flex-wrap: wrap;
	}

	.cookie-button {
		display: block;
		position: fixed;
		inset: auto var(--spacing-8) var(--spacing-8) auto;
		width: 2rem;
		aspect-ratio: 1;
		background-color: var(--clr-secondary-button);
		border: none;
		border-radius: var(--rounded-full);
		padding: var(--spacing-2);
		cursor: pointer;
		transition: background-color 100ms ease-in-out;
	}

	.cookie-button:hover,
	.cookie-button:focus-visible {
		background-color: var(--clr-secondary-button-hover);
	}

	.cookie-button > svg {
		width: 100%;
		height: 100%;
	}
</style>
