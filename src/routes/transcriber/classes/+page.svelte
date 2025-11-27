<script lang="ts">
  import { goto } from '$app/navigation';

  // Example lectures for testing
  let lectures = [
    { id: 'lecture-1', course_name: 'Math 101' },
    { id: 'lecture-2', course_name: 'History 201' }
  ];

  // Click "Join" to create a session and go to transcript room
  async function joinSession(lectureId: string) {
    try {
      const res = await fetch('/room/join', {
        method: 'POST',
        body: JSON.stringify({ lectureId })
      });

      if (!res.ok) {
        const errorText = await res.text();
        return alert('Failed to join session: ' + errorText);
      }

      const { sessionId } = await res.json();

      // Redirect to live transcript page
      goto(`/room/${sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Error joining session');
    }
  }
</script>

<h1>Your Classes</h1>

{#each lectures as lecture}
  <div class="lecture-item">
    <span>{lecture.course_name}</span>
    <button on:click={() => joinSession(lecture.id)}>Join</button>
  </div>
{/each}
