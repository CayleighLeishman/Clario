# Clario
This project was inspired by my struggles taking notes in class. I’m deaf and wanted a platform where I could have live transcription without needing to open another video platform (like Zoom, Skype, or Google Meet). I wanted to make something that allows transcribers to do less work, protects privacy, and gives clients the chance to take their own time-stamped notes that are connected to the transcript.

## **The Goal**
The goal of this project is to make communication and learning easier by connecting students, teachers, and professors in the classroom, while giving students better access to their notes and learning materials.


## **Folder Structures**
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


## Folder Explanations 
If the above didn't make sense, here's a breakdown of what each folder/files do:

Clario/ - This is the folder that holds the ***entire*** project. 

node_modules/ – You actually can't see this unless you have the code downloaded properly on your computer, but this holds all the extra code this project needs to work smoothly. These are not written by me, but other people who made tools and what are known in coding as "libraries" or "packages." These are things that help make the project work but I didn't write these myself (that would take me years to make!) 

developerNotes/ – My (Cayleigh's) notes, ideas, and thought process throughout the project. Also includes resources and references I used along with some of my personal documentation to show what I learned and what I did each day I remebered to write.

svelte-kit/ – Everything SvelteKit needs to run the app. Also not written by me, but is credited to the svelte team and community. 

src/ – This is the folder where the app "lives": pages, designs, and code.This is what the Computer looks at to know what to show people when they visit Clario.

Inside the src/:

lib/ – This is where I put reusable code that helps the computer show things like buttons, headers, sidebars, and styles. These are parts that appear in many places on the website, so we only have to write them once. For example, the header at the top of the page with the logo is made here.

routes/ – This is where all the pages people can visit are stored, like the homepage or dashboard. It also contains instructions for the server, which is a helpful computer somewhere else that sends your website to your computer and makes sure it works correctly. Basically, it tells the website what to show and how to behave.

(public)/ – Pages anyone can see without logging in, like the homepage, login page, and register page. These are open to everyone, even if they don’t have an account.

client/ – ages for students who are getting class notes. They can join “sessions” (called “rooms”) where a transcriber types notes for them in real time. These are pages for the people receiving the notes. 

transcriber/ – Pages for the people who type notes during sessions. They join the same “rooms” as the clients to create live transcripts. These are pages for the people providing the notes. 

room/ – This is where the transcription actually happens! Both clients and transcribers join here to collaborate and create notes together. The live page can show video and audio (using something called WebRTC) so everyone can follow along in real time.

admin/ – Pages that only administrators can access. They can manage users, view reports, and make important decisions—basically, they’re the “bosses” of the website.

static/ – FFiles that never or hardly ever change, like images and icons (for example, the logo!). The computer can always find these files in the same place every time, so they’re easy to use on any page. These files are just sitting there, not codded, ready to be used whenever needed. 

## But what are the Files?

- +page.svelte - these are the actual pages people visit. EAch page is a different part of the website, like the homepage or dashboard. That's why I have +pages for login, register, client dashboard, transcriber dashboard and so on.

- +layout.svelte - these are the parts that stay on the same page no matter what page you're on.  These are code I've prewritten to make sure the header, footer, and sidebar look the same for every page. The client, Transcriber and Admin folders all have their own +layout.svelte files because they each have different sidebars and slightly different headers. 

- +layout.server.ts - These files are like "Security guards" for the website. They check if someone is allowed to see certain pages based on their account. For example, if you're a client, you can't see the transcriber's dashboard, only the client. If you're the transcriber you can't see the admin pages and so on. This makes sure everyone only sees what they're supposed to. 

-[sessionId] - This is a special folder that holds pages for the "room." The [sessionId] exists as a placeholder, so if a transcriber creates a room with the ID "1234" the url will be "clario/room/1234" and if a client joins that same URL "Clario/room/1234," they both will end up on the same page. The [sessionId] is just a way to tell the computer "both these people are in the same room, so show them the same page." 

