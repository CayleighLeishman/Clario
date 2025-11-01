<script lang="ts">
  import { supabaseUser } from '$lib/supabaseUser'; // Correct file and variable
  import "$lib/styles/login.css";

  let email = '';
  let password = '';

  /**
   * Login function triggered when the form is submitted.
   * This version works safely with server session and redirects.
   */
  async function login() {
    try {
      // 1️⃣ Sign in the user using Supabase
      const { data, error } = await supabaseUser.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // 2️⃣ Reload the page so the server can see the session
      window.location.reload();

    } catch (err: any) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  }
</script>

<!-- Login form -->
<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" required />
  <input type="password" bind:value={password} placeholder="Password" required />
  <button type="submit">Login</button>
</form>
