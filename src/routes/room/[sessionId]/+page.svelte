<!-- src.routes/room/[sessionId]/+page.svelte -->

<script lang="ts">

import { page } from '$app/stores';
import { onDestroy, onMount } from 'svelte';
import { supabaseUser } from '$lib/utils/supabaseUser';
import { throttle } from '$lib/utils/throttle';
import '$lib/styles/room.css';
import StickyNotes from '$lib/components/StickyNotes.svelte';


/* =========================================================================
   TYPE DEFINITIONS
   =========================================================================
   These describe the shape of data passed around the app.
   Keeping them here makes the file self-documenting.
*/

// Session info passed from +page.server.ts
type AppSession = {
  userId: string;
  role: 'client' | 'transcriber' | 'admin';
  email: string;
};

/* =========================================================================
   REACTIVE STATE (Svelte Variables)
   =========================================================================
   These variables drive the UI and update reactively.
*/

// Session data injected by SvelteKit load()
let session: AppSession | null = null;
$: session = $page.data.session as AppSession | null;

// IDs
// lectureId → permanent (used for notes & history)
// sessionId → temporary (used for realtime typing + chat)
$: lectureId = $page.data.lectureId as string;
$: sessionId = $page.params.sessionId as string;

/* =========================================================================
   TRANSCRIPT STATE
   =========================================================================
   Handles live transcription display and realtime updates.
*/

let currentInput = '';                 // What the transcriber is currently typing
let transcript: string[] = [];         // Final lines + live updating line
let transcriptDisplay: HTMLDivElement | undefined;

// Supabase realtime channel (cleaned up on destroy)
let transcriptChannel: ReturnType<typeof supabaseUser.channel> | null = null;

/* =========================================================================
   CHAT STATE (Local placeholder)
   =========================================================================
   Chat is not realtime yet — stored locally for now.
*/

let chatInput = '';
let chatLog: { sender: string; message: string }[] = [];
let chatDisplay: HTMLDivElement | undefined;

/* =========================================================================
   LIFECYCLE: onMount
   =========================================================================
   - Load existing transcript history
   - Subscribe to realtime transcript updates
*/

onMount(async () => {
  if (!lectureId) return;

  /* --------------------------
     1. LOAD TRANSCRIPT HISTORY
     --------------------------
     Loads previously typed chunks for this session.
  */
  const { data, error } = await supabaseUser
    .from('realtime_chunks')
    .select('id, text_chunk, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (!error && data) {
    transcript = data.map(row => row.text_chunk as string);
    scrollTranscriptToTop();
  }

  /* --------------------------
     2. REALTIME SUBSCRIPTION
     --------------------------
     Listens for INSERTS to realtime_chunks and updates UI.
  */
  transcriptChannel = supabaseUser
    .channel(`room:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'realtime_chunks',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        const newText = (payload.new as any).text_chunk as string;

        // |EOL| marks finalized lines (ENTER key)
        const isFinalLine = newText.endsWith('|EOL|');
        const chunkText = newText.replace('|EOL|', '').trim();

        if (isFinalLine) {
          // Finalize previous line and start new placeholder
          transcript[transcript.length - 1] = chunkText;
          transcript = [...transcript, ''];
        } else if (
          transcript.length === 0 ||
          !transcript[transcript.length - 1].trim()
        ) {
          // First live chunk
          transcript = [...transcript, chunkText];
        } else {
          // Replace last line (live typing effect)
          transcript[transcript.length - 1] = chunkText;
        }

        transcript = transcript; // force reactivity
        scrollTranscriptToBottom();
      }
    )
    .subscribe();
});


/* =========================================================================
   CLEANUP
   =========================================================================
   Always remove realtime channels to avoid memory leaks.
*/

onDestroy(() => {
  if (transcriptChannel) {
    supabaseUser.removeChannel(transcriptChannel);
    transcriptChannel = null;
  }
});

/* =========================================================================
   SCROLL HELPERS
   =========================================================================
*/

function scrollTranscriptToBottom() {
  requestAnimationFrame(() => {
    transcriptDisplay &&
      (transcriptDisplay.scrollTop = transcriptDisplay.scrollHeight);
  });
}

function scrollTranscriptToTop() {
  requestAnimationFrame(() => {
    transcriptDisplay && (transcriptDisplay.scrollTop = 0);
  });
}

/* =========================================================================
   TRANSCRIPTION LOGIC (Transcriber/Admin)
   =========================================================================
*/

// Sends partial text (does NOT clear input)
async function submitTranscriptChunk() {
  if (!currentInput.trim() || !session) return;

  await fetch(`/room/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: currentInput })
  });
}

// Throttled live updates (smooth + low DB load)
const throttledChunkSubmission = throttle(submitTranscriptChunk, 300);

// Sends final line + clears input
async function submitFinalTranscriptLine() {
  if (!currentInput.trim() || !session) return;

  await fetch(`/room/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: currentInput + ' |EOL|' })
  });

  currentInput = '';
}

/* =========================================================================
   CHAT LOGIC (LOCAL ONLY)
   =========================================================================
*/

function sendMessage() {
  if (!chatInput.trim() || !session) return;

  chatLog = [...chatLog, { sender: session.role, message: chatInput }];
  chatInput = '';

  requestAnimationFrame(() => {
    chatDisplay &&
      (chatDisplay.scrollTop = chatDisplay.scrollHeight);
  });
}

</script>


<svelte:head>
  <title>Live Transcription Room</title>
</svelte:head>


{#if session}
  <div class="room-container">
    <header class="room-header">
      <h2>Live Session</h2>
      <span>Session ID: {sessionId}</span>
      <span>Role: {session.role}</span>
    </header>

    <div class="room-grid">
      <!-- Transcript -->
      <section class="transcription-panel">
        <h3>Live Transcript</h3>

        <div class="transcript-display" bind:this={transcriptDisplay}>
          {#each transcript as line}
            <p>{line}</p>
          {/each}
        </div>

        {#if session.role !== 'client'}
          <div class="transcript-input-area">
            <label for="transcript-input" class="sr-only">
  Live transcription input
</label>
            <textarea
  bind:value={currentInput}
  placeholder="Type the live transcription here..."
  on:input={throttledChunkSubmission}
  on:keydown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitFinalTranscriptLine();
    }
  }}
></textarea>

<button on:click={submitFinalTranscriptLine}>
  Add Line
</button>


          </div>
        {/if}
      </section>

      {#if session && session.role === 'client'}
<StickyNotes
lectureId={lectureId}
userId={session.userId}
/>
{/if}

      <!-- WebRTC placeholder -->
      <section class="webrtc-panel">
        <h3>Live Audio/WebRTC</h3>
        <div class="video-placeholder">
          🎧 Audio/Video Stream Will Appear Here
        </div>
      </section>

      <!-- Chat (local only for now) -->
      <section class="chat-panel">
        <h3>Live Chat</h3>

        <div class="chat-log" bind:this={chatDisplay}>
          {#each chatLog as msg}
            <div class="chat-message {msg.sender}">
              <strong>{msg.sender}:</strong> {msg.message}
            </div>
          {/each}
        </div>

        <div class="chat-input-area">
          <input
            type="text"
            placeholder="Type a message..."
            bind:value={chatInput}
            on:keydown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button on:click={sendMessage}>Send</button>
        </div>
      </section>
    </div>
  </div>
{:else}
  <p>Not logged in. Redirecting...</p>
{/if}
