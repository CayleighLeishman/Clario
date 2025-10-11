<script lang="ts">
  import '$lib/styles/global.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<!--
  This tells the app to show the header at the top(<Header />),
  the page-specific content in the middle (<slot />),
  and the footer (<Footer />) at the bottom.
  Everything here applies to ALL pages automatically.
-->
<Header />
<slot />
<Footer />