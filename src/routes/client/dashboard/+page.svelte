<!-- What it shows in browser: Client dashboard -->

<script lang="ts">
    import { page } from '$app/stores';

    // Get session from the parent layout
    let session: any;
    $: session = $page.data.session;
</script>

<h1>Client Dashboard</h1>

{#if session}
    <p>Welcome, <strong>{session.user.email}</strong>!</p>
    <!-- You can add dashboard content here -->
    <ul>
        <li><a href="/client/classnotes">Class Notes</a></li>
        <li>Upcoming Tasks</li>
        <li>Recent Activity</li>
    </ul>
{:else}
    <p>You are not logged in. Please <a href="/login">sign in</a>.</p>
{/if}
