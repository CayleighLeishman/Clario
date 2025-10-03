# Developer Notes and Process Tracking (Clario)

## 1. Project Overview and Status

**Current Status:**  
We're currently building the foundational framework and handling initial setup.

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

---

## 2. Recent Updates and Changes Log

**2025-09-26 | Dependency Oopsie and Quick Fix**  
- **What I did:** Installed a new package/library.  
- **What went wrong:** It immediately broke everything! I ran into an unexpected dependency conflict that basically killed the app.  
- **Fix:** I uninstalled that thing right away to get the project back to a stable place.  
*(Note to self: Seriously vet dependencies before committing them. No more jumping the gun.)*

---

## 3. Error Handling and Known Issues

**September 26, 2025 | Mental Block / Challenge**  
- **Current Struggle:** I honestly have no idea what I'm doing when it comes to API integration right now. I'm still trying to figure out how to piece all these new concepts together and actually hook them up to the project.

### My Go-To Fix Strategy
- **Dependency Triage:** If something new breaks the build or causes a major error, my strategy is always to yank it out immediately. Stability first, integration second.

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