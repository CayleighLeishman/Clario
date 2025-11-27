<!-- // src/routes/client/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
	import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import "$lib/styles/dashboards.css";

  type ClientSession = {
    userId: string;
    role: 'client' | 'admin' | 'transcriber';
    email: string;
  };

  let session: ClientSession | null = null;

  $: session = $page.data.session; // TS now knows this is ClientSession
</script>

{#if session}
  <p class="greeting">Hello, {session.email}!</p>
{/if}

<slot />


