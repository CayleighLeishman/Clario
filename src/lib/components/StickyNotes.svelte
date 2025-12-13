<!-- src/lib/components/StickyNotes.svelte -->

<script lang="ts">
  /* ============================================================
     IMPORTS
     ============================================================ */

  import { onDestroy } from 'svelte';
  import { supabaseUser } from '$lib/utils/supabaseUser';

  /* ============================================================
     PROPS
     ============================================================ */

  // Lecture the notes belong to
  export let lectureId: string;

  // Logged-in client user
  export let userId: string;

  /* ============================================================
     TYPES + STATE
     ============================================================ */

  type Note = {
    id: string;
    note_content: string;
  };

  // All notes for this lecture/user
  let notes: Note[] = [];

  // Draft for a new note
  let draft = '';

  // Autosave status text
  let status = 'Saved';

  // Debounce timer for autosave
  let autosaveTimeout: number | null = null;

  /* ============================================================
     LOAD NOTES
     ============================================================ */

  async function loadNotes() {
    const { data } = await supabaseUser
      .from('sticky_notes')
      .select('id, note_content')
      .eq('lecture_id', lectureId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    notes = data ?? [];
  }

  /* ============================================================
     CREATE NOTE
     ============================================================ */

  async function addNote() {
    if (!draft.trim()) return;

    status = 'Saving…';

    await supabaseUser.from('sticky_notes').insert({
      lecture_id: lectureId,
      user_id: userId,
      note_content: draft
    });

    draft = '';
    await loadNotes();
    status = 'Saved';
  }

  /* ============================================================
     AUTOSAVE (DEBOUNCED)
     ============================================================ */

  function autosaveNote(id: string, value: string) {
    status = 'Saving…';

    // Clear any existing debounce
    if (autosaveTimeout) clearTimeout(autosaveTimeout);

    autosaveTimeout = window.setTimeout(async () => {
      await supabaseUser
        .from('sticky_notes')
        .update({ note_content: value })
        .eq('id', id);

      status = 'Saved';
    }, 600);
  }

  /* ============================================================
     DELETE NOTE
     ============================================================ */

  async function deleteNote(id: string) {
    await supabaseUser.from('sticky_notes').delete().eq('id', id);
    await loadNotes();
  }

  /* ============================================================
     REACTIVE LOAD
     ============================================================ */

  // Load notes once lecture + user are available
  $: if (lectureId && userId) {
    loadNotes();
  }

  /* ============================================================
     CLEANUP
     ============================================================ */

  onDestroy(() => {
    if (autosaveTimeout) clearTimeout(autosaveTimeout);
  });
</script>

<section class="sticky-notes">
  <h4>Your Private Notes</h4>

  <!-- New note input -->
  <textarea
    bind:value={draft}
    placeholder="Write a note…"
  ></textarea>

  <button on:click={addNote}>Add</button>
  <small aria-live="polite">{status}</small>

  <!-- Scrollable notes list -->
  <div class="sticky-scroll">
    <ul>
      {#each notes as note (note.id)}
        <li class="note">
          <textarea
            on:input={(e) =>
              autosaveNote(
                note.id,
                (e.currentTarget as HTMLTextAreaElement).value
              )
            }
          >
            {note.note_content}
          </textarea>

          <button on:click={() => deleteNote(note.id)}>🗑</button>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .sticky-notes {
    margin-top: 1rem;
    padding: 1rem;
    background: #fffbe6;
    border-radius: 0.75rem;
  }

  .sticky-scroll {
    max-height: 250px;
    overflow-y: auto;
  }

  textarea {
    width: 100%;
    min-height: 70px;
    margin-bottom: 0.5rem;
  }

  .note {
    margin-bottom: 0.75rem;
  }
</style>
