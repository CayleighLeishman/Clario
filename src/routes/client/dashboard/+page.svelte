<script lang="ts">

  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { supabaseUser } from '$lib/utils/supabaseUser';
  import "$lib/styles/client-dashboard.css";

  // ===========================
  // ===== Custom Session Type
  // ===========================
  // Represents the session data sent from the parent layout
  type ClientSession = {
    userId: string;
    role: 'admin' | 'transcriber' | 'client';
    email: string;
  };

  // ===========================
  // ===== Dashboard Data Types
  // ===========================
  // Represents a scheduled lecture
  interface ScheduleItem {
    id: number;
    lecture_date: string;
    join_code: string;
    course_name: string;
  }

  // Represents a completed lecture/transcription
  interface HistoryItem {
    id: number;
    lecture_id: number;
    final_duration_minutes: number;
    raw_full_text: string;
  }

  // ===========================
  // ===== Reactive Variables
  // ===========================
  let scheduleData: ScheduleItem[] = []; // Holds active sessions
  let historyData: HistoryItem[] = [];   // Holds completed sessions
  let inputCode = '';                     // Input field for joining a session

  // ===========================
  // ===== Session from Layout
  // ===========================
  let session: ClientSession | null = null;
  $: session = $page.data.session as ClientSession | null;

  // ===========================
  // ===== Load Dashboard Data
  // ===========================
  async function loadDashboard() {
    try {
      // --------------------------
      // Fetch active schedule from Supabase
      // --------------------------
      const { data: schedule } = await supabaseUser
        .from<'course_lectures', ScheduleItem>('course_lectures')
        .select('*');

      // --------------------------
      // Fetch completed history from Supabase
      // --------------------------
      const { data: history } = await supabaseUser
        .from<'final_transcriptions', HistoryItem>('final_transcriptions')
        .select('*');

      // --------------------------
      // Use fetched data or fallback test data
      // --------------------------
      scheduleData = schedule && schedule.length
        ? schedule
        : [{ id: 0, lecture_date: 'Mon', join_code: 'TEST123', course_name: 'Test Course' }];

      historyData = history && history.length
        ? history
        : [{ id: 0, lecture_id: 999, final_duration_minutes: 60, raw_full_text: 'Test transcript' }];

    } catch (err) {
      console.error('Dashboard load error:', err);

      // Fallback to test data if Supabase fetch fails
      scheduleData = [{ id: 0, lecture_date: 'Mon', join_code: 'TEST123', course_name: 'Test Course' }];
      historyData = [{ id: 0, lecture_id: 999, final_duration_minutes: 60, raw_full_text: 'Test transcript' }];
    }
  }

  // Load dashboard immediately on component mount
  loadDashboard();

  // ===========================
  // ===== Join Session Function
  // ===========================

async function joinSession() {
  if (!inputCode.trim()) return alert("Please enter a session code!");

  const res = await fetch("/room/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ joinCode: inputCode })
  });

  const data = await res.json();
  goto(`/room/${data.sessionId}`);
}


</script>

<svelte:head>
  <title>Client Dashboard</title>
</svelte:head>

{#if session}
  <!-- ===========================
       ===== Dashboard UI
       =========================== -->
  <div class="dashboard-container">
    <main class="main-content">

      <!-- ===== Join Session Panel ===== -->
      <section class="panel join-panel">
        <h3>Join Session</h3>
        <div class="input-group">
          <label for="session-code" class="sr-only">Session Code</label>
          <input id="session-code" type="text" placeholder="Input code" bind:value={inputCode} />
          <button on:click={joinSession}>Join</button>
        </div>
      </section>

      <!-- ===== Schedule Panel ===== -->
      <section class="panel schedule-panel">
        <h3>Schedule</h3>
        <div class="panel-list scrollable">
          {#each scheduleData as sessionItem (sessionItem.id)}
            <div class="session-card">
              <div class="session-header">
                <span>{sessionItem.lecture_date}</span>
                <span>Code: {sessionItem.join_code}</span>
              </div>
              <p>Course: {sessionItem.course_name}</p>
            </div>
          {/each}
        </div>
      </section>

      <!-- ===== History Panel ===== -->
      <section class="panel history-panel">
        <h3>History</h3>
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
  <!-- ===== User not logged in ===== -->
  <p>You are not logged in. Redirecting to login...</p>
  <script>
    setTimeout(() => goto('/login'), 1000);
  </script>
{/if}
