# Clario Database Schema Documentation (Supabase-Optimized)

This schema is designed to work with **Supabase Authentication**. Authentication (emails, passwords, OAuth, etc.) is handled by `auth.users`. All tables below reside in the public schema and store application-specific data.

---

## 1. Profiles (`profiles`)

Extends `auth.users` with application-specific fields and roles.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`**             | `UUID` | **Primary Key, FK → `auth.users.id`** | Links directly to the Supabase Auth user ID. |
| **`full_name`**        | `TEXT` | Nullable | User’s full name. |
| **`preferred_name`**     | `TEXT` | Nullable | Optional display name or nickname. |
| **`role`**            | `TEXT` | ENUM ('client', 'transcriber', 'admin') | Application role defining permissions. |
| **`is_admin`**          | `BOOLEAN` | Default `FALSE` | Flag for system-level admins. |
| **`bio`**                 | `TEXT` | Nullable | User biography or notes. |
| **`auth_user_id`**      | `UUID` | FK → `auth.users.id` | Reference to Supabase Auth user ID. |
| **`created_at`**         | `TIMESTAMPZ` | Default `NOW()` | Profile creation timestamp. |
| **`last_seen`**          | `TIMESTAMPZ` | Nullable | Last login timestamp. |


---

## 2. Course Lectures (`course_lectures`)

Stores permanent, historical records for each lecture session.

| Column | Type | Constraint/Default | Description |
| :---     | :---       | :---      | :---      |
| **`id`**             | `UUID` | **Primary Key** | Unique lecture ID. |
| **`course_name`**    | `TEXT` | Not Null | Academic course title. |
| **`lecture_date`**   | `DATE` | Not Null | Date the lecture is/was held. |
| **`join_code`**      | `TEXT` | Unique, Not Null, Indexed | Code students use to join the live session. |
| **`created_at`**     |  `TIMESTAMPZ` | Default `NOW()` | Lecture record creation. |

---

## 3. Student Enrollments (`student_enrollments`)

Tracks the many-to-many relationship between students and lectures.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`**         | `UUID` | **Primary Key** | Unique enrollment record ID. |
| **`student_id`** | `UUID` | **Foreign Key → `profiles.id`** | ID of the enrolled student (role = client). |
| **`lecture_id`** | `UUID` | **Foreign Key → `course_lectures.id`** | Lecture enrolled in. |
| **`joined_at`**  | `TIMESTAMPZ` | Default `NOW()` | Enrollment timestamp. |

---

## 4. Student Notes (`student_notes`)

Stores students’ private notes for each lecture.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`**              | `UUID` | **Primary Key** | Unique note ID. |
| **`student_id`**      | `UUID` | **Foreign Key → `profiles.id`** | Student owner (role = client). |
| **`lecture_id`**      | `UUID` | **Foreign Key → `course_lectures.id`**  | Lecture associated with the notes. |
| **`note_title`**      | `TEXT` | Nullable | Title of the note set. |
| **`note_content`**    | `TEXT` | Not Null | Note body/content. |
| **`last_modified_at`**| `TIMESTAMPZ` | Default `NOW()` | Last saved timestamp. |

---

## 5. Active Sessions (`active_sessions`) 

A **temporary** table that tracks the state of a live stream.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`**             | `UUID` | **Primary Key** | Active session ID. |
| **`lecture_id`**     | `UUID` | **Foreign Key → `course_lectures.id`** | Associated permanent lecture record. |
| **`transcriber_id`** | `UUID` | *Foreign Key → `profiles.id`* | Transcriber currently streaming. |
| **`is_live`**        | `BOOLEAN` | Default `TRUE` | True while the transcription is actively being recorded. |
| **`session_token`**  | `UUID` | Unique, Not Null | Temporary key for live connection authentication. |
| **`started_at`**     | `TIMESTAMPZ` | Default `NOW()` | Start time of session. |
| **`ended_at`**       | `TIMESTAMPZ` | Nullable | End time of session. |

---

## 6. Live Data (`realtime_chunks`)

Stores the real-time transcription text feed for students to consume.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`**              | `UUID` | **Primary Key** | Unique text chunk ID. |
| **`session_id`**      | `UUID` | **Foreign Key → `active_sessions.id`**| Live session ID this chunk belongs to. |
| **`sequence_number`** | `INT` | Not Null | Order of chunk in the stream (ensures correct display order). |
| **`text_chunk`**      | `TEXT` | Not Null | Segment of transcribed text. |
| **`created_at`**      | `TIMESTAMPZ` | Default `NOW()` | Timestamp of chunk creation. |

---

## 7. Final Transcriptions (`final_transcriptions`)

Stores the completed, merged transcription for historical access.

| Column | Type | Constraint/Default | Description |
| :--- | :--- | :--- | :--- |
| **`id`** | `UUID` | **Primary Key** | Unique transcription record ID. |
| **`lecture_id`** | `UUID` | **Foreign Key → `course_lectures.id`** | Associated lecture. |
| **`raw_full_text`** | `TEXT` | Not Null | Complete, merged transcript text. |
| **`final_duration_minutes`** | `INT` | Not Null | Duration of the session in minutes. |
| **`completed_at`** | `TIMESTAMPZ` | Default `NOW()` | Completion timestamp. |

---
--- 
# Clario: Join Lecture WebRTC Session Flow

This document outlines the step-by-step process for **Students** and **Transcribers** to join a lecture and connect to a live WebRTC session using the Clario database schema.

---

## Student Flow

The process for a student to join a live lecture:

1.  **Student Clicks "Join Lecture"**
    * The student enters the lecture's **join code**.
    * The system queries the `course_lectures` table to find the lecture matching the `join_code`.

2.  **Enrollment Check**
    * The system checks the `student_enrollments` table using the student's `profiles.id` and the matched `course_lectures.id`.
    * **If no record exists** $\rightarrow$ a new enrollment record is created in `student_enrollments`.

3.  **Find Active Session**
    * The system queries the `active_sessions` table for a record where:
        * `lecture_id` matches the lecture's ID.
        * `is_live` is set to `TRUE`.

4.  **WebRTC Connection Setup**
    * The **`session_token`** is retrieved from the `active_sessions` record.
    * The student's browser uses this token to join the designated WebRTC room.

5.  **WebRTC Signaling & Live Data**
    * The student receives the live audio/video stream and the real-time transcription data from the `realtime_chunks` table.

6.  **Session Ends**
    * The corresponding `active_sessions` record is updated:
        * `is_live` is set to `FALSE`.
        * `ended_at` is set to `NOW()`.
    * The data from `realtime_chunks` is processed and merged into a single entry in the `final_transcriptions` table.

---

## Transcriber Flow

The process for a transcriber to start and stream a lecture:

1.  **Transcriber Starts Lecture**
    * The transcriber selects the lecture (identified by `course_lectures.id`).
    * The backend creates a **new record** in the `active_sessions` table:
        * `lecture_id` (FK to `course_lectures`)
        * `transcriber_id` (FK to `profiles`)
        * `is_live` is set to `TRUE`
        * A unique `session_token` is generated.
        * `started_at` is set to `NOW()`.

2.  **WebRTC Setup**
    * The transcriber uses the newly created `session_token` to initialize and start the WebRTC stream.
    * Audio/video is broadcast to all joined students.

3.  **Real-time Transcription**
    * As the transcriber types or an auto-transcriber runs, transcription data is saved chunk-by-chunk.
    * Chunks are saved to the `realtime_chunks` table, associated with the **`session_id`** and a **`sequence_number`** to ensure order.

4.  **Multi-Transcriber Support**
    * Multiple transcribers **can join the same** `active_sessions` record, allowing for collaborative or backup transcription.
    * Each transcriber is identified by their unique `transcriber_id` but shares the same primary session and student stream.

5.  **Session Ends**
    * The `active_sessions` record is updated:
        * `is_live` is set to `FALSE`.
        * `ended_at` is set to `NOW()`.
    * The recorded transcription chunks are finalized and merged into the `final_transcriptions` table for permanent storage and student access.

---

## Database Table Connections

The flow relies on the following key connections:

| Table | Role in Flow |
| :--- | :--- |
| `profiles` | Identifies all users: **Students** and **Transcribers**. |
| `course_lectures` | The scheduled lecture; identified by a unique `join_code`. |
| `student_enrollments` | **Junction table**; confirms a student's eligibility to join a lecture. |
| **`active_sessions`** | **The central table** for the WebRTC session entry point, managing the live status and `session_token`. |
| `realtime_chunks` | Stores the **in-progress, unedited** transcription data in sequence. |
| `final_transcriptions` | Stores the **finalized, merged** full text of the transcription post-session. |

***Summary:** The **`active_sessions`** table is the core of the live experience, acting as the bridge for students to join live streams and for transcribers to broadcast and record transcription in real time.*

---

## DB Errors and Fixes:

### October 

##### Oct 08 2025 | Learned what the following error means and how to fix.

```sql

ERROR:  23503: insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
DETAIL:  Key (id)=(32ef8c67-f227-406d-bbc2-eae8c5049793) is not present in table "users"

```
fix: Make sure the user is created in the auth.users table first before trying to create a profile for them in the profiles table. 

## DB Developer Notes for SQL code later down the line

### Profiles Table

```SQL
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT,
    preferred_name TEXT,
    role TEXT CHECK(role IN ('client', 'transcriber', 'admin')),
    is_admin BOOLEAN DEFAULT FALSE,
    bio TEXT,
    auth_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ
);
```

### Student Enrollments
```SQL
CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY,
    student_id UUID REFERENCES profiles(id),
    course_lecture_id UUID REFERENCES course_lectures(id),
    joined_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Course Lectures
```SQL
CREATE TABLE course_lectures (
    id UUID PRIMARY KEY,
    course_name TEXT NOT NULL,
    lecture_date DATE NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Active Sessions

```SQL
CREATE TABLE active_sessions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    transcriber_id UUID REFERENCES profiles(id),
    is_live BOOLEAN DEFAULT TRUE,
    session_token UUID UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);
```

Note: active_sessions allows multiple transcribers (via different rows) to be associated with a single lecture_id, but the primary constraint is one active session per transcriber at a time for a given lecture.

### Realtime Chunks
```SQL
CREATE TABLE realtime_chunks (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES active_sessions(id),
    sequence_number INT NOT NULL,
    text_chunk TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
``` 
Optimization: Consider indexing session_id and sequence_number for faster live data retrieval and ordering.

### Final Transcriptions

```SQL
CREATE TABLE final_transcriptions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    raw_full_text TEXT NOT NULL,
    final_duration_minutes INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
```
### Course Lectures

```SQL
CREATE TABLE course_lectures (
    id UUID PRIMARY KEY,
    course_name TEXT NOT NULL,
    lecture_date DATE NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Active Sessions
```SQL
CREATE TABLE active_sessions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    transcriber_id UUID REFERENCES profiles(id),
    is_live BOOLEAN DEFAULT TRUE,
    session_token UUID UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);
```
Note: active_sessions allows multiple transcribers (via different rows) to be associated with a single lecture_id, but the primary constraint is one active session per transcriber at a time for a given lecture.

### Realtime Chunks
```SQL
CREATE TABLE realtime_chunks (
    id UUID PRIMARY KEY,
    session_id UUID REFERENCES active_sessions(id),
    sequence_number INT NOT NULL,
    text_chunk TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```
Optimization: Consider indexing session_id and sequence_number for faster live data retrieval and ordering.

### Final Transcriptions
```SQL
CREATE TABLE final_transcriptions (
    id UUID PRIMARY KEY,
    lecture_id UUID REFERENCES course_lectures(id),
    raw_full_text TEXT NOT NULL,
    final_duration_minutes INT NOT NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);