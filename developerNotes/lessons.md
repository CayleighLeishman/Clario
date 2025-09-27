
September 26 2025 | Cayleigh Leishman

## CLARIO SVELTEKIT PROJECT SETUP GUIDE ##
This guide outlines the mandatory folder structure and naming conventions for implementing role-based routing (Client and Transcriber) in Clario.

***  I. FOLDER STRUCTURE (Copy this structure into src/routes)  ***

File organization suggestion 
src/routes/
├── (public)/                 # Grouped routes for marketing/auth (optional grouping)
│   ├── +page.svelte          # Home page (/) - for logged-out users
│   ├── login/
│   │   └── +page.svelte      # Login page (/login)
│   └── register/
│       └── +page.svelte      # Registration page (/register)
│
├── client/                   # Top-level folder for ALL client-only routes
│   ├── +layout.svelte        # Client UI: Sidebar, logo, etc.
│   ├── +layout.server.ts     # Client Security: Checks if role === 'client'
│   │
│   ├── +page.svelte          # Client Dashboard (/client)
│   │
│   ├── projects/             # Client Project Management
│   │   ├── +page.svelte      # List of all client's projects (/client/projects)
│   │   └── [id]/
│   │       └── +page.svelte  # View specific project details (/client/projects/123)
│   │
│   └── settings/
│       └── +page.svelte      # Client profile and notification settings
│
├── transcriber/              # Top-level folder for ALL transcriber-only routes
│   ├── +layout.svelte        # Transcriber UI: Sidebar, task list view, etc.
│   ├── +layout.server.ts     # Transcriber Security: Checks if role === 'transcriber'
│   │
│   ├── +page.svelte          # Transcriber Dashboard (Assigned/Available Tasks)
│   │
│   └── task/
│       └── [id]/
│           └── +page.svelte  # Real-Time Transcription Editor (/transcriber/task/456)
│
└── settings/                 # Common settings (e.g., password change, general account)
   └── +page.svelte          # Settings page (/settings)



*** II. MANDATORY NAMING CONVENTIONS ***
You must use these exact filenames for SvelteKit to recognize them:

+page.svelte: Always used for the final content of a URL.

+layout.svelte: Always used for wrapping content and defining the UI frame.

+layout.server.ts: Always used for server-side security checks and data fetching.

*** III. KEY PRINCIPLES ***
Lowercase Folders: All folder names (e.g., client, transcriber, login) must be lowercase to prevent URL-casing issues on production servers.

Security: Role security is enforced by the +layout.server.ts file in the client/ and transcriber/ folders. If the role check fails, a redirect must be issued.

Data Abstraction: Use a Repository Layer (e.g., ProjectRepository.ts) for all database access. Never call Supabase query functions directly inside Svelte components or layout files.
