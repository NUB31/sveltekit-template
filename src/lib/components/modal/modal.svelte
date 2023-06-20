<script lang="ts">
	export let open: boolean

	let modalEl: HTMLDialogElement

	$: open && modalEl?.showModal()
	$: !open && modalEl?.close()
</script>

<dialog on:cancel bind:this={modalEl}>
	<slot />
</dialog>

<style>
	dialog {
		background-color: var(--background-color, var(--clr-background-end));
		border-radius: var(--border-radius, var(--rounded-8));
		padding: var(--padding, var(--spacing-16));

		box-shadow: var(--shadow-md);
		width: min(100% - 3rem, 65ch);
		border: none;
	}
</style>
