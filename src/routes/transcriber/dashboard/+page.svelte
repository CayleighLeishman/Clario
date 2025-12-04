<!-- src/transcriber/dashboard/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import "$lib/styles/dashboards.css";

  // ===========================
  // ===== Session Type
  // ===========================
  type TranscriberSession = {
    userId: string;
    role: 'transcriber';
    email: string;
  };

  let session: TranscriberSession | null = null;
  $: session = $page.data.session as TranscriberSession | null;

  // ===========================
  // ===== Dashboard Data Types
  // ===========================
  interface Lecture {
    id: string;
    course_name: string;
    lecture_date: string;
    host?: string; // optional host info
  }

  interface HistoryItem {
    id: number;
    lecture_id: string;
    final_duration_minutes: number;
    raw_full_text: string;
  }

  // ===========================
  // ===== Reactive Variables
  // ===========================
  let scheduleData: Lecture[] = [];
  let historyData: HistoryItem[] = [];
  let joinCode = ''; // for "join another lecture"

  // ===========================
  // ===== Mock Load Data
  // ===========================
  function loadDashboard() {
    // Replace with fetch from Supabase if ready
    scheduleData = [
      { id: 'lecture-1', course_name: 'Biology 101', lecture_date: 'Mon', host: 'Dr. Smith' },
      { id: 'lecture-2', course_name: 'Math 201', lecture_date: 'Tue', host: 'Prof. Jones' }
    ];

    historyData = [
      { id: 1, lecture_id: 'lecture-0', final_duration_minutes: 60, raw_full_text: 'Transcript 1' }
    ];
  }

  loadDashboard();

  // ===========================
  // ===== Join Lecture Functions
  // ===========================
  async function joinLecture(lectureId: string) {
    try {
      const res = await fetch('/room/join', {
        method: 'POST',
        body: JSON.stringify({ lectureId })
      });
      if (!res.ok) throw new Error('Failed to join lecture');
      const data = await res.json();
      window.location.href = `/room/${data.sessionId}`;
    } catch (err) {
      console.error('Error joining lecture:', err);
      alert('Could not join lecture. See console for details.');
    }
  }

  async function joinAnother() {
    if (!joinCode.trim()) return alert('Please enter a lecture code!');
    try {
      // This could be a lookup or POST to join a session by code
      alert(`Attempting to join lecture with code: ${joinCode}`);
      // TODO: replace with actual /room/join logic
    } catch (err) {
      console.error(err);
      alert('Could not join lecture by code.');
    }
  }
</script>

<svelte:head>
  <title>Transcriber Dashboard</title>
</svelte:head>

{#if session}
  <div class="dashboard-container">
    <main class="main-content">

      <!-- ===== Join Another Lecture ===== -->
      <section class="panel join-panel">
        <h3>Join Another Lecture</h3>
        <div class="input-group">
          <label for="join-code" class="sr-only">Lecture Code</label>
          <input id="join-code" type="text" placeholder="Enter lecture code" bind:value={joinCode} />
          <button on:click={joinAnother}>Join</button>
        </div>
      </section>

      <!-- ===== Schedule Panel ===== -->
      <section class="panel schedule-panel">
        <h3>Your Scheduled Lectures</h3>
        <div class="panel-list scrollable">
          {#each scheduleData as lecture (lecture.id)}
            <div class="session-card">
              <div class="session-header">
                <span>{lecture.lecture_date}</span>
                <span>Host: {lecture.host}</span>
              </div>
              <p>Course: {lecture.course_name}</p>
              <button on:click={() => joinLecture(lecture.id)}>Join</button>
            </div>
          {/each}
        </div>
      </section>

      <!-- ===== History Panel ===== -->
      <section class="panel history-panel">
        <h3>Completed Lectures</h3>
        <div class="panel-list scrollable">
          {#each historyData as historyItem (historyItem.id)}
            <div class="session-card">
              <div class="session-header">
                <span>Lecture ID: {historyItem.lecture_id}</span>
                <span>Duration: {historyItem.final_duration_minutes} min</span>
              </div>
              <p>{historyItem.raw_full_text}</p>
            </div>
          {/each}
        </div>
      </section>

    </main>
  </div>

{:else}
  <p>You are not logged in. Redirecting to login...</p>
  <script>
    setTimeout(() => window.location.href = '/login', 1000);
  </script>
{/if}
