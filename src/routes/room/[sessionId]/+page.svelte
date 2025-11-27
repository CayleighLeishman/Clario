<!-- src/routes/room/[sessionId]/+page.svelte -->
<script lang="ts">
  import { supabaseUser } from '$lib/supabaseUser';
  export let data;

  // --------------------------
  // TYPES
  // --------------------------
  // Define the structure of each transcript message
  type Message = {
    role: 'client' | 'transcriber' | 'admin'; // user role who sent the message
    text: string; // the actual message content
    created_at: string; // timestamp of when the message was created
  };

  // --------------------------
  // TRANSCRIPT MESSAGES
  // --------------------------
  let entries: Message[] = []; // array to hold all transcript messages
  let message = ''; // current input text the user is typing

  // --------------------------
  // LOAD EXISTING MESSAGES
  // --------------------------
  // Fetch previous messages from Supabase for this session
  supabaseUser
    .from('realtime_chunks')
    .select('*')
    .eq('session_id', data.sessionId)
    .order('created_at', { ascending: true })
    .then(({ data: initial }) => {
      // If there are messages, cast them to Message[] and store in entries
      if (initial) entries = initial as Message[];
    });

  // --------------------------
  // REAL-TIME UPDATES
  // --------------------------
  // Listen for new messages from Supabase Realtime and append them to entries
  supabaseUser
    .channel(`room-${data.sessionId}`)
    .on('postgres_changes', {
      event: 'INSERT', // trigger on new row inserted
      schema: 'public', // target public schema
      table: 'realtime_chunks', // table storing messages
      filter: `session_id=eq.${data.sessionId}` // only for this session
    }, (payload) => {
      // Add the new message to entries, casting it as Message
      entries = [...entries, payload.new as Message];
    })
    .subscribe();

  // --------------------------
  // SEND NEW MESSAGE
  // --------------------------
  // Sends the current message to the server and clears input
  async function sendMessage() {
    if (!message.trim()) return; // ignore if input is empty

    // POST the message to the server endpoint for saving in database
    await fetch(`/room/${data.sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });

    message = ''; // clear input after sending
  }
</script>

<!-- --------------------------
     PAGE HEADER
-------------------------- -->
<h2 id="room-heading">Room: {data.sessionId}</h2>
<p>You are {data.user.name} ({data.user.role})</p>

<!-- --------------------------
     TRANSCRIPT BOX
-------------------------- -->
<!-- Displays all messages and announces updates to screen readers -->
<div class="transcript-box" role="log" aria-live="polite" aria-labelledby="room-heading">
  {#each entries as row (row.created_at)}
    <p><strong>{row.role}:</strong> {row.text}</p>
  {/each}
</div>

<!-- --------------------------
     SEND MESSAGE BOX
-------------------------- -->
<!-- Only transcribers or admins can type messages -->
{#if data.user.role === 'transcriber' || data.user.role === 'admin'}
  <form class="send-box" on:submit|preventDefault={sendMessage}>
    <!-- Hidden label for accessibility -->
    <label for="message-input" class="visually-hidden">Type your message</label>
    <!-- Input for typing messages -->
    <input
      id="message-input"
      bind:value={message}
      placeholder="Type your message here..."
      aria-label="Type your message"
    />
    <!-- Button to send message -->
    <button type="submit">Send</button>
  </form>
{/if}

<style>
  /*to do TO DO decide if this should stay or go in gloibal.css */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  }
</style>
