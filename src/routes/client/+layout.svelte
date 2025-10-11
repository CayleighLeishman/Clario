<!-- Client UI: Sidebar, Logo, and so forth -->
<script lang="ts">
	import favicon from '$lib/assets/favicon.svg'; 	//  to do: import your own favicon instead here
	import { page } from '$app/stores';

	// to do : import supabase authentication user and profile (double check if we need profile)
    let session: any; //sessiion or profile? check

	// This gets the session data that was returned from the load function 
    // in the server file (+layout.server.ts)
	$: session = $page.data.session;
	// console.log("session in layout", session);

	// Note to Future Cayleigh:
	// you dont need to declare "children" or use $props() here,
	// because Sveltekit handles the rendering usign the code 
	// "//</slot />" 
	// which is like a placeholder for whatever page is inside the laayout
</script>

	<!-- The Rendering -->
{#if session}
	<p>Logged in as **{session.user.email}**</p><!-- to do: check if "session.user.email"needs to be "profile.user.email" -->
{:else}
	<p>You are not logged in</p>
	<!-- set route back to sign in page -->
{/if}

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<slot />