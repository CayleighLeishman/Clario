<!-- src/routes/admin/[users]/+page.svelte -->
<script lang="ts">
    // --------------------------
    // IMPORTS
    // --------------------------

    import '$lib/styles/admin.css';
    import type { Session } from '@supabase/supabase-js';

    // --------------------------
    // TYPES
    // --------------------------
    type Role = 'client' | 'transcriber' | 'admin';

    type User = {
        id: string;
        name: string;
        email: string;
        role: Role;
        created_at: string;
        status: string;
    };

    // --------------------------
    // DATA FROM SERVER
    // --------------------------
    export let data: { users: User[]; session: Session | null } = {
        users: [],
        session: null
    };

    // --------------------------
    // USERS & SESSION
    // --------------------------
    let users: User[] = data.users; // list of users
    let session: Session | null = data.session; // logged-in user info

    // Stop execution if current user has no role (prevent accidental admin rights)
    if (!session?.user.user_metadata.role) {
        throw new Error('User role not set — access denied');
    }
    let currentUserRole: Role = session.user.user_metadata.role as Role;

    // --------------------------
    // FILTERING USERS
    // --------------------------
    let filter: 'all' | 'client' | 'transcriber' = 'all';
    function filteredUsers() {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }

    // --------------------------
    // JOIN SESSION INPUT
    // --------------------------
    let joinSessionCode = ''; // input for joining a session

    // --------------------------
    // NEW USER INPUTS
    // --------------------------
    let newName = '';
    let newEmail = '';
    let newRole: 'client' | 'transcriber' = 'client';
    let newPassword = '';

    // --------------------------
    // HELPER FUNCTIONS
    // --------------------------

    // Remove a user
    async function removeUser(id: string) {
        const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) {
            users = users.filter(u => u.id !== id); // update locally
        } else {
            alert('Error removing user: ' + result.error);
        }
    }

    // Add a new user
    async function addUser(name: string, email: string, role: 'client' | 'transcriber' | 'admin', password: string) {
        // Only admins can create another admin
        if (role === 'admin' && currentUserRole !== 'admin') {
            alert("Only admins can create another admin!");
            return;
        }

        // Ensure role is valid
        if (!['client', 'transcriber', 'admin'].includes(role)) {
            alert("Invalid role selected");
            return;
        }

        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role, password })
        });
        const result = await res.json();
        if (result.success) {
            users = [...users, result.user]; // update table
            newName = '';
            newEmail = '';
            newPassword = '';
            newRole = 'client'; // reset default
        } else {
            alert('Error adding user: ' + result.error);
        }
    }

    // Update a user's role
    async function updateUserRole(targetId: string, newRole: Role) {
        // Only admins can make someone an admin
        if (newRole === 'admin' && currentUserRole !== 'admin') {
            alert("Only admins can make someone an admin!");
            return;
        }

        const res = await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: targetId, role: newRole })
        });
        const result = await res.json();
        if (result.success) {
            users = users.map(u => (u.id === targetId ? { ...u, role: newRole } : u));
        } else {
            alert('Error updating role: ' + result.error);
        }
    }
</script>

<div class="admin-container">
    <!-- --------------------------
         SIDEBAR
    -------------------------- -->
    <div class="sidebar">
        <div>Total Clients: {users.filter(u => u.role === 'client').length}</div>
        <div>Total Transcribers: {users.filter(u => u.role === 'transcriber').length}</div>
        <div>Active Sessions: 1</div>

        <div style="margin-top:1rem;">
            <label>
                Join Session:
                <input type="text" bind:value={joinSessionCode} placeholder="Enter session code" />
            </label>
        </div>

        <!-- --------------------------
             ADD NEW USER
        -------------------------- -->
        <div style="margin-top:2rem;">
            <h4>Add New User</h4>
            <input type="text" placeholder="Name" bind:value={newName} />
            <input type="email" placeholder="Email" bind:value={newEmail} />

            <!-- Role selector: show admin only if current user is admin -->
            <select bind:value={newRole}>
                <option value="client">Client</option>
                <option value="transcriber">Transcriber</option>
                {#if currentUserRole === 'admin'}
                    <option value="admin">Admin</option>
                {/if}
            </select>

            <input type="password" placeholder="Password" bind:value={newPassword} />
            <button on:click={() => addUser(newName, newEmail, newRole, newPassword)}>Add User</button>
        </div>
    </div>

    <!-- --------------------------
         MAIN TABLE
    -------------------------- -->
    <div class="main">
        <div>
            <button on:click={() => filter = 'client'}>Clients</button>
            <button on:click={() => filter = 'transcriber'}>Transcribers</button>
            <button on:click={() => filter = 'all'}>All Users</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {#each filteredUsers() as user}
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            {#if currentUserRole === 'admin'}
                                <!-- Admins can change roles via dropdown -->
                                <select
                                    value={user.role}
                                    on:change={(e) => {
                                        const select = e.target as HTMLSelectElement | null;
                                        if (!select) return;
                                        updateUserRole(user.id, select.value as Role);
                                    }}
                                >
                                    <option value="client">Client</option>
                                    <option value="transcriber">Transcriber</option>
                                    <option value="admin">Admin</option>
                                </select>
                            {:else}
                                <!-- Non-admins just see role -->
                                {user.role}
                            {/if}
                        </td>
                        <td>{user.created_at}</td>
                        <td>{user.status}</td>
                        <td>
                            <button on:click={() => removeUser(user.id)}>Remove</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

