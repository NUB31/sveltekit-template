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
		width: min(100% - 3rem, 65ch);
		border: none;
		border-radius: var(--rounded-8);
		box-shadow: var(--shadow-md);
		background-color: var(--clr-background-end);
		padding: var(--spacing-16);
	}
</style>
