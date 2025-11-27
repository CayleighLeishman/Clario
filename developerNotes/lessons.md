
# September 26 2025 | Cayleigh Leishman

### CLARIO SVELTEKIT PROJECT SETUP GUIDE 
This guide outlines the mandatory folder structure and naming conventions for implementing role-based routing (Client and Transcriber) in Clario.

***I. FOLDER STRUCTURE (Copy this structure into src/routes)***

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


***II. MANDATORY NAMING CONVENTIONS***
You must use these exact filenames for SvelteKit to recognize them:

+page.svelte: Always used for the final content of a URL.

+layout.svelte: Always used for wrapping content and defining the UI frame.

+layout.server.ts: Always used for server-side security checks and data fetching.

***III. KEY PRINCIPLES***

Lowercase Folders: All folder names (e.g., client, transcriber, login) must be lowercase to prevent URL-casing issues on production servers.

Security: Role security is enforced by the +layout.server.ts file in the client/ and transcriber/ folders. If the role check fails, a redirect must be issued.

Data Abstraction: Use a Repository Layer (e.g., ProjectRepository.ts) for all database access. Never call Supabase query functions directly inside Svelte components or layout files.


# September 30 2025  | Cayleigh Leishman

I spent most this time studying the databases, relearning basic temrinology that I have frogotten from my previous classes. I was goingg to work on the sign in page, howerver, I know that I need to have a better understanding of databases and how they work before I can do anyting. 

I figured i would learn about different types of databases and how they work. 

I also spent some time learning a little bit of Web security and about sql injections mainly.

I'm also going to read the supabase documentation to make sure I'm not missing anyting. 



# October 01 2025 | Cayleigh Leishman 

I spent most of the day studying "The Manga Guide to Databases" to learn about different databases and datatypes as well as refresh on some basic temrminology that I had forgotten. I'm glad I took the time to do this, because then I was able to talk with Chatgbt and Gemini about the database's and get better responses because I could ask the right questions to get me to the answers I needed. I updated "Database.md" with the information I learned today, so you can check that out. 

I mean it might get updated eventually, but at this time it has the 7 tables I'm going to use for the MVP and the relationships between them. I also have an image of the type if that would help. 

So we'll see how that goes. I really hoped I would have the database set up now so I could focu son the sign in page, but I need to finish the documentation first and make sure I have everything I need. 

# October 07 2025 | Cayleigh Leishman

## Getting Organized

so I'm getting my act together and after making the SRS version 1.0, I'm goingto follow along w2ith it the best that i can. 


### code I used in supabase to create the tables 

bash 
```sql
-- ======================================
-- 1. Profiles
-- ======================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    preferred_name TEXT,
    role TEXT CHECK(role IN ('client', 'transcriber', 'admin')),
    is_admin BOOLEAN DEFAULT FALSE,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ
);

-- Sample users (UUIDs generated for example)
INSERT INTO profiles (id, full_name, preferred_name, role, is_admin, bio)
VALUES
('11111111-1111-1111-1111-111111111111', 'Alice Student', 'Alice', 'client', FALSE, 'Student in Web Dev 1'),
('22222222-2222-2222-2222-222222222222', 'Bob Student', 'Bob', 'client', FALSE, 'Student in Database class'),
('33333333-3333-3333-3333-333333333333', 'Charlie Student', 'Charlie', 'client', FALSE, 'Student interested in ML'),
('44444444-4444-4444-4444-444444444444', 'Diana Transcriber', 'Diana', 'transcriber', FALSE, 'Experienced transcriber'),
('55555555-5555-5555-5555-555555555555', 'Evan Transcriber', 'Evan', 'transcriber', FALSE, 'Backup transcriber'),
('66666666-6666-6666-6666-666666666666', 'Fiona Transcriber', 'Fiona', 'transcriber', FALSE, 'Live session support'),
('77777777-7777-7777-7777-777777777777', 'Admin User', 'Admin', 'admin', TRUE, 'System administrator');

-- ======================================
-- 2. Course Lectures
-- ======================================
CREATE TABLE course_lectures (
    id UUID PRIMARY KEY,
    course_name TEXT NOT NULL,
    lecture_date DATE NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO course_lectures (id, course_name, lecture_date, join_code)
VALUES
('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Web Development 101', '2025-10-08', 'WD101-001'),
('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Database Design', '2025-10-09', 'DB101-001');

-- ======================================
-- 3. Student Enrollments
-- ======================================
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES profiles(id),
    course_lecture_id UUID REFERENCES course_lectures(id),
    joined_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO student_enrollments (id, student_id, course_lecture_id)
VALUES
('eeeeeee1-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('eeeeeee2-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
('eeeeeee3-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- ======================================
-- 4. Active Sessions
-- ======================================
CREATE TABLE active_sessions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    transcriber_id UUID REFERENCES profiles(id),
    is_live BOOLEAN DEFAULT TRUE,
    session_token UUID UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- Example: two transcribers in one session
INSERT INTO active_sessions (id, lecture_id, transcriber_id, session_token)
VALUES
('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', gen_random_uuid()),
('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', gen_random_uuid());

-- ======================================
-- 5. Realtime Chunks
-- ======================================
CREATE TABLE realtime_chunks (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES active_sessions(id),
    sequence_number INT NOT NULL,
    text_chunk TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_realtime_session_sequence ON realtime_chunks (session_id, sequence_number);

-- ======================================
-- 6. Final Transcriptions
-- ======================================
CREATE TABLE final_transcriptions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    raw_full_text TEXT NOT NULL,
    final_duration_minutes INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
```
then i deleted the above and ran 
```sql
-- enables pgcryptop for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

```

October 08 2025 | Cayleigh Leishman
10am

I ran into a promblem when trying to insert data into the profiles table. I kept getting this error:

```sql
ERROR: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"

```

I used ChatGPT to figure out what the error actually meant -- at first, I thought it was saying the profiles table didn’t connect properly. But it was really saying that the ID (the people) I was trying to add to the profiles table didn’t exist in the right place. Basically, I was trying to add people to an account, but the auth.users table (the system that handles usernames and passwords) needed to have the user first before I could add them to the profiles table. That makes sense, since profiles.id is linked to auth.users.id.

I realized that happened because I don’t really have control over the auth.users table -- I can’t just add users to it manually. For a bit, I wondered if that meant I didn’t even need the profiles table, but I eventually figured out that I do. The *auth.users table* only stores basic info like emails, passwords, and IDs, it wont allow me to add  "roles" or show name or prefered name on the list because of it's security/encryption rules. So I do need the *profiles table* to store all that extra info about users. 

```md
id    ← UUID (used as foreign key in profiles)
email
encrypted_password
phone
created_at
last_sign_in_at
```

To fix the error, I need to first create a user in the auth.users table and then use that user's ID when inserting into the profiles table. 

So I'll need to make the webpage for the signin now. Which hopefully won't take too long. After a User signs up/logs in , then I can add all the extra information to the profiles table. 

## October 08 2025 | Changing file organization 

After doing some more reading to understand sveltekit's file organization i decided i didn't want to have the file organization that i had before. I wanted to have a something more dynamic and would help me in the long run. 

But I leared that if you have a folder with a +layout.svelte and +layout.server.ts file, everything inside that folder will be protected by the server file. So I decided to have a (public) folder for all the marketing and authentication pages. Then I would have a client folder for all the client routes and a transcriber folder for all the transcriber routes. 

so now the file organization look ssomething like this:
src/
 ├─ lib/                   # Reusable UI components, utilities, and stores
 │   ├─ components/
 │   ├─ utils/
 │   └─ styles/
 │
 ├─ routes/
 │   ├─ (public)/          # Pages anyone can view (no login required)
 │   │   ├─ +layout.svelte
 │   │   ├─ +page.svelte   # e.g. Home page with mission statement & purpose
 │   │   └─ about/+page.svelte
 │   │
 │   ├─ client/            # Pages for users receiving transcription support
 │   │   ├─ +layout.svelte
 │   │   ├─ dashboard/+page.svelte
 │   │   ├─ notes/+page.svelte      # Replaces "transcript" — more natural name
 │   │   └─ sessions/[id]/+page.svelte   # Specific ongoing session
 │   │
 │   ├─ transcriber/       # Pages for hired transcribers
 │   │   ├─ +layout.svelte
 │   │   ├─ dashboard/+page.svelte
 │   │   └─ sessions/[id]/+page.svelte
 │   │
 │   ├─ room/              # Shared real-time transcription session
 │   │   └─ [id]/+page.svelte
 │   │
 │   ├─ admin/             # Administrative tools and pages
 │   │   ├─ +layout.svelte
 │   │   ├─ dashboard/+page.svelte
 │   │   ├─ users/+page.svelte
 │   │   └─ reports/+page.svelte
 │   │
 │   ├─ login/+page.svelte
 │   └─ register/+page.svelte
 │
 └─ static/                # Assets that never change (icons, images, etc.)

here's some explainaation of whateach folder does:
src/ – This is where all the main work happens. The code that makes the app run lives here.

lib/ – Stores reusable parts, like buttons, headers, and styles. Think of it as the “toolbox” that helps make pages look nice and work the same way everywhere.

routes/ – Contains all the pages people can see in their browser, plus some behind-the-scenes code for logging in, permissions, and data.

(public)/ – Pages anyone can see, even if they’re not logged in. Includes the homepage, login, and register pages. The parentheses mean it’s just for organizing and won’t show up in the web address.

client/ – Pages for people using the service to get help hearing class notes. Includes their dashboard, their saved notes, and specific session pages.

transcriber/ – Pages for the people who listen in and type what’s being said in class. Contains their dashboard and session pages.

room/ – The live session where both the client and transcriber join to see or create notes in real time.

admin/ – Pages for administrators who manage users and sessions. Only admins can access these.

login/+page.svelte & register/+page.svelte – Public pages for signing in or making a new account.

static/ – Stores files that don’t change, like pictures or icons.

+layout.svelte – A wrapper for pages that shares the same look, like a header, footer, or sidebar.

+layout.server.ts – Special code that runs on the server to check things like whether a user is allowed to see a group of pages.

+page.svelte – The actual content of each page that people see.

+page.server.ts – Optional server code for a single page, like checking if a user is allowed to open that page or fetching private data.


## october 09 2025 
I worked on the sign in page, worked primarily on the files src/routes/client/+layout.svelte and src/routes/client/+layout.server.ts.
I added comments to all the files because I know if i look at it tomorrow I'll be confused what all the code is. It might be overkill, but I wwant to make sure i know it was intentional. Also, I figured if someone else was new and wanted to check out the code they could at least somewhat understand what I was trying to do. 

## October 10 2025 | 
I worked on the sign in page some more, primarily on the files src/routes/(public)/+layout.svelte and src/routes/(public)/login/+page.svelte. I also added comments to all the files becauuse I figured it would be helpful for me in the future and for anyone else who may be looking at the code. 

I promarilyworked on the styling so that when I open the page, I can understand which page I'm looking at. I also added theme toggle button to the header, but it probably wont' be functional until i work on everything else. And I might delete it down the line anyways because I want the color change to be in the settings anyways, and people can just change it there. but I wanted to leave it in for now. 

I also wanted to add the styles because now when I run the site, all I see is 
"Not Found

Cayleigh Leishman

Privacy Policy tutorial
@ 2025 Brigham University - Idaho"

Which dosen't help me figure out which page I'm on, or how functional the code I have for the backend is. I'm hoping onc eI finish client, and transcriber pages, then the signin page will help me determine if the roles are working semiproperly. I can't add to the database until I created a person using the supabase sign in, so I wanted to set all this frontend up so that I can actually test out the permissions. 

10:36

Also created the logo, im not sure i love it, but i think its good enough for what i need. but i learned that if you have a logo/favicon, you can;t just type 

../assets/favicon.

you have to type imports and import it onto the page. So I thought that was interesting.I used Canva to create it in png format, and then used a converter to confert from png to svg. 

I dont know if i like the beige, but im going to stick with it for now and change it if i have time down the line, not right now. 

10:50pm 
I was hoping to add permissions to get client, transcriber and admin set up, but im so exausted but here's code chatgbt suggested:

```svelte


<!-- // After user signs up you can choose your role -->
const { data: profile, error } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    email: user.email,
    role: 'client' // or 'admin' / 'transcriber'
  });

<!-- You pick 'client', 'admin', or 'transcriber' when creating the profile. -->

<!-- +layout.server.ts or +page.server.ts -->

// After user signs up
const { data: profile, error } = await supabase
  .from('profiles')
  .insert({
    id: user.id,
    email: user.email,
    role: 'client' // or 'admin' / 'transcriber'
  });
<!-- You pick 'client', 'admin', or 'transcriber' when creating the profile. -->

 <!-- protecting routes by role -->
import { redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ cookies }) => {
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, { cookies });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) throw redirect(303, '/login');

  // Fetch the user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'client') {
    throw redirect(303, '/login'); // redirect if not client
  }

  return { session, role: profile.role };
};
<!-- Replace 'client' with 'admin' or 'transcriber' for other route groups. -->

<!-- using in the header -->

 {#if session?.role === 'client'}
  <nav>Client Links</nav>
{:else if session?.role === 'admin'}
  <nav>Admin Links</nav>
{:else if session?.role === 'transcriber'}
  <nav>Transcriber Links</nav>
{/if}


```
### October 13  2025 | Ghost Bug / Invisible Character (BOM) in CSS

I ran into the weirdest error in my `settings-popup.css` file. The code looked completely fine, but Visual Studio Code kept showing errors like this:

```bash
[{
  "resource": "/c:/Users/cayle/Documents/byui/senior-proj/Clario/Clario/src/lib/styles/settings-popup.css",
  "owner": "_generated_diagnostic_collection_name_#6",
  "code": "expected_token",
  "severity": 8,
  "message": "Expected token }\nhttps://svelte.dev/e/expected_token",
  "source": "svelte",
  "startLineNumber": 3,
  "startColumn": 11,
  "endLineNumber": 3,
  "endColumn": 11,
  "origin": "extHost1"
}]
```

Even though the code was correct:

```css
/* Overlay behind the modal */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 50;
}
/*Modal container */
.settings-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;        /* default background color */
  color: #000000;           /* default text color */
  padding: 2rem;
  border-radius: 8px;
  width: 300px;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* Labels and inputs spacing */
.settings-modal label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

/* Buttons container */
.settings-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

/* Buttons */
.settings-buttons button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

/* Save button */
.settings-buttons button:first-child {
  background-color: #1d4ed8; /* blue */
  color: white;
}

.settings-buttons button:first-child:hover {
  background-color: #2563eb;
}

/* Close button */
.settings-buttons button:last-child {
  background-color: #e5e7eb; /* gray */
  color: #111827;
}

.settings-buttons button:last-child:hover {
  background-color: #d1d5db;
}
```

The fix was surprisingly simple: cut all the text out, close Visual Studio Code, then paste it back. No more errors!

This was caused by an **invisible character error**, often called a **Byte Order Mark (BOM)**.

**What’s a BOM?**
A **Byte Order Mark (BOM)** is an invisible character at the very start of a text file that tells the computer the file’s encoding (like UTF-8). Sometimes, CSS or JS parsers don’t expect it, which can create mysterious errors even if the code looks correct.

Here's a rough summary of what I did: 
 focused on improving the front-end of Clario’s login page and settings modal. I moved the inline styles into separate CSS files to make the code cleaner and easier to maintain. I also connected all the colors and elements to the global theme variables so that the pages would consistently follow our light and dark mode design.

I set up the login buttons to properly navigate users to the client and transcriber dashboards, making the login flow functional. I also updated the modals and buttons to fully respect the dark mode overrides, ensuring the interface looks good and remains readable in both light and dark themes.

Overall, it was a productive day of refactoring, theming, and improving user experience. I'll put more focus on the role based design now. 

### October 14 2025 | Caches and memory

Imagine you’re writing a story, and someone tries to take away your notebook before you’ve finished writing the page.

That’s kind of what happened in my Clario project. SvelteKit (the “reader”) tried to look at the data (data.session) before the “writer” — my server file (+layout.server.ts) — was done creating it.

At first, there was no page at all — the +layout.server.ts file didn’t exist — so SvelteKit (the reader) only saw a blank page ({}) and said, “Hey, I can’t find session here!”

I didn’t realize I needed a +layout.server.ts file for both the public and client folders. Once I added one for the public side, the logic was sound (confirmed by both ChatGPT and Gemini), even though the site didn’t fix itself right away.

The problem was that the public section didn’t have its own writer yet, so the reader (SvelteKit) just saw a blank page. After adding the missing writer, both the public and client notebooks finally had someone writing in them — but the reader was still looking at the old notebook.

That old copy was stored in something called a cache, which keeps old data around to load things faster. So even though the new page was written, the reader kept checking the wrong notebook.

To fix it, I had to:

Throw away the old notebooks (delete the .svelte-kit and .vite folders),

Ask the reader to take a brand-new picture (rebuild the project), and

Restart my text editor (to clear its memory).

Once I did that, the reader finally looked at the new, updated page — and everything made sense again.

Reflection:
Today reminded me how sometimes the problem isn’t with the logic itself, but with how the system remembers old information. Even when the story is written correctly, you might just need to remind the reader to grab the latest draft.


this is drivign me nuts, I keep getting a "Property 'SESSION" does not exist on type '{}' error. 

According to chatgbt and gemini the code is correct, so I'm not really sure what else to try because I've already deleted the svelte-kit and .vite folders, restarted visual studio code. 

the only thing i havent tried is restarting my project, but i feel like that's a bit overkill, and I don't think i need to redo everything. 



### Oct 31 2025  | debugging env.dts file (login issue)


#### **1️⃣ 500 Internal Server Error**

* Happened when visiting the login page.
* Cause: The code tried to check `event.locals.session` **before any session existed**.
* Lesson: Don’t ask the server if someone is logged in until sessions actually exist.
* Fix: Remove session checks for now. Just render the login form.

---

#### **2️⃣ Cannot find module '$env/static/public'**

* Happened in `supabaseUser.ts`.
* Cause: TypeScript couldn’t find the environment variables for Supabase.
* Lesson: `$env/static/public` is where SvelteKit stores public `.env` values.
* Fix: Make sure `.env` file exists with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`, and create `env.d.ts` so TypeScript knows about them.

---

#### **3️⃣ Cannot find module '$lib/supabaseUser'**

* Happened in login page code.
* Cause: The import path was wrong or file name didn’t match.
* Lesson: Paths are important! Must match file names exactly.
* Fix: Make sure the file is `src/lib/supabaseUser.ts` and the import is:

```ts
import { supabaseUser } from '$lib/supabaseUser';
```

---

#### **4️⃣ Cannot redeclare block-scoped variable 'load'**

* Happened in `+page.server.ts`.
* Cause: Two `export const load` functions in the same file.
* Lesson: Only **one `load`** function per page server file.
* Fix: Merge duplicate load functions or delete extras.

---

#### **5️⃣ @typescript-eslint/no-empty-interface**

* Happened in `app.d.ts`.
* Cause: Created an interface with nothing in it. TypeScript thinks it’s weird.
* Lesson: Empty boxes/interfaces can confuse TypeScript.
* Fix: Add properties, or tell the linter to ignore it for now.

---

#### **Key Takeaways**

* Always start with a simple login page **without session checks**.
* Only after login succeeds, check roles and redirect.
* Make sure all file paths and environment variables exist.
* Avoid duplicate function declarations in the same file.



## November 11, 2025 | Finally recovering

I’ve been sick and hospitalized twice. Now I’m finally getting back to the project.

Most of the website is locked unless you’re logged in. I had rules to make sure only people with accounts could see the pages. But I forgot to tell the website that the login page is like a door that should always open. So the site kept saying, “Go to the door!” but the door wouldn’t open because it thought you needed a key to get in. That’s why people got stuck going to login over and over.

Fix: I updated the code to make the login page a “public page,” so unauthenticated users can see it without being redirected.

Original code causing the loop:

if (!session && !publicPages.includes(url.pathname)) {
  throw redirect(303, '/login');
}


Now it works correctly because the site knows the login page is safe for everyone.


## November 14, 2025 | working on role-based routing and creating dashboard for client

in supabase Using Supabase Dashboard I followed this instruction: 

To run SQL commands (like creating policies):

Go to SQL Editor → New Query. (oit's under "private" on the left side panel. I named the file "Row Level Securities + Policies for database Tables")

# Thus us the sql I put in Rls + policies file

for profiles table: 

```sql
-- ======================================
-- Enable RLS on all tables
-- ======================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_transcriptions ENABLE ROW LEVEL SECURITY;

-- ======================================
--  Profiles table policies
-- ======================================
CREATE POLICY "Users can select own profile" 
ON profiles FOR SELECT
USING (id = auth.uid() OR is_admin);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid() OR is_admin);

CREATE POLICY "Admins can insert profiles"
ON profiles FOR INSERT
USING (is_admin);

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (is_admin);

-- ======================================
--  Course Lectures policies
-- ======================================
CREATE POLICY "Users can select lectures"
ON course_lectures FOR SELECT
USING (true);

CREATE POLICY "Admins can manage lectures"
ON course_lectures FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
--  Student Enrollments policies
-- ======================================
CREATE POLICY "Students can select own enrollment"
ON student_enrollments FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Students can insert own enrollment"
ON student_enrollments FOR INSERT
USING (student_id = auth.uid());

CREATE POLICY "Admins can manage enrollments"
ON student_enrollments FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
--  Active Sessions policies
-- ======================================
CREATE POLICY "Transcribers can select own sessions"
ON active_sessions FOR SELECT
USING (transcriber_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Transcribers can update own sessions"
ON active_sessions FOR UPDATE
USING (transcriber_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage sessions"
ON active_sessions FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
--  Realtime Chunks policies
-- ======================================
CREATE POLICY "Transcribers can insert chunks for own session"
ON realtime_chunks FOR INSERT
USING (session_id IN (
  SELECT id FROM active_sessions WHERE transcriber_id = auth.uid()
));

CREATE POLICY "Transcribers can select chunks for own session"
ON realtime_chunks FOR SELECT
USING (session_id IN (
  SELECT id FROM active_sessions WHERE transcriber_id = auth.uid()
));

CREATE POLICY "Admins can manage chunks"
ON realtime_chunks FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
--  Final Transcriptions policies
-- ======================================
CREATE POLICY "Admins can manage final transcriptions"
ON final_transcriptions FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can select final transcriptions"
ON final_transcriptions FOR SELECT
USING (true);


```
errors i got 

```sql
Error: Failed to run sql query: ERROR: 42601: only WITH CHECK expression allowed for INSERT
```

this error occurs because the 'using' clause is not allowed for insert policies in postgresql instead I should have used with "check" clause for insert policiies 

so i changed it to 

``sql 
-- ======================================
-- 1️⃣ Enable RLS on all tables
-- ======================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE final_transcriptions ENABLE ROW LEVEL SECURITY;

-- ======================================
-- 2️⃣ Profiles table policies
-- ======================================
CREATE POLICY "Users can select own profile" 
ON profiles FOR SELECT
USING (id = auth.uid() OR is_admin);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (id = auth.uid() OR is_admin)
WITH CHECK (id = auth.uid() OR is_admin);

CREATE POLICY "Admins can insert profiles"
ON profiles FOR INSERT
WITH CHECK (is_admin);

CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE
USING (is_admin);

-- ======================================
-- 3️⃣ Course Lectures policies
-- ======================================
CREATE POLICY "Users can select lectures"
ON course_lectures FOR SELECT
USING (true);

CREATE POLICY "Admins can manage lectures"
ON course_lectures FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
-- 4️⃣ Student Enrollments policies
-- ======================================
CREATE POLICY "Students can select own enrollment"
ON student_enrollments FOR SELECT
USING (student_id = auth.uid());

CREATE POLICY "Students can insert own enrollment"
ON student_enrollments FOR INSERT
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can manage enrollments"
ON student_enrollments FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
-- 5️⃣ Active Sessions policies
-- ======================================
CREATE POLICY "Transcribers can select own sessions"
ON active_sessions FOR SELECT
USING (transcriber_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Transcribers can update own sessions"
ON active_sessions FOR UPDATE
USING (transcriber_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()))
WITH CHECK (transcriber_id = auth.uid() OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage sessions"
ON active_sessions FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
-- 6️⃣ Realtime Chunks policies
-- ======================================
CREATE POLICY "Transcribers can insert chunks for own session"
ON realtime_chunks FOR INSERT
WITH CHECK (session_id IN (
  SELECT id FROM active_sessions WHERE transcriber_id = auth.uid()
));

CREATE POLICY "Transcribers can select chunks for own session"
ON realtime_chunks FOR SELECT
USING (session_id IN (
  SELECT id FROM active_sessions WHERE transcriber_id = auth.uid()
));

CREATE POLICY "Admins can manage chunks"
ON realtime_chunks FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- ======================================
-- 7️⃣ Final Transcriptions policies
-- ======================================
CREATE POLICY "Admins can manage final transcriptions"
ON final_transcriptions FOR ALL
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can select final transcriptions"
ON final_transcriptions FOR SELECT
USING (true);

```

I then got "Success. No rows returned"

**Senior Project – Session & Layout Implementation**  

Today I set up the client and public layouts in SvelteKit.  

I created a dynamic Header with role-based navigation and a Settings modal.  

I connected Supabase authentication to manage sessions across pages.  

I learned how to use server-side layouts to securely provide session data.  

I learned how to reactively bind `$page.data.session` in client layouts.  

I learned the importance of file casing and avoiding circular imports to prevent TypeScript and Vite errors.

I also created a basic client dashboard page that fetches and dsiplays the logged in users profile info from the supabase "profiles" table. it was a process but i think we're getting there.


## Novemner 15 2025 | Continuing Role Based Routing and Dashboard Development




## November 21 2025 | Working on Transcript page and role based routing 

Today I worked on fixing the session and profile handling for my Clario transcript app. The main problem was that I didn’t have an active session, so the “Join” button for rooms wasn’t working and kept saying, “please input a valid ID.” I realized that without a session seeded in Supabase, the app couldn’t navigate to a transcript room properly.

I tried a few things: I thought about creating a test session in Supabase for a fake class like “Math 101” to see if joining would work. I also noticed that after logging in as a transcriber, my user wasn’t being added automatically to the profiles table. To fix that, I attempted using an ensureProfile() function to create a profile automatically.

However, adding ensureProfile() caused more problems. It broke the layout server because event was undefined, and multiple calls to it were causing errors. Even after logging out and back in, the issue persisted because the user_metadata.role was incorrectly set to "client" instead of "transcriber".

Looking at the Supabase logs, I noticed:

Initial sessions were null until login succeeded.

Supabase warned that getSession() could be insecure and suggested using getUser() instead.

The login finally worked, but the role still needed fixing.

Fetching /client/sessions returned 404, so that route either doesn’t exist or isn’t connected yet.

Next steps I identified:

Correct the user role in Supabase to "transcriber" for testing.

Switch to supabase.auth.getUser() for secure server-side authentication.

Update +layout.server.ts so profiles are automatically created for logged-in users.

Fix or create the /client/sessions route.

Avoid passing the wrong argument to ensureProfile(); instead, pass the Supabase client or user object.

Overall, it was a day of debugging Supabase authentication and profile creation. Progress was made in understanding why the transcriber login wasn’t working, and I now have a clear plan for fixing it so that sessions and profiles will function correctly.

However, Supabase is going to be having issues the next few days, so I will have to figure out how the heck I’m going to attempt to catch up.

This will be a stressful next week. 


nov 24 2025 | fixing login issues and adding admin role


``sql
-- Delete all rows in the profiles table and reset any auto-generated IDs
TRUNCATE TABLE profiles RESTART IDENTITY CASCADE;
```

Today I worked on my live “room” setup. I got the server-side check working so it knows who’s entering the room, pulls their name and role, and makes sure they’re logged in. I also set up the page that loads old transcript messages, listens for new ones in real time, and lets transcribers or admins send messages. I cleaned up how the session ID is passed around to try to connect everything correctly. I also tried to work on the supabase issues and removed login issues so i could create an admin role. 


nov 26 

I figured out why client/sessions routes had issues, its because I regredibly  forgot sessions is supposed to bethe "room" folder. 

I also worked on the admin user management page 
 (Src/routes/admin/[users]/+page.svelte) 
 
 I  added checks to make sure only someone who’s already an admin can create a new admin or give someone admin rights. This way, no one can accidentally or intentionally give themselves extra permissions, and the roles for clients, transcribers, and admins stay safe and clear

now if it works only time will tell, but i at least have it started and there are no visible problems in visual studio code.