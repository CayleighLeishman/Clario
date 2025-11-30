<script lang="ts">
  import '$lib/styles/settings-popup.css';
  import { supabaseUser } from '$lib/utils/supabaseUser';
  import { createEventDispatcher, onMount } from 'svelte';

  // Used to notify the parent <Header> to close the modal
  const dispatch = createEventDispatcher();

  // Local state: form inputs with default values
  let theme: 'light' | 'dark' = 'light';
  let text_color = '#000000';
  let background = '#ffffff';
  let notifications = true;

  // Stores the authenticated user's session
  let session: any = null;

  /* -----------------------------------------------------
     Load the current session and user settings on mount
     ----------------------------------------------------- */
  onMount(async () => {
    const { data: sessionData } = await supabaseUser.auth.getSession();
    session = sessionData.session;

    if (!session) return;

    const userId = session.user.id;

    // Fetch the existing settings from Supabase
    const { data } = await supabaseUser
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // If the user has saved settings, fill the form with them
    if (data) {
      theme = data.theme;
      text_color = data.text_color;
      background = data.background;
      notifications = data.notifications;
    }
  });

  /* -----------------------------------------------------
     Save the updated settings back to Supabase
     ----------------------------------------------------- */
  async function saveSettings() {
    if (!session) return;

    const userId = session.user.id;

    const { error } = await supabaseUser
      .from('user_settings')
      .upsert({
        user_id: userId,
        theme,
        text_color,
        background,
        notifications
      });

    if (error) {
      alert('Error saving settings: ' + error.message);
    } else {
      alert('Settings saved.');
    }
  }

  /* -----------------------------------------------------
     Close the modal
     ----------------------------------------------------- */
  function close() {
    dispatch('close');
  }
</script>

<!--
====================================================
 Modal Overlay (clicking it closes the settings)
====================================================
-->
<button
  type="button"
  class="settings-overlay"
  on:click={close}
  on:keydown={(e) => e.key === 'Escape' && close()}
  aria-label="Close settings"
></button>

<!--
====================================================
 Modal Content Box
====================================================
-->
<div class="settings-modal">
  <h2>User Settings</h2>

  <!-- Theme -->
  <label>
    Theme:
    <select bind:value={theme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>

  <!-- Text Color -->
  <label>
    Text Color:
    <input type="color" bind:value={text_color} />
  </label>

  <!-- Background Color -->
  <label>
    Background Color:
    <input type="color" bind:value={background} />
  </label>

  <!-- Notifications -->
  <label>
    Notifications:
    <input type="checkbox" bind:checked={notifications} />
  </label>

  <!-- Buttons -->
  <div class="settings-buttons">
    <button on:click={saveSettings}>Save</button>
    <button on:click={close}>Close</button>
  </div>
</div>
