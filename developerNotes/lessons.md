
September 26 2025 | Cayleigh Leishman

## CLARIO SVELTEKIT PROJECT SETUP GUIDE ##
This guide outlines the mandatory folder structure and naming conventions for implementing role-based routing (Client and Transcriber) in Clario.

***  I. FOLDER STRUCTURE (Copy this structure into src/routes)  ***
src/routes/
├── (public)/         <-- Group folder: URLs are used, but layout inheritance is broken.
│   ├── +page.svelte  <-- Renders the Homepage (URL: /)
│   ├── login/
│   │   └── +page.svelte  <-- Login Page (URL: /login)
│   └── register/
│       └── +page.svelte  <-- Registration Page (URL: /register)
│
├── client/           <-- Root for all Client-only routes
│   ├── +layout.svelte      <-- Renders the Client-specific sidebar/menu UI
│   ├── +layout.server.ts   <-- CRUCIAL: Security check for role === 'client'
│   │
│   ├── +page.svelte        <-- Client Dashboard (URL: /client)
│   │
│   └── projects/
│       └── [id]/
│           └── +page.svelte  <-- Specific Project View (URL: /client/projects/123)
│
└── transcriber/      <-- Root for all Transcriber-only routes
├── +layout.svelte      <-- Renders the Transcriber-specific UI
├── +layout.server.ts   <-- CRUCIAL: Security check for role === 'transcriber'
│
├── +page.svelte        <-- Transcriber Dashboard/Task List (URL: /transcriber)
│
└── task/
└── [id]/
└── +page.svelte  <-- Real-Time Transcription Editor (URL: /transcriber/task/456)

*** II. MANDATORY NAMING CONVENTIONS ***
You must use these exact filenames for SvelteKit to recognize them:

+page.svelte: Always used for the final content of a URL.

+layout.svelte: Always used for wrapping content and defining the UI frame.

+layout.server.ts: Always used for server-side security checks and data fetching.

*** III. KEY PRINCIPLES ***
Lowercase Folders: All folder names (e.g., client, transcriber, login) must be lowercase to prevent URL-casing issues on production servers.

Security: Role security is enforced by the +layout.server.ts file in the client/ and transcriber/ folders. If the role check fails, a redirect must be issued.

Data Abstraction: Use a Repository Layer (e.g., ProjectRepository.ts) for all database access. Never call Supabase query functions directly inside Svelte components or layout files.