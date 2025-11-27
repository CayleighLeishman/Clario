<script lang="ts">
  import { supabaseUser } from '$lib/utils/supabaseUser'; // Correct file and variable
  import { goto } from '$app/navigation';
  import '$lib/styles/login.css';
  import '$lib/styles/public.css';

  let email = '';
  let password = '';
 console.log('src/login/+page.svelte line 7: supabaseUser:', supabaseUser);
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
 // 2️⃣ Get the session with user_metadata (role)
      const { data: sessionData } = await supabaseUser.auth.getSession();
      const session = sessionData.session;

      if (!session) throw new Error("No session returned");

      const role = session.user.user_metadata.role;

      // 3️⃣ Redirect based on role
      if (role === 'client') {
        goto('/client/dashboard');
      } else if (role === 'transcriber') {
        goto('/transcriber/dashboard');
      } else if (role === 'admin') {
        goto('/admin/dashboard');
      } else {
        alert('Unknown user role: ' + role);
      }

    } catch (err: any) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  }
</script>


<div class="login-page">
  <form on:submit|preventDefault={login}>
  <label for="email">Email</label>
  <input id="email" type="email" bind:value={email} placeholder="Email" required />

  <label for="password">Password</label>
  <input id="password" type="password" bind:value={password} placeholder="Password" required />

  <div class="login-actions">
    <button class="btn" type="submit">Login</button>
    <a href="/register" class="btn">Create Account</a>
  </div>
</form>
</div>