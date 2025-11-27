<!-- src/transcriber/dashboard/+page.svelte -->
<script lang="ts">
	import { page } from "$app/state";
	import { svelte } from "@sveltejs/vite-plugin-svelte";

  async function joinLecture(lectureId: string) {
    const res = await fetch('/room/join', {
      method: 'POST',
      body: JSON.stringify({ lectureId })
    });
    const data = await res.json();
    // Redirect to transcription room
    window.location.href = `/room/${data.sessionId}`;
  }
</script>

<!-- Example class list -->
<ul>
  <li>
    Biology 101 <button on:click={() => joinLecture('lecture-uuid-here')}>Join</button>
  </li>
</ul>
