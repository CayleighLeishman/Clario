<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import type { LayoutData } from './$types';
  import { supabaseUser } from '$lib/utils/supabaseUser';
  
  export let data: LayoutData;

  
  $: session = data.session;
</script>

<Header {session} />
<slot />
<Footer />
