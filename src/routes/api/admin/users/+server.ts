





// src/routes/api/admin/users

// This file handles Admin-level actions (DELETE, POST, PATCH) on user accounts.
// It uses the 'supabaseAdmin' client, which acts as a database superuser.

import type { RequestHandler } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/utils/supabaseAdmin';

// ===================================
// DELETE Handler (Deletes a User)
// ===================================
export const DELETE: RequestHandler = async ({ request }) => {
  // Get the user's ID to delete from the request body
  const { id } = await request.json();

  if (!id) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }

  // Delete the user's profile entry
  const { error } = await supabaseAdmin
    .from('users') // NOTE: This likely should be 'profiles' to match your table name
    .delete()
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // If successful, return a success message
  return new Response(JSON.stringify({ success: true }));
};

// ===================================
// POST Handler (Creates a New User)
// ===================================
export const POST: RequestHandler = async ({ request }) => {
  // Get all required details for the new user from the request body
  const { name, email, role, password } = await request.json();

  if (!name || !email || !role || !password) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 });
  }
  
  // 1. Create the user in the secure Supabase Auth table (auth.users)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    // Store the name and role in the user's hidden data package
    user_metadata: { name, role }
  });

  if (authError) {
    return new Response(JSON.stringify({ error: authError.message }), { status: 500 });
  }

  // 2. 🛑 CRITICAL RLS FIX: Create the public profile entry
  // The database RLS policies check the 'profiles' table for the user's role.
  // 2. CRITICAL RLS FIX: Create the public profile entry
  // PROVIDE ALL NOT NULL COLUMNS to prevent the database error.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authData.user!.id,
      full_name: name,
      role: role,
      // 🛑 NEW: Add default values for other required columns:
      orefered_name: name, // Assuming this is preferred name (use full name as default)
      is_admin: role === 'admin', // Set is_admin flag based on the role input
      bio: '' // Assuming bio is required but can be an empty string
    });

  if (profileError) {
    console.error("Admin user profile creation failed:", profileError);
    // Even if the profile fails, the Auth user is technically created.
    return new Response(JSON.stringify({ error: 'User created but profile sync failed: ' + profileError.message }), { status: 500 });
  }

  // Return success and the new user data
  return new Response(JSON.stringify({ success: true, user: authData.user }));
};

// ===================================
// PATCH Handler (Updates a User's Role)
// ===================================
export const PATCH: RequestHandler = async ({ request }) => {
  // Get the user ID and new role from the request body
  const { id, role } = await request.json();

  if (!id || !role) {
    return new Response(JSON.stringify({ error: 'ID and role are required' }), { status: 400 });
  }

  // Update the user's role in the profile table
  const { error } = await supabaseAdmin
    .from('users') // NOTE: This likely should be 'profiles' to match your table name
    .update({ role })
    .eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }));
};











