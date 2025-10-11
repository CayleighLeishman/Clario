<script lang="ts">
  import { onMount } from 'svelte';

  let theme: 'light' | 'dark' = 'light';

//   This runs when the component is first added to the page, 
// (will only run in browser) not during server-side rendering
  onMount(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      theme = saved;
    }
  });

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
</script>

<button on:click={toggleTheme}>
  Toggle Theme (current: {theme})
</button>
