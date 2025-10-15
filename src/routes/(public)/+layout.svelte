<script lang="ts">
  
  import '$lib/styles/global.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type {LayoutData } from './$types';

  // import { page } from '$app/stores';
  // This line is like saying: "Hey, I'm waiting for a data package from the server."
  // This package ('data') holds the user's current login status.
  export let data: LayoutData;
   
  // This line creates a simple nickname ('session') for the user's status 
  // that's inside the big data package.
  // The '$:' is a magic dollar sign in Svelte. It means: 
  // "If the original status changes (like logging in or out), 
  // automatically update this 'session' nickname everywhere on the page!"
  $: session = data.session;   
</script>

<Header session={session} />
<slot />
<Footer />