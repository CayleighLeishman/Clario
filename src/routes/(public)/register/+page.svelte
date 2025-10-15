<!-- Registration Page for Clario -->

<script lang="ts">
	// Import Supabase client and navigation helper from SvelteKit
	import { supabaseUser } from '$lib/supabaseUser';
	import { goto } from '$app/navigation';

    // These Start 'empty' because we don’t know what the user will type yet. 
    // We define it now so the computer can use it later without having to write it again.	let email = '';
	let email: string = '';
    let password = '';
	let confirmPassword = '';

	// Default is 'client' unless the user selects otherwise
	let role: 'client' | 'transcriber' = 'client';

	// Feedback messages for user
	let errorMessage = '';
	let successMessage = '';

	// Function to handle signup process
	async function handleSignup() {
		// Reset any previous messages
		errorMessage = '';
		successMessage = '';

		// Check if passwords match before continuing
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		// Create a new user in Supabase and store their role in user_metadata
		const { data, error } = await supabaseUser.auth.signUp({
			email,  
			password,
			options: {
				data: { role } // This stores the user's role in Supabase under user_metadata.role that supabase controls
			}
		});

		// If Supabase returns an error, show it to the user
		if (error) {
			errorMessage = error.message;
			return;
		}

		// On success, show message and redirect to login page after a delay
		successMessage = 'Account created! Please check your email to confirm.';
		setTimeout(() => goto('/login'), 3000);
	}
</script>

<!-- Registration Form  -->
<div class="signup-container">
	<h1>Create a Clario Account</h1>
	<p class="subtitle">Sign up to get started.</p>

	<form on:submit|preventDefault={handleSignup} class="signup-form">
		<!-- Put in Email -->
		<label>
			Email
			<input type="email" bind:value={email} required placeholder="your-email@domain.com" />
		</label>

		<!-- Put in Password -->
		<label>
			Password
			<input type="password" bind:value={password} required placeholder="••••••••" />
		</label>

		<!-- Confirms the password -->
		<label>
			Confirm Password
			<input type="password" bind:value={confirmPassword} required placeholder="••••••••" />
		</label>

		<!-- Asks for their roles (client or transcriber) -->
		<label>
			Role
			<select bind:value={role}>
				<option value="client">Client</option>
				<option value="transcriber">Transcriber</option>
			</select>
		</label>

		<!-- Submit button to give database information it needs -->
		<button type="submit" class="signup-btn">Sign Up</button>

		<!-- this tells them if there's an error give an error message, if success give sucess message -->
		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}
	</form>

	<!-- allows people to redirect if they click the wrong option -->
	<p class="redirect">
		Already have an account?
		<a href="/login">Log in</a>
	</p>
</div>
