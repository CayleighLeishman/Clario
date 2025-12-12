<!-- src/routes/client/dashboard/+page.svelte -->
<script lang="ts">
import { onMount } from "svelte"; 
import { createSupabaseBrowser } from "$lib/utils/supabaseBrowser"; // Supabase client

const supabase = createSupabaseBrowser(); // Initialize Supabase client

export let data: { notes: Note[] }; // Notes passed from server

// -------------------------------
// Define Note type
// -------------------------------
type Note = {
    id: number;
    final_transcription_id: number;
    title: string;
    content: string;
};

let notes: Note[] = data.notes ?? [];
let activeNote: Note | null = null;

let renaming = false;       // Whether the rename modal is open
let renameValue = "";       // Temporary value for renaming a note
let saveMessage = "All changes saved"; // Autosave status message
let autosaveTimeout: number | null = null; // Timeout ID for debounced save

// -------------------------------
// Lifecycle
// -------------------------------

// When component mounts, auto-select the first note if available
onMount(() => {
    if (notes.length > 0) activeNote = notes[0];
});

// -------------------------------
// Functions
// -------------------------------

/**
 * Update the content of the active note as the user types.
 * Debounces saving to Supabase to reduce unnecessary requests.
 */
function updateContent(event: Event) {
    if (!activeNote) return;

    activeNote.content = (event.target as HTMLDivElement).innerText;
    saveMessage = "Saving...";

    if (autosaveTimeout) clearTimeout(autosaveTimeout);
    autosaveTimeout = window.setTimeout(saveNote, 1200);
}

/**
 * Save the currently active note's content to Supabase.
 * Updates `saveMessage` to indicate success or failure.
 */
async function saveNote() {
    if (!activeNote || activeNote.final_transcription_id === -1) return;

    const { error } = await supabase
        .from("final_transcriptions")
        .update({ raw_full_text: activeNote.content })
        .eq("id", activeNote.final_transcription_id);

    saveMessage = error ? "Save failed" : "All changes saved";
}

/**
 * Open the rename modal and pre-fill input with the active note's title.
 */
function openRename() {
    if (!activeNote) return;
    renaming = true;
    renameValue = activeNote.title;
}

/**
 * Apply the new title to the active note and close the rename modal.
 */
function applyRename() {
    if (!activeNote) return;
    activeNote.title = renameValue;
    renaming = false;
}

/**
 * Create a new note locally and select it.
 * The new note has a temporary ID and is not yet saved to the database.
 */
function createNote() {
    const newNote: Note = {
        id: Date.now(),
        final_transcription_id: -1,
        title: "Untitled Note",
        content: "",
    };
    notes = [newNote, ...notes];
    activeNote = newNote;
}

/**
 * Delete the currently selected note from the local notes array.
 * Selects the first remaining note if available, otherwise sets `activeNote` to null.
 */
function deleteNote() {
    if (!activeNote) return;

    notes = notes.filter((n) => n.id !== activeNote!.id);
    activeNote = notes[0] ?? null;
}
</script>

<!-- Layout -->
<div class="classnotes-layout">
    <div class="sidebar">
        <h2 class="text-lg font-semibold mb-3">Your Notes</h2>
        <button class="note-button" on:click={createNote}>➕ New Note</button>

        {#each notes as note}
            <button
                class="note-button {activeNote?.id === note.id ? 'active' : ''}"
                on:click={() => (activeNote = note)}
            >
            <!-- Show note title -->
                {note.title} 
            </button>
        {/each}
    </div>

    <div class="editor-area">
        <div class="toolbar">
            <div class="font-semibold">{activeNote?.title ?? "No note selected"}</div> <!-- Current note title -->

            <button on:click={saveNote}>Save</button> 
            <button on:click={openRename}> Rename</button> 
            <button on:click={deleteNote}> Delete</button>

            <!-- Autosave status -->
            <div class="ml-auto text-sm text-gray-500">{saveMessage}</div> 
        </div>

        {#if activeNote}
            <div
                class="editor"
                contenteditable="true"
                on:input={updateContent}
            >
                {activeNote?.content} <!-- Editable content -->
            </div>
        {:else}
            <div class="p-10 text-gray-500">Select or create a note to begin writing.</div>
        {/if}
    </div>
</div>

<!-- Rename Modal -->
{#if renaming}
    <div class="modal-backdrop">
        <div class="modal">
            <h3>Rename Note</h3>
            <input bind:value={renameValue}>
            <button on:click={applyRename}>Save</button>
            <button on:click={() => (renaming = false)}>Cancel</button>
        </div>
    </div>
{/if}

<style>
.classnotes-layout { display: grid; grid-template-columns: 260px 1fr; height: 100%; }                 /* Layout sidebar + editor */
.sidebar { border-right: 1px solid #ddd; padding: 1rem; background: #fafafa; overflow-y: auto; } /* Sidebar style */
.note-button { width: 100%; text-align: left; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 0.5rem; border: none; background: transparent; } /* Note buttons */
.note-button:hover { background: #eaeaea; } /* Hover effect */
.note-button.active { background: #d0e3ff; border: 1px solid #a7c7ff; }                          /* Active note highlight */
.editor-area { display: flex; flex-direction: column; height: 100%; }                                /* Editor column */
.toolbar { padding: 0.75rem; border-bottom: 1px solid #ddd; background: white; display: flex; gap: 1rem; align-items: center; } /* Toolbar layout */
.editor { flex: 1; padding: 2rem; background: #fdfdfd; outline: none; overflow-y: auto; }         /* Editable area */

/* Modal styles */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.modal { background: white; padding: 1.5rem; border-radius: 12px; min-width: 300px; }
</style>
