<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	// This gets the session data that was returned from the load function 
    // in the server file (+layout.server.ts)
	$: session = $page.data.session;
	// console.log("session in layout", session);

	// No need to declare 'children' or use $props(), SvelteKit handles the rendering below.

</script>

{#if session}
	<p>Logged in as **{session.user.email}**</p>
{:else}
	<p>You are not logged in</p>
{/if}

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<slot />