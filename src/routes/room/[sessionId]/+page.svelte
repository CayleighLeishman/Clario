<!-- src/routes/room/[sessionId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';

  // Pull sessionId from URL
  $: sessionId = $page.params.sessionId;
</script>

<h1>Live Transcription Room</h1>
<p>Session ID: {sessionId}</p>

<p>This is the temporary real transcription page.  
I’ll add real-time functionality once i get dashboards properly working.</p>

<textarea
  readonly
  placeholder="Transcript will appear here..."
  style="width:100%; height:300px;"
></textarea>
