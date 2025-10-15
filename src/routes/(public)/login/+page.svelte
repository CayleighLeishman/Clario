<script lang="ts">
  import { supabaseUser } from '$lib/supabaseUser';
  import "$lib/styles/login.css";

  let email = '';
  let password = '';

  async function loginClient() {
    try {
      const { data, error } = await supabaseUser.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error; // throw so catch block handles it

      console.log('Client login successful:', data);
      window.location.href = "/client/dashboard";
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  }

  async function loginTranscriber() {
    try {
      const { data, error } = await supabaseUser.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log('Transcriber login successful:', data);
      window.location.href = "/transcriber/dashboard";
    } catch (err: any) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    }
  }
</script>
