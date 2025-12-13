<!-- src/routes/room/[sessionId]/+page.svelte -->

<script lang="ts">
  /* ============================================================
     IMPORTS
     ============================================================ */

  // Gives us access to page data (session, params, etc.)
  import { page } from '$app/stores';

  // Lifecycle hooks
  import { onMount, onDestroy } from 'svelte';

  // Supabase client scoped to the logged-in user
  import { supabaseUser } from '$lib/utils/supabaseUser';

  // Utility to prevent sending a request on every keystroke
  import { throttle } from '$lib/utils/throttle';

  // Client-only private notes component
  import StickyNotes from '$lib/components/StickyNotes.svelte';

  // Page-specific styles
  import '$lib/styles/room.css';

  /* ============================================================
     TYPES
     ============================================================ */

  // Session object provided by +page.server.ts
  type AppSession = {
    userId: string;
    role: 'client' | 'transcriber' | 'admin';
    email: string;
  };

  /* ============================================================
     SESSION + ROUTE DATA
     ============================================================ */

  // Logged-in user session (null if not authenticated)
  let session: AppSession | null = null;

  // Reactive assignment so it updates automatically
  $: session = $page.data.session as AppSession | null;

  // Permanent lecture ID (used for notes + history)
  $: lectureId = $page.data.lectureId as string;

  // Temporary room/session ID (used for realtime transcription)
  $: sessionId = $page.params.sessionId as string;

  /* ============================================================
     TRANSCRIPT STATE
     ============================================================ */

  // What the transcriber is currently typing
  let currentInput = '';

  // Full transcript shown to all users
  let transcript: string[] = [];

  // Reference to transcript scroll container
  let transcriptDisplay: HTMLDivElement | null = null;

  // Supabase realtime channel
  let transcriptChannel:
    | ReturnType<typeof supabaseUser.channel>
    | null = null;

  /* ============================================================
     LIFECYCLE: onMount
     ============================================================ */

  onMount(async () => {
    if (!sessionId) return;

    /* ----------------------------
       Load transcript history
       ---------------------------- */
    const { data } = await supabaseUser
      .from('realtime_chunks')
      .select('text_chunk')
      .eq('session_id', sessionId)
      .order('created_at');

    if (data) {
      transcript = data.map((row) => row.text_chunk);
    }

    /* ----------------------------
       Subscribe to realtime inserts
       ---------------------------- */
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
        (payload: any) => {
          const newText = payload.new.text_chunk;

          // |EOL| marks a finalized transcript line
          const isFinal = newText.endsWith('|EOL|');
          const cleanText = newText.replace('|EOL|', '').trim();

          if (isFinal) {
            // Replace last live line, then add a new empty line
            transcript[transcript.length - 1] = cleanText;
            transcript = [...transcript, ''];
          } else if (!transcript.at(-1)?.trim()) {
            // First partial line
            transcript = [...transcript, cleanText];
          } else {
            // Update the current live line
            transcript[transcript.length - 1] = cleanText;
          }

          // Auto-scroll transcript as new text arrives
          requestAnimationFrame(() => {
            transcriptDisplay?.scrollTo({
              top: transcriptDisplay.scrollHeight,
              behavior: 'smooth'
            });
          });
        }
      )
      .subscribe();
  });

  /* ============================================================
     CLEANUP
     ============================================================ */

  onDestroy(() => {
    // Always remove realtime subscriptions to avoid leaks
    if (transcriptChannel) {
      supabaseUser.removeChannel(transcriptChannel);
    }
  });

  /* ============================================================
     TRANSCRIPTION ACTIONS
     ============================================================ */

  // Send partial text while typing (throttled)
  const throttledSubmit = throttle(async () => {
    if (!currentInput.trim()) return;

    await fetch(`/room/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: currentInput })
    });
  }, 300);

  // Finalize a transcript line (Enter key or button)
  async function submitFinalLine() {
    if (!currentInput.trim()) return;

    await fetch(`/room/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: currentInput + ' |EOL|' })
    });

    // Clear input after finalizing line
    currentInput = '';
  }
</script>

<svelte:head>
  <title>Live Transcription</title>
</svelte:head>

{#if session}
  <div class="room-container">
    <header class="room-header">
      <h2>Live Session</h2>
      <span>{session.role}</span>
    </header>

    <div class="room-grid">
      <!-- ================= TRANSCRIPT PANEL ================= -->
      <section class="transcription-panel">
        <h3>Live Transcript</h3>

        <!-- Scrollable transcript text -->
        <div class="transcript-display" bind:this={transcriptDisplay}>
          {#each transcript as line}
            <p>{line}</p>
          {/each}
        </div>

        <!-- Client-only private notes (always under transcript) -->
        {#if session.role === 'client'}
          <StickyNotes {lectureId} userId={session.userId} />
        {/if}

        <!-- Transcriber/Admin input -->
        {#if session.role !== 'client'}
          <div class="transcript-input-area">
            <textarea
              bind:value={currentInput}
              placeholder="Type transcript…"
              on:input={throttledSubmit}
              on:keydown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitFinalLine();
                }
              }}
            ></textarea>

            <button on:click={submitFinalLine}>Add Line</button>
          </div>
        {/if}
      </section>

      <!-- ================= WEBRTC PANEL ================= -->
      <section class="webrtc-panel">
        <h3>Audio / Video</h3>
        <div class="video-placeholder">🎧 Stream appears here</div>
      </section>

      <!-- ================= CHAT PANEL ================= -->
      <section class="chat-panel">
        <h3>Chat (coming next)</h3>
      </section>
    </div>
  </div>
{:else}
  <p>Not logged in.</p>
{/if}
