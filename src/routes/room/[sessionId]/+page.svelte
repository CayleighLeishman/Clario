<script lang="ts">


  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import '$lib/styles/room.css';

  // ============================

  // SESSION TYPE FROM LAYOUT

  // (matches what you already pass)

  // ============================

  type AppSession = {

    userId: string;

    role: 'client' | 'transcriber' | 'admin';

    email: string;

  };



  // Session from layout

  let session: AppSession | null = null;

  $: session = $page.data.session as AppSession | null;



  // Get sessionId from URL

  $: sessionId = $page.params.sessionId;



  // ============================

  // TRANSCRIPTION STATE

  // ============================

  let currentInput = '';

  let transcript: string[] = [];

  let transcriptDisplay: HTMLDivElement | undefined; // For auto-scrolling



  // ============================

  // CHAT STATE

  // ============================

  let chatInput = '';

  let chatLog: { sender: string; message: string }[] = [];

  let chatDisplay: HTMLDivElement | undefined; // For auto-scrolling



  // ============================

  // ADD LINE TO TRANSCRIPT

  // ============================

  function submitTranscriptLine() {

    if (!currentInput.trim()) return;



    transcript = [...transcript, currentInput];

    currentInput = '';



    // Scroll transcript to bottom after updating

    requestAnimationFrame(() => {

      if (transcriptDisplay) {

        transcriptDisplay.scrollTop = transcriptDisplay.scrollHeight;

      }

    });

  }



  // ============================

  // SEND CHAT MESSAGE

  // ============================

  function sendMessage() {

    if (!chatInput.trim() || !session) return;



    chatLog = [

      ...chatLog,

      { sender: session.role, message: chatInput }

    ];



    chatInput = '';



    // Scroll chat to bottom after updating

    requestAnimationFrame(() => {

      if (chatDisplay) {

        chatDisplay.scrollTop = chatDisplay.scrollHeight;

      }

    });

  }



  // ============================

  // PLACEHOLDER FOR WEBRTC SETUP

  // ============================

  onMount(() => {

    console.log('WebRTC would initialize here');

  });

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

                // Optionally allow Shift+Enter for newline, or Enter to submit

                if (e.key === 'Enter' && !e.shiftKey) {

                  e.preventDefault();

                  submitTranscriptLine();

                }

              }}

            ></textarea>



            <button on:click={submitTranscriptLine}>

              Add Line

            </button>

          </div>

        {/if}



      </section>



            <section class="webrtc-panel">

        <h3>Live Audio/WebRTC</h3>



        <div class="video-placeholder">

          🎧 Audio/Video Stream Will Appear Here

        </div>

      </section>



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

