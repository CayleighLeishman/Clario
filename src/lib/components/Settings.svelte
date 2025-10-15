<!-- This is what gets the settings button working -->
<script lang="ts">
  import '$lib/styles/settings-popup.css';
  import { supabaseUser } from '$lib/supabaseUser';
  import { createEventDispatcher, onMount } from 'svelte';
 
  // Allows the header to know when to close this modal
  const dispatch = createEventDispatcher();

//   ******************************************
// 1. Setting variables with default values 
//   ******************************************
  let theme: 'light' | 'dark' = 'light';// Default theme
  let text_color = '#000000'; // Default text color (black)
  let background = '#ffffff';// Default background color (white)
  let notifications = true; // Default notifications on

  //*************************************/
  //2. Get the current logged-in session 
  //*************************************/
    // Store the current Supabase user session (who is logged in)
    let session: any = null;

  //*****************************************************************/
  // 3. Load user settings from database when the component opens
  //*****************************************************************/
  
   // Get the current session from Supabase
  onMount(async () => {
    const sessionRes = await supabaseUser.auth.getSession();
    session = sessionRes.data.session;

    if (!session) return;// Stop if no user is logged in
    const userId = (await session).user.id;// Get the user's ID

    // Fetch the settings from user_settings table
    const { data, error } = await supabaseUser
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      // If settings exist, fill the form with current values
      theme = data.theme;
      text_color = data.text_color;
      background = data.background;
      notifications = data.notifications;
    }
  });
  
  //*****************************************************************/
  //4. Save settings back to Supabase
 //*****************************************************************/

  async function saveSettings() {
    if (!session) return; // Stop if no user logged in
    const userId = (await session).user.id; // Get the user's ID

    // Insert new row if none exists, or update existing row
    const { error } = await supabaseUser
      .from('user_settings')
      .upsert({
        user_id: userId,
        theme,
        text_color,
        background,
        notifications
      });

    if (!error) alert('Settings saved!');// Show success message
    else alert('Error saving settings: ' + error.message);
  }
  
 //**************************/
  //5. Close modal function
//**************************/
  function close() {
    dispatch('close'); // Tell parent component to hide this modal
  }
</script>

<!--
******************************************
6. Modal overlay (click outside to close)
****************************************** 
--> 

<!-- 
*type: button                                               : Allegedly this tell sthe browser "Hey, This button does not submit anything - it just does what I tell it in typescript"
*on:click={close}                                           : This Means "Close modal when overlay is clicked"
*  on:keydown={(e) => e.key === 'Escape' && close()}        : This means "Close modal when user presses Escape key" (for keyboard navigation)
*  aria-label="Close settings"                              : This is a Accessibilit feature that describes button action for screen readers
-->
<button type="button"class="settings-overlay"
  on:click={close}
  on:keydown={(e) => e.key === 'Escape' && close()}
  aria-label="Close settings"
></button>

<!-- *************************
7. Modal content box 
*******************************-->
<div class="settings-modal">
  <h2>User Settings</h2>

  <!-- Theme selection -->
  <label>
    Theme:
    <select bind:value={theme}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>

  <!-- Pick Text color  -->
  <label>
    Text Color:
    <input type="color" bind:value={text_color} />
  </label>

  <!-- Pick Background color -->
  <label>
    Background Color:
    <input type="color" bind:value={background} />
  </label>

  <!-- Notifications toggle -->
  <label>
    Notifications:
    <input type="checkbox" bind:checked={notifications} />
  </label>

  <!-- Buttons to save or close -->
  <div class="settings-buttons">
    <button on:click={saveSettings}>Save</button>
    <button on:click={close}>Close</button>
  </div>
</div>
