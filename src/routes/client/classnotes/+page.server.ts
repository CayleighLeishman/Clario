// src/routes/client/classnotes/+page.server.ts

import { createSupabaseServer } from '$lib/utils/supabaseServer'; 
import type { PageServerLoad } from './$types'; 

// Server-side function to fetch data for the page
export const load: PageServerLoad = async (event) => { 

    // Create a Supabase client using the server request context
    const supabase = createSupabaseServer(event.cookies); 

    // Get currently authenticated user
    const { data: { user } } = await supabase.auth.getUser(); 
     // if no user is logged in return empty notes
    if (!user) return { notes: [] };

    // Fetch course this student is enrolled in
    const { data: enrollments } = await supabase 
        .from('student_enrollments')                    // Query the student_enrollments table
        .select('course_lecture_id')                   // Only get the lecture IDs
        .eq('student_id', user.id);                    // Filter by the logged-in student

    // Extract lecture IDs or empty array
    const lectureIds = enrollments?.map((e) => e.course_lecture_id) ?? []; 

    // Return empty notes if no lectures found
    if (lectureIds.length === 0) return { notes: [] }; 

    // Fetch lecture details and related transcriptions
    const { data: notesData } = await supabase 
        .from('course_lectures')                        // Query course_lectures table
        .select(`id, course_name, lecture_date, final_transcriptions(id, raw_full_text)`) // Select fields and related final_transcriptions
        .in('id', lectureIds)                          // Filter lectures by the enrolled IDs
        .order('lecture_date', { ascending: false }); // Order by lecture date descending

    // Map the results into our Note type
    const notes = (notesData ?? []).map((n) => ({ 
        id: n.id, // Course lecture ID
        final_transcription_id: n.final_transcriptions?.[0]?.id, // ID of the final transcription
        title: `${n.course_name} – ${new Date(n.lecture_date).toLocaleDateString()}`, // Default note title with course name and date
        content: n.final_transcriptions?.[0]?.raw_full_text ?? "" // Note content from transcription or empty string
    }));

    return { notes };                                   // Return the mapped notes to the page
};
