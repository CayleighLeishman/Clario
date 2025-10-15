<script lang="ts">

    // === SVELTEKIT CORE TOOLS ===

    // goto is for changing pages.
    import { goto } from '$app/navigation';

    // browser tells us if the code is running in the user's web browser (true) or on the server (false).
    import { browser } from '$app/environment'; 

    // === LOCAL COMPONENTS & UTILITIES ===
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import logo from '$lib/assets/favicon.svg'; 

    // === SUPABASE LOGIC ===

    import { supabaseUser } from '$lib/supabaseUser';

    import type { Session } from '@supabase/supabase-js';

    // DO NOT import Settings here statically. We will load it later dynamically


    // === STATE MANAGEMENT ===
    // This holds the reference to the Settings component once it's loaded in the browser.
    let Settings: any; 

    // Controls if the Settings modal is visible.
    let showSettings = false; 

    // The user's session is passed in from the layout file.
    export let session: Session | null;



    // === FUNCTIONS ===

    // Logs the user out.
    async function signOut() {
        console.log('signign out User');
        // tells supabase to log out user
        await supabaseUser.auth.signOut();

        goto('/login'); 

    }

    // Dynamically loads the Settings component ONLY when the button is clicked.
    // (This prevents the SSR crash.)

    async function openSettings() {
        if (!Settings) {
            // Imports the component now, ONLY in the browser.
            const module = await import('$lib/components/Settings.svelte');
            Settings = module.default;
        }

        showSettings = true;
    }

</script>



<header class="app-header">
    <!-- Left: Logo linked to home or dashboard -->
    <a href={session ? "/client/dashboard" : "/"} class="logo-link">
        <img src={logo} alt="Clario Logo" class="logo" />
    </a>



    <!-- Center of header: Platform name-->
    <h1 class="title">Clario</h1>


    <!-- Right of Header: Role-based navigation links and utilities -->
    <nav class="nav-links">

            <!-- === ROLE-BASED LINKS (Client, Admin, Transcriber) === -->

            <!-- if client -->
        {#if session?.user?.app_metadata?.role === 'client'}
			<a href="/client/classnotes">Class Notes</a>
            <a href="/client/sessions">All Sessions</a>
			<a href= /client/dashboard>Dashboard</a>

            <!-- if admin -->
        {:else if session?.user?.app_metadata?.role === 'admin'}
            <a href="/admin/dashboard">Dashboard</a>
            <!-- HERE IS THE 'MANAGE USERS' LINK -->
            <a href="/admin/users">Manage Users</a> 

            <!-- if transcriber -->
        {:else if session?.user?.app_metadata?.role === 'transcriber'}
            <a href="/transcriber/tasks">My Tasks</a>
            <a href="/transcriber/history">History</a>
			<a href="/transcriber/dashboard">Dashboard</a>

        {/if}



        <!-- === LOGIN / LOGOUT LINKS === -->

        {#if session}
            <button on:click={signOut} class="signout-btn">Sign Out</button>
        {:else}
            <a href="/login">Login</a>
            <a href="/signup">Sign Up</a>
        {/if}



        <!-- === UTILITY BUTTONS === -->

        <!-- Calls the function that handles dynamic loading -->
        <button on:click={openSettings}>Settings</button> 
        <ThemeToggle />

        <!-- === DYNAMIC SETTINGS MODAL === -->

        <!-- Renders ONLY if 'showSettings' is true AND we are in the browser -->
        {#if showSettings && browser} 
            <!-- Uses the dynamically loaded component reference -->
            <svelte:component this={Settings} on:close={() => showSettings = false} />
        {/if}
    </nav>

</header>

