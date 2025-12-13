<script lang="ts">
  /* ============================================================
     IMPORTS
     ============================================================ */
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { supabaseUser } from '$lib/utils/supabaseUser';
  import StickyNotes from '$lib/components/StickyNotes.svelte';
  import '$lib/styles/room.css';

  /* ============================================================
     TYPES
     ============================================================ */
  type AppSession = {
    userId: string;
    role: 'client' | 'transcriber' | 'admin';
    email: string;
  };

  /* ============================================================
     SESSION + ROUTE DATA
     ============================================================ */
  let session: AppSession | null = null;
  $: session = $page.data.session as AppSession | null;

  $: lectureId = $page.data.lectureId as string;
  $: sessionId = $page.params.sessionId as string;

  /* ============================================================
     TRANSCRIPT STATE
     ============================================================ */
  // Finalized lines shown to everyone (Single Source of Truth from DB)
  let transcript: string[] = [];

  // For scroll
  let transcriptDisplay: HTMLDivElement | null = null;

  // Supabase realtime channel
  let transcriptChannel:
    | ReturnType<typeof supabaseUser.channel>
    | null = null;

  // Transcriber/admin input state (local to the sender)
  let draftLine = '';

  /* ============================================================
     LOAD + REALTIME
     ============================================================ */
  onMount(async () => {
    if (!sessionId) return;

    // Load existing transcript (history)
    const { data, error } = await supabaseUser
      .from('realtime_chunks')
      .select('text_chunk')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) console.error('Load transcript error:', error);

    if (data?.length) {
      transcript = data
        .map((row) => (row.text_chunk ?? '').replace('|EOL|', '').trim())
        .filter(Boolean);
    }

    // Subscribe to realtime inserts
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
          const incoming = (payload?.new?.text_chunk ?? '')
            .replace('|EOL|', '')
            .trim();

          if (!incoming) return;

          // === CRITICAL LOGIC FOR DEDUPLICATION ===
          // We need to check if we, the sender, already applied this update locally.
          const last = transcript[transcript.length - 1];
          
          // If the last line in our local transcript is already the line that just came via Realtime, ignore the push.
          // This ensures the local update provides instant feedback, and the Realtime push for the *same* line is silently dropped.
          if (last === incoming) {
            console.log('Realtime push ignored (Sender already updated UI locally).');
            return;
          }
          
          // This logic now only runs for **RECEIVING** clients (non-senders)
          transcript = [...transcript, incoming];

          requestAnimationFrame(() => {
            transcriptDisplay?.scrollTo({
              top: transcriptDisplay.scrollHeight
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
    if (transcriptChannel) supabaseUser.removeChannel(transcriptChannel);
  });

  /* ============================================================
     SAVE FINAL LINE (DB)
     ============================================================ */
  async function submitFinalLine(text: string) {
    console.log('Attempting to save final line:', text);
    const res = await fetch(`/room/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text + ' |EOL|' }) // GUARANTEED |EOL| marker
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => 'Unknown server error.');
      console.error('❌ POST failed:', res.status, msg);
    } else {
      console.log('✅ POST succeeded. Realtime update should follow.');
    }
  }

  // Handles the submission when Enter is pressed in the Textarea
  function handleDraftKeydown(e: KeyboardEvent) {
    if (!session || !['transcriber', 'admin'].includes(session.role)) return;

    // Check for ENTER without SHIFT
  	if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent standard newline in the textarea

      const line = draftLine.trim();
      if (!line) return;

      // 1. Save to DB (asynchronously)
      submitFinalLine(line);
      
      // 2. CRITICAL UI FIX: Instant Local Update
      // Apply the update locally BEFORE the network round trip finishes.
      transcript = [...transcript, line];
      
      // 3. Clear the draft line and scroll
      draftLine = '';
      requestAnimationFrame(() => {
        transcriptDisplay?.scrollTo({
          top: transcriptDisplay.scrollHeight
        });
      });
    }
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
            <section class="transcription-panel">
        <h3>Live Transcript</h3>

                <div class="transcript-display" bind:this={transcriptDisplay}>
          {#if transcript.length === 0}
            <div class="transcript-line">No transcript yet…</div>
          {:else}
            {#each transcript as line}
              <div class="transcript-line">{line}</div>
            {/each}
          {/if}
        </div>

                {#if session.role !== 'client'}
          <textarea
            class="transcript-input"
            bind:value={draftLine}
            placeholder="Type a line… (Enter to send, Shift+Enter for newline)"
            on:keydown={handleDraftKeydown}
          ></textarea>
        {/if}
      </section>

            {#if session.role === 'client'}
        <section class="sticky-notes-panel">
          <h3>Private Notes</h3>
          <StickyNotes lectureId={lectureId} userId={session.userId} />
        </section>
      {/if}

            <section class="webrtc-panel">
        <h3>Audio / Video</h3>
        <div class="video-placeholder">🎧 Stream appears here</div>
      </section>

      <section class="chat-panel">
        <h3>Chat (coming next)</h3>
      </section>
    </div>
  </div>
{:else}
  <p>Not logged in.</p>
{/if}

