<!-- src/routes/(public)/register/+page.svelte -->

<script lang="ts">
	import { supabaseUser } from '$lib/utils/supabaseUser';
	import { goto } from '$app/navigation';

	let first_name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let role: 'client' | 'transcriber' = 'client';

	let errorMessage = '';
	let successMessage = '';

	async function handleSignup() {
		errorMessage = '';
		successMessage = '';

		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		// 1) Create Supabase user with role stored in metadata
		const { data, error } = await supabaseUser.auth.signUp({
			email,
			password,
			options: {
				data: { role } // stored in user_metadata.role
			}
		});

		if (error) {
			errorMessage = error.message;
			return;
		}

		// If sign-up succeeded, create profile in DB
		if (data.user) {
			const { error: profileError } = await supabaseUser
				.from('profiles')
				.insert({
					id: data.user.id,
					first_name,
					role
				});

			if (profileError) {
				errorMessage = 'Account created, but profile failed to save.';
				console.error(profileError);
				return;
			}
		}

		successMessage = 'Account created! Please check your email to confirm.';
		setTimeout(() => goto('/login'), 2500);
	}
</script>

<div class="signup-container">
	<h1>Create a Clario Account</h1>
	<p class="subtitle">Sign up to get started.</p>

	<form on:submit|preventDefault={handleSignup} class="signup-form">
		<label>
			First Name
			<input type="text" bind:value={first_name} required placeholder="Your name" />
		</label>

		<label>
			Email
			<input type="email" bind:value={email} required placeholder="your-email@domain.com" />
		</label>

		<label>
			Password
			<input type="password" bind:value={password} required />
		</label>

		<label>
			Confirm Password
			<input type="password" bind:value={confirmPassword} required />
		</label>

		<label>
			Role
			<select bind:value={role}>
				<option value="client">Client</option>
				<option value="transcriber">Transcriber</option>
			</select>
		</label>

		<button type="submit" class="signup-btn">Sign Up</button>

		{#if errorMessage}
			<p class="error">{errorMessage}</p>
		{/if}
		{#if successMessage}
			<p class="success">{successMessage}</p>
		{/if}
	</form>

	<p class="redirect">
		Already have an account?
		<a class="btn" href="/login">Log in</a>
	</p>
</div>
