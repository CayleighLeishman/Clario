<!-- src/lib/components/Await.svelte -->
<script lang="ts">
  export let message: string = 'Loading...';
</script>

<style>
  .loading-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f9f9f9;
    font-family: 'Segoe UI', sans-serif;
    color: #444;
  }

  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #6c63ff; /* cute accent color */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
  }
</style>

<div class="loading-screen">
  <div class="spinner"></div>
  <p>{message}</p>
</div>
