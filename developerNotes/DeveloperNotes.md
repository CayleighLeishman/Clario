# Developer Notes  (Clario)

## 1. Project Overview and Status
**Current Status:**  
In Development  - in the early stages of building out core features and database structure. Still smoothing out user roles and permissions. 

**Goal:**  
The entire purpose of Clario is to be the ultimate, headache-free communication hub. It needs to let clients easily jot down notes for their transcription jobs while ensuring transcribers can strictly focus on listening and typing what they hear.

### What is Clario? (Project Description)
Clario is the internal name for the website. The focus is providing clarity and control for the client while minimizing the workload for the transcribers. It's designed specifically to close the gap between clients and transcribers, making communication and streamlined notes accessible to everyone.

- **For the Client:**  
  Give them a dead-simple place to take, sort, highlight, and add highlights/notes directly within the transcription platform.

- **For the Transcriber:**  
  They get a single, organized place—like a streamlined dashboard—for all the client information, minimizing their workload so they can strictly focus on listening and transcribing.

**The Bottom Line:**  
Make communication so easy that transcription accuracy and speed shoot way up.


**File Organization:**
clario/                  
├─ node_modules/
├─ developerNotes/
├─ svelte-kit/
├─ src/
│   ├─ lib/
│   │   ├─ components/
│   │   ├─ utils/
│   │   └─ styles/
│   │
│   ├─ routes/
│   │   ├─ (public)/
│   │   │   ├─ +layout.svelte
│   │   │   ├─ +page.svelte
│   │   │   ├─ login/+page.svelte
│   │   │   └─ register/+page.svelte
│   │   │
│   │   ├─ client/
│   │   │   ├─ +layout.svelte
│   │   │   ├─ dashboard/+page.svelte
│   │   │   └─ classnotes/+page.svelte   # Saved notes for the client
│   │   │
│   │   ├─ transcriber/
│   │   │   ├─ +layout.svelte
│   │   │   └─ dashboard/+page.svelte
│   │   │
│   │   ├─ room/
│   │   │   └─ [sessionId]/+page.svelte  
│   │   │
│   │   ├─ admin/
│   │   │   ├─ +layout.svelte
│   │   │   ├─ dashboard/+page.svelte
│   │   │   ├─ users/+page.svelte
│   │   │   └─ reports/+page.svelte
│   │
│   └─ static/


 ---

**Files and Folders Explained:**
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


---

## 2. Recent Updates and Changes Log

**Sept 26 2025 | Dependency Oopsie and Quick Fix**  
- **What I did:** Installed a new package/library.  
- **What went wrong:** It immediately broke everything! I ran into an unexpected dependency conflict that basically killed the app.  
- **Fix:** I uninstalled that thing right away to get the project back to a stable place.  
*(Note to self: Seriously vet dependencies before committing them. No more jumping the gun.)*

**October 15 2025 |Note**

I just wanted to put in here that I was dealing with errors and forgot to write changed updates. What I do know is different is tat I didnt have a home page. It dosen't have any styling yet, but it is there. throughout the process I had a lot of errors with supabase and typescript. I have written more about them in the "#.3 Error Handling And Known Issues" section below. 


---

## 3. Error Handling and Known Issues
**October 15 2025 | VS Code Untrusted Publisher Warning**
VS Code prompted:
```cmd
File ...\shellIntegration.ps1 is published by CN=Microsoft Corporation ... and is not trusted on your system.
Only run scripts from trusted publishers.
[V] Never run  [D] Do not run  [R] Run once  [A] Always run
```

Cause: This is the PowerShell integration script that VS Code installs automatically for terminal enhancements. It is signed by Microsoft and safe.

Fix / Lesson Learned:

Choosing A — Always run allows VS Code to trust the script, preventing future prompts.

If uncomfortable, R — Run once works.

Verified that VS Code was installed from the official source. This does not give Microsoft control of the system — it just enables terminal features.

**October 15 2025 | Supabase Registration Call Error**
TypeScript showed:
```cmd
This expression is not callable. Type 'SupabaseClient<…>' has no call signatures.
```

Cause: The Supabase client object was being called like a function: supabaseUser().auth.signUp(...).

Fix: Remove the parentheses; the correct usage is:

supabaseUser.auth.signUp(...)


**October 15 2025 | Supabase User / Server Client Confusion**
I wasn’t sure whether to import supabaseUser (browser client) or SupabaseServer (server client) in the header.

Fix / Lesson Learned:

For browser-only actions (login/logout), import supabaseUser.

For server-side logic (SSR, cookies), use SupabaseServer.

Important distinction: header buttons like logout run only in the browser, so supabaseUser is correct.

**October 15 2025 | Supabase File Casing / Duplicate Import**
TypeScript complained:

File name 'SupabaseUser.ts' differs from already included file name 'supabaseUser.ts' only in casing


Cause: Some imports used $lib/SupabaseUser (capital S) and others $lib/supabaseUser (lowercase s).

Fix:

Standardized the file name and all imports to lowercase (supabaseUser.ts).

Restarted VS Code; the errors cleared.

**October 15 2025 | Relative Import Instead of $lib**
Some imports used relative paths like ../lib/file instead of the SvelteKit alias $lib/file.

Fix / Lesson Learned:

Replaced all ../lib/... imports with $lib/... to avoid errors when files move or the folder structure changes.

$lib ensures consistent, project-wide paths.

**October 15 2025 | Homepage Not Showing / Cache Issue**

After fixing Supabase imports, the homepage was still blank.

Cause: Old cached versions of .svelte-kit and .vite folders caused the page to not reflect updated imports and fixes.

Fix:

Deleted .svelte-kit and .vite folders.

Restarted VS Code and rebuilt the project.

The homepage finally loaded correctly.

**october 14 2025 | Old Cache Issues**
In my Clario project, SvelteKit (the “reader”) tried to access data.session before the “writer” — the +layout.server.ts file — had finished creating it. I hadn’t realized I needed that file in both the public and client folders, so the reader saw a blank page.

Fix: I added the missing file, and the logic was correct (confirmed by ChatGPT and Gemini), but SvelteKit was still looking at an old cached version. Deleting the .svelte-kit and .vite folders, rebuilding, and restarting my editor cleared the cache and fixed the issue. I was worried I’d have to reinstall packages and delete dependencies, but Gemini assured me it was just a Type Resolution Failure — clearing the cache and restarting Visual Studio Code was enough. Lesson Learned! It was a good reminder that sometimes the problem isn’t the logic — it’s leftover memory. 


**October 13 2025 |Ghost Bug / BOM**

I learned that Sometimes VS Code shows errors in CSS/JS even when the code is correct. This can be caused by a **Byte Order Mark (BOM)**—an invisible character at the start of a file that tells the computer the file’s encoding. Cutting the code out the file (ctrl+c) closing Visual Studio Code and opening it again got rid of the error. 

**October 08 2025 | Database errors**
First error was 
```sql
ERROR: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"

```
This happened because I tried to add a new user to the *profiles* table, but that table’s **id column** is a *foreign key* that points to the **id column** in the *auth.users table*. Supabase’s authentication system automatically manages auth.users — *it’s where all user accounts are stored when someone signs up or logs in*. Since I can’t manually add users to that system, the ID I was trying to insert didn’t exist there yet, which caused the error.

In short, Supabase wouldn’t let me create a profile for someone who hasn’t already registered in the authentication system. The system was basically saying: *“You can’t make a profile for someone who hasn’t officially signed up yet.”*

---

**September 26, 2025 | Mental Block / Challenge**  
- **API Thoughts and Mental Struggle:** I honestly have no idea what I'm doing when it comes to API integration right now. I'm still trying to figure out how to piece all these new concepts together and actually hook them up to the project.


### My Go-To Fix Strategy
- **Dependency Triage:** If something new breaks the build or causes a major error, my strategy is always to yank it out immediately. Stability first, integration second.

-**Supabase Authentication and Profiles Table Sync:** Always ensure that any new user is promptly registered through the supabase auth system **before** trying to create a corresponding profile in the profiles table. This keeps everythign in sync and avoids foreign key conflicts. 
(Basically dont try to manually add users to the profiles table. Which menas the admin will have to wait till the user signs up first before the admin can do anything to assing roles. table to add more inforamtion. Or they create the account for them and send them the login details and allows them to change the password later.) 

---

## 4. Learnings and Insights

**September 26, 2025 | Security and Auth Deep Dive**  
- **New Concepts Mastered:**  
  - JWTs (JSON Web Tokens)  
  - Auth Hooks  
  - Row Level Security (RLS)  
  - Custom Claims  

- **How I'm Using It:**  
This whole security deep dive will be crucial for implementing the login and user-specific information correctly.

---

## 5. Technology Stack and Platforms

- **Database/Auth:** Supabase  
- **Frontend Framework:** SvelteKit  
- **Language:** TypeScript  
- **Dependencies:** See `package.json` for a full list of dependencies.
- **Version Control:** Git (with GitHub for remote repository)

## 6.tutorials I followed for this project. 

<!-- facts of sveltekit that can help  -->
[10X Your Sveltekit Developer Experience in VScode](https://www.youtube.com/watch?v=13v50nLh67Qhttps://www.youtube.com/watch?v=13v50nLh67Q)

<!--Accessibility for Teams: Front-End Development -->
[digital.gov](https://digital.gov/guides/accessibility-for-teams/front-end-development)

<!--SvelteKit Authentication with Supabase -->
[SvelteKit Authentication with Supabase](https://www.youtube.com/watch?v=lSm0GNnh-0I&t=9s.96+)

<!-- chatgbt -->
[chatgbt](https://chat.openai.com/)

<!-- gemini -->
[Gemini](https://gemini.google.com/)

<!-- Supabase Document -->
[Supabase Docs](https://supabase.com/docs)

<!-- W3schools for coding tutorials -->
[w3schools](https://www.w3schools.com/)

<!-- Microsoft Edge Accessibility tips -->
[Microsoft Edge Accessibility](https://learn.microsoft.com/en-us/microsoft-edge/accessibility/design)

[Front-End Frameworks: Evaluating Accessibility - University of Michigan](https://accessibility.umich.edu/how-to/design-development/front-end-frameworks)


[ada.gov](https://www.ada.gov/resources/web-guidance/)

## 7. Readings or Books I utilized for this Project


**Acessibility**

[Introduction to Web Accessibility - W3.org](https://www.w3.org/WAI/fundamentals/accessibility-intro/)
[Different Types of Adaptive Switches for Individuals With Disabilities - Enabling Devices](https://enablingdevices.com/blog/different-types-of-adaptive-switches-for-individuals-with-disabilities/?srsltid=AfmBOor0bOoZn6GwoxEsx7uM7GWnH0X744uKdV2Uo7soqo6LuFXHs421)


[Ways to Improve Web Accessibility - Acquia](https://www.acquia.com/blog/ways-to-improve-web-accessibility)

[Accessibility for Teams: Front-End Development - digital.gov](https://digital.gov/guides/accessibility-for-teams/front-end-development/)

[Video Introduction to Web Accessibility and W3C Standards](https://www.w3.org/WAI/videos/standards-and-benefits/)

[WebAIM - Web Accessibility in Mind](https://webaim.org/projects/million/)

[MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label)

[Accessibility Canada](https://accessibilitycanada.ca/wp-content/uploads/2018/10/AccessAbility-Handbook-on-Acc.-Web-Design.pdf)

[ARIA Read this First](https://www.w3.org/WAI/ARIA/apg/patterns/)

[w3.org ARIA Read this First (with Code)](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)


[MDN Prefers Contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)

**Database**
<!-- what are relational Databases -->
[What Are Relational Databases- Youtube](https://www.youtube.com/watch?v=OqjJjpjDRLc)

<!-- How to Normalize a Database -->
[How to Normalize a database - Youtube](https://www.youtube.com/watch?v=siiYInWniFs)

<!-- The Magna Guide to databases-->
[The Manga Guide to Databases](https://oberstar.eu.org/share/Documents/The-Manga-guide-to-databases.pdf)

**Design**
[The Design of Everyday Things - Don Norman](https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded-edition/)


**Security**

[Penetration Testing - Georgia Weidman](https://www.kea.nu/files/textbooks/humblesec/penetrationtesting.pdf)


[Web Security For Developers - Malcom Mcdonalsd](https://www.kea.nu/files/textbooks/humblesec/websecurityfordevelopers.pdf)


***More Will be Added as I find More Resources | Cayleigh Leishman | October 2025***