// src/routes/admin/[users]/+[ages.svelte]]
<script lang="ts">
    // --------------------------
    // IMPORTS
    // --------------------------
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import '$lib/styles/admin.css';

    // --------------------------
    // TYPES
    // --------------------------
    type Role = 'student' | 'transcriber' | 'admin';

    type User = {
        id: string;
        name: string;
        email: string;
        role: Role;
        created_at: string;
        status: string;
    };

    type Session = {
        userId: string;
        role: Role;
        email: string;
    };

    // --------------------------
    // DATA FROM SERVER
    // --------------------------
    // This tells TypeScript "the page gets a users list and maybe a session"
   export let data: { users: User[]; session: Session | null } = {
    users: [],
    session: null
};

    // --------------------------
    // USERS & SESSION
    // --------------------------
    let users: User[] = data.users ;// our list of users
    let session: Session | null = data.session; // logged-in user info
    let currentUserRole: Role = session?.role ?? 'student'; // default role if not logged in

    // --------------------------
    // FILTERING USERS
    // --------------------------
    // We can show all users, only students, or only transcribers
    let filter: 'all' | 'student' | 'transcriber' = 'all';
    function filteredUsers() {
        if (filter === 'all') return users;
        return users.filter(u => u.role === filter);
    }

    // --------------------------
    // JOIN SESSION INPUT
    // --------------------------
    let joinSessionCode = ''; // text input for joining a session

    // --------------------------
    // NEW USER INPUTS
    // --------------------------
    let newName = '';
    let newEmail = '';
    let newRole: 'student' | 'transcriber' = 'student';
    let newPassword = '';

    // --------------------------
    // HELPER FUNCTIONS
    // --------------------------

    // Remove a user from the system
    async function removeUser(id: string) {
        const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        if (result.success) {
            users = users.filter(u => u.id !== id); // update locally so the table refreshes
        } else {
            alert('Error removing user: ' + result.error);
        }
    }

    // Add a new user
    async function addUser(name: string, email: string, role: 'student' | 'transcriber', password: string) {
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, role, password })
        });
        const result = await res.json();
        if (result.success) {
            users = [...users, result.user]; // add to the list
            newName = '';
            newEmail = '';
            newPassword = '';
        } else {
            alert('Error adding user: ' + result.error);
        }
    }

    // Change a user's role
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

<!-- --------------------------
     PAGE HEADER
-------------------------- -->
<Header />

<div class="admin-container">
    <!-- --------------------------
         SIDEBAR
    -------------------------- -->
    <div class="sidebar">
        <div>Total Clients: {users.filter(u => u.role === 'student').length}</div>
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
            <select bind:value={newRole}>
                <option value="student">Client</option>
                <option value="transcriber">Transcriber</option>
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
            <button on:click={() => filter = 'student'}>Clients</button>
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
                        <td>{user.role}</td>
                        <td>{user.created_at}</td>
                        <td>{user.status}</td>
                        <td>
                            <button on:click={() => removeUser(user.id)}>Remove</button>

                            <!-- Only show role change buttons if logged-in user is admin -->
                            {#if currentUserRole === 'admin'}
                                <button
                                    on:click={() =>
                                        updateUserRole(
                                            user.id,
                                            user.role === 'student' ? 'transcriber' : 'student'
                                        )
                                    }
                                >
                                    {user.role === 'student' ? 'Make Transcriber' : 'Make Client'}
                                </button>
                            {/if}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<!-- --------------------------
     PAGE FOOTER
-------------------------- -->
<Footer />
