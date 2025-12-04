<!-- src/routes/(public)/register/+page.svelte -->
<script lang="ts">
  import { supabaseUser } from '$lib/utils/supabaseUser';
  import { goto } from '$app/navigation';

  let full_name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let role: 'client' | 'transcriber' = 'client';

  let errorMessage = '';
  let successMessage = '';

  async function handleSignup() {
    errorMessage = '';
    successMessage = '';

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      return;
    }

    try {
      // 1) Create Supabase user with role in user_metadata
      const { data: authData, error: authError } = await supabaseUser.auth.signUp({
        email,
        password,
        options: {
          data: { role }
        }
      });

      if (authError) {
        errorMessage = authError.message;
        return;
      }

      if (!authData.user) {
        errorMessage = 'Unexpected error creating user.';
        return;
      }

      // 2) Insert profile in the profiles table
      const { error: profileError } = await supabaseUser
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name,
          orefered_name: full_name,
          role,
          is_admin: false,
          bio: ''
        });

      if (profileError) {
        errorMessage = 'Account created, but profile failed to save.';
        console.error(profileError);
        return;
      }

      // 3) Success
      successMessage = 'Account created! You can now log in.';
      setTimeout(() => goto('/login'), 2000);

    } catch (err) {
      console.error(err);
      errorMessage = 'Something went wrong during signup.';
    }
  }
</script>

<div class="signup-container">
  <h1>Create a Clario Account</h1>
  <p class="subtitle">Sign up to get started.</p>

  <form on:submit|preventDefault={handleSignup} class="signup-form">
    <label>
      Full Name
      <input type="text" bind:value={full_name} required placeholder="Your name" />
    </label>

    <label>
      Email
      <input type="email" bind:value={email} required placeholder="your-email@domain.com" />
    </label>

    <label>
      Password
      <input type="password" bind:value={password} required />
    </label>

    <label>
      Confirm Password
      <input type="password" bind:value={confirmPassword} required />
    </label>

    <label>
      Role
      <select bind:value={role}>
        <option value="client">Client</option>
        <option value="transcriber">Transcriber</option>
      </select>
    </label>

    <button type="submit" class="signup-btn">Sign Up</button>

    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}

    {#if successMessage}
      <p class="success">{successMessage}</p>
    {/if}
  </form>

  <p class="redirect">
    Already have an account?
    <a class="btn" href="/login">Log in</a>
  </p>
</div>
