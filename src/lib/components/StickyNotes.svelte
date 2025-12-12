<!-- src/lib/components/StickyNotes.svelte -->

<script lang="ts">
  /* ============================================================
     StickyNotes.svelte
     ------------------------------------------------------------
     Client-only sticky notes for Clario transcript rooms.

     - Private per client (RLS enforced)
     - Multiple notes per lecture
     - Autosave with debounce
     - Delete support
     - Accessible (labels, aria-live)
     ============================================================ */

  import { onDestroy } from 'svelte';
  import { supabaseUser } from '$lib/utils/supabaseUser';

  /* ------------------------------------------------------------
     PROPS (passed in from +page.svelte)
     ------------------------------------------------------------ */
  export let lectureId: string; // permanent lecture ID
  export let userId: string;    // authenticated client user ID

  /* ------------------------------------------------------------
     TYPES
     ------------------------------------------------------------ */
  type Note = {
    id: string;
    note_content: string;
  };

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  let notes: Note[] = [];          // all notes for this lecture
  let draft = '';                  // new note draft
  let status = 'Saved';            // autosave UI feedback
  let autosaveTimeout: number | null = null;

  /* ------------------------------------------------------------
     LOAD NOTES
     ------------------------------------------------------------ */
  async function loadNotes() {
    const { data, error } = await supabaseUser
      .from('sticky_notes')
      .select('id, note_content')
      .eq('lecture_id', lectureId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('StickyNotes load error:', error);
      return;
    }

    notes = data ?? [];
  }

  /* ------------------------------------------------------------
     CREATE NOTE
     ------------------------------------------------------------ */
  async function addNote() {
    if (!draft.trim()) return;

    status = 'Saving…';

    const { error } = await supabaseUser
      .from('sticky_notes')
      .insert({
        lecture_id: lectureId,
        user_id: userId,
        note_content: draft
      });

    if (error) {
      console.error('StickyNotes insert error:', error);
      return;
    }

    draft = '';
    await loadNotes();
    status = 'Saved';
  }

  /* ------------------------------------------------------------
     AUTOSAVE NOTE (debounced)
     ------------------------------------------------------------ */
  function autosaveNote(id: string, value: string) {
    status = 'Saving…';

    // Clear previous debounce timer
    if (autosaveTimeout) clearTimeout(autosaveTimeout);

    autosaveTimeout = window.setTimeout(async () => {
      const { error } = await supabaseUser
        .from('sticky_notes')
        .update({ note_content: value })
        .eq('id', id);

      if (error) {
        console.error('StickyNotes update error:', error);
        return;
      }

      status = 'Saved';
    }, 800);
  }

  /* ------------------------------------------------------------
     DELETE NOTE
     ------------------------------------------------------------ */
  async function deleteNote(id: string) {
    const { error } = await supabaseUser
      .from('sticky_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('StickyNotes delete error:', error);
      return;
    }

    await loadNotes();
  }

  /* ------------------------------------------------------------
     REACTIVE LOAD
     ------------------------------------------------------------
     Runs when lectureId or userId becomes available.
     This avoids onMount timing issues in SvelteKit.
     ------------------------------------------------------------ */
  $: if (lectureId && userId) {
    loadNotes();
  }

  /* ------------------------------------------------------------
     CLEANUP
     ------------------------------------------------------------ */
  onDestroy(() => {
    if (autosaveTimeout) clearTimeout(autosaveTimeout);
  });
</script>

<!-- ============================================================
     UI
     ============================================================ -->
<section class="sticky-notes">
  <h3 id="sticky-title">Your Private Notes</h3>

  <!-- New note input -->
  <label for="new-note" class="sr-only">Add a new note</label>
  <textarea
    id="new-note"
    placeholder="Write a note and click Add"
    bind:value={draft}
  ></textarea>

  <button on:click={addNote}>Add</button>

  <!-- Autosave status (screen-reader friendly) -->
  <small aria-live="polite">{status}</small>

  <!-- Existing notes -->
  <ul aria-labelledby="sticky-title">
    {#each notes as note (note.id)}
      <li class="note">
        <label class="sr-only" for={`note-${note.id}`}>
          Edit note
        </label>

        <textarea
          id={`note-${note.id}`}
          on:input={(e) =>
            autosaveNote(
              note.id,
              (e.target as HTMLTextAreaElement).value
            )
          }
        >{note.note_content}</textarea>

        <button
          on:click={() => deleteNote(note.id)}
          aria-label="Delete note"
        >
          🗑
        </button>
      </li>
    {/each}
  </ul>
</section>

<!-- ============================================================
     STYLES
     ============================================================ -->
<style>
  .sticky-notes {
    background: #fffbe6;
    padding: 1rem;
    border-radius: 0.75rem;
  }

  textarea {
    width: 100%;
    min-height: 80px;
    margin-bottom: 0.5rem;
  }

  .note {
    margin-bottom: 0.75rem;
  }
</style>
