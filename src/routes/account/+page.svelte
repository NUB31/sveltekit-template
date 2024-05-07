<script lang="ts">
	import AuthorizedView from '$lib/components/authorizedView/AuthorizedView.svelte';
</script>

<AuthorizedView redirectToLogin>
	<div slot="authorized" let:user>
		<h1>{user.username}</h1>
		<ul>
			<li>
				Id: {user.id}
			</li>
			<li>
				Email: {user.email}
			</li>
			<li>
				Phone number: {user.phone}
			</li>
			<li>
				Verified: {user.isVerified}
			</li>
			<li>
				Created at: {user.createdAt}
			</li>
			<li>
				Updated at: {user.updatedAt}
			</li>
		</ul>
	</div>
</AuthorizedView>
