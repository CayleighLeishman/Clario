<!-- src/routes/room/[sessionId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import '$lib/styles/room.css';
  import { supabaseUser } from '$lib/utils/supabaseUser';

  // Session data from root layout
  type AppSession = {
    userId: string;
    role: 'client' | 'transcriber' | 'admin';
    email: string;
  };

  let session: AppSession | null = null;
  $: session = $page.data.session as AppSession | null;

  // URL param
  $: sessionId = $page.params.sessionId as string;

  // Transcript + chat state
  let currentInput = '';
  let transcript: string[] = [];
  let transcriptDisplay: HTMLDivElement | undefined;

  let chatInput = '';
  let chatLog: { sender: string; message: string }[] = [];
  let chatDisplay: HTMLDivElement | undefined;

  // Keep a reference to the realtime channel
  let transcriptChannel: ReturnType<typeof supabaseUser.channel> | null = null;

  // Load existing transcript + subscribe to new chunks
  onMount(async () => {
    if (!sessionId) return;

    // 1️. Load existing transcript rows
    const { data, error } = await supabaseUser
      .from('realtime_chunks')
      .select('id, text_chunk, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading transcript:', error);
    } else if (data) {
      transcript = data.map((row) => row.text_chunk as string);
      scrollTranscriptToBottom();
    }

    // 2️. Subscribe to realtime INSERTS for this session
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
          transcript = [...transcript, newText];
          scrollTranscriptToBottom();
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status);
      });
  });

  onDestroy(() => {
    if (transcriptChannel) {
      supabaseUser.removeChannel(transcriptChannel);
      transcriptChannel = null;
    }
  });

  function scrollTranscriptToBottom() {
    requestAnimationFrame(() => {
      if (transcriptDisplay) {
        transcriptDisplay.scrollTop = transcriptDisplay.scrollHeight;
      }
    });
  }

  // Submit new transcript line (admin/transcriber only)
  async function submitTranscriptLine() {
    if (!currentInput.trim() || !session) return;

    const text = currentInput;
    currentInput = '';

    const res = await fetch(`/room/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!res.ok) {
      console.error('Failed to post transcript line:', await res.text());
      // Optionally add it back if you want “optimistic” UI
    }
  }

  // Chat: still local for tonight (not in Supabase yet)
  function sendMessage() {
    if (!chatInput.trim() || !session) return;

    chatLog = [...chatLog, { sender: session.role, message: chatInput }];
    chatInput = '';

    requestAnimationFrame(() => {
      if (chatDisplay) {
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
      }
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
            <textarea
              bind:value={currentInput}
              placeholder="Type the live transcription here..."
              on:keydown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitTranscriptLine();
                }
              }}
            ></textarea>

            <button on:click={submitTranscriptLine}>Add Line</button>
          </div>
        {/if}
      </section>

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
