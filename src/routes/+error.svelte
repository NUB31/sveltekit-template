<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="wrapper">
	<h1 class="status">
		{$page.status}
	</h1>
	<p class="message">
		{$page.error?.message}
	</p>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.status {
		font-size: var(--font-64);
		color: var(--clr-accent);
	}

	.message {
		font-size: var(--font-20);
	}
</style>
