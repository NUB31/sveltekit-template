<script lang="ts">
	import { toast, toasts } from '$lib/components/toast/toast';
	import { fade } from 'svelte/transition';
	import InfoIcon from '../icons/severity/InfoIcon.svelte';
	import WarningIcon from '../icons/severity/WarningIcon.svelte';
	import ErrorIcon from '../icons/severity/ErrorIcon.svelte';
	import SuccessIcon from '../icons/severity/SuccessIcon.svelte';
</script>

{#if $toasts.length >= 1}
	<div class="toast-container">
		{#each $toasts as toastItem}
			<div
				class:error={toastItem.type === 'error'}
				class:success={toastItem.type === 'success'}
				class:warning={toastItem.type === 'warning'}
				class:info={toastItem.type === 'info'}
				class="toast"
				transition:fade={{ duration: 200 }}
			>
				<div class="toast-icon">
					{#if toastItem.type === 'info'}
						<InfoIcon style="width: 1.75rem;" />
					{:else if toastItem.type === 'warning'}
						<WarningIcon style="width: 1.75rem;" />
					{:else if toastItem.type === 'error'}
						<ErrorIcon style="width: 1.75rem;" />
					{:else if toastItem.type === 'success'}
						<SuccessIcon style="width: 1.75rem;" />
					{/if}
				</div>

				<p class="toast-text">
					{toastItem.text}
				</p>

				<button on:click={() => toast.dismiss(toastItem.id)} class="toast-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="toast-button-icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: 0;
		right: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		align-items: end;
	}

	.toast {
		padding: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
		border-width: 2px;
		border-style: solid;
		border-radius: 0.5rem;
		min-width: 300px;
		width: fit-content;
	}

	.toast.error {
		background-color: var(--clr-error-400);
		border-color: var(--clr-error-500);
	}
	.toast.warning {
		background-color: var(--clr-warning-400);
		border-color: var(--clr-warning-500);
	}
	.toast.success {
		background-color: var(--clr-success-400);
		border-color: var(--clr-success-500);
	}
	.toast.info {
		background-color: var(--clr-info-400);
		border-color: var(--clr-info-500);
	}

	.toast.error > .toast-icon {
		color: var(--clr-error-600);
	}
	.toast.warning > .toast-icon {
		color: var(--clr-warning-600);
	}
	.toast.success > .toast-icon {
		color: var(--clr-success-600);
	}
	.toast.info > .toast-icon {
		color: var(--clr-info-600);
	}

	.toast-text {
		flex-grow: 1;
		font-weight: 600;
	}

	.toast-button {
		flex-shrink: 0;
		outline: none;
		background: none;
		border: none;
		cursor: pointer;
	}

	.toast-button-icon {
		width: 1.5rem;
	}
</style>
