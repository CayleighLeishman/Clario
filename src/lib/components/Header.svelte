<!-- to do : find the  -->

<script lang="ts">
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import logo from '$lib/assets/favicon.svg'; // import the image
</script>

<header class="app-header">
  <img src={logo} alt="Clario Logo" class="logo" />
	<h1>Clario</h1>

	<nav>
		<a href="/client/dashboard">Dashboard</a>
		<a href="/client/classnotes">Class Notes</a>
	</nav>

	<ThemeToggle />
</header>

<style>
</style>
