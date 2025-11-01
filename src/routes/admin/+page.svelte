<script lang="ts">
  // --------------------------
  // IMPORTS
  // --------------------------
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '$lib/styles/admin.css';
  import { page } from '$app/stores';

  // --------------------------
  // SESSION (WHO IS LOGGED IN)
  // --------------------------
  let session = $page.data.session ?? null;

  // --------------------------
  // TYPES (WHAT KINDS OF DATA WE HAVE)
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

  // --------------------------
  // DATA FROM SERVER
  // --------------------------
  export let data: { users: User[] };
  let users: User[] = data.users || [];

  // --------------------------
  // FILTER USERS (SHOW ONLY CERTAIN ROLES)
  // --------------------------
  let filter: 'all' | 'student' | 'transcriber' = 'all';

  function filteredUsers() {
    if (filter === 'all') return users;
    return users.filter((u) => u.role === filter);
  }

  // --------------------------
  // JOIN SESSION INPUT
  // --------------------------
  let joinSessionCode = '';

  // --------------------------
  // NEW USER INPUTS
  // --------------------------
  let newName = '';
  let newEmail = '';
  // Include 'admin' here but restrict in UI if current user isn't admin
  let newRole: Role = 'student';
  let newPassword = '';

  // --------------------------
  // HELPER FUNCTIONS
  // --------------------------

  async function removeUser(id: string) {
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const result = await res.json();
    if (result.success) {
      users = users.filter((u) => u.id !== id);
    } else {
      alert('Error removing user: ' + result.error);
    }
  }

  async function addUser(name: string, email: string, role: Role, password: string) {
    // Non-admins cannot add admins
    if (role === 'admin' && currentUserRole !== 'admin') {
      alert("Only admins can create another admin!");
      return;
    }

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password })
    });
    const result = await res.json();
    if (result.success) {
      users = [...users, result.user];
      newName = '';
      newEmail = '';
      newPassword = '';
      newRole = 'student'; // reset role
    } else {
      alert('Error adding user: ' + result.error);
    }
  }

  async function updateUserRole(currentUserRole: Role, targetId: string, newRole: Role) {
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
      users = users.map((u) => (u.id === targetId ? { ...u, role: newRole } : u));
    } else {
      alert('Error updating role: ' + result.error);
    }
  }

  // Pretend the logged-in user is admin for now
  let currentUserRole: Role = 'admin';
</script>

<Header />

<div class="admin-container">
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

    <div style="margin-top:2rem;">
      <h4>Add New User</h4>
      <input type="text" placeholder="Name" bind:value={newName} />
      <input type="email" placeholder="Email" bind:value={newEmail} />

      <select bind:value={newRole}>
        <option value="student">Client</option>
        <option value="transcriber">Transcriber</option>
        {#if currentUserRole === 'admin'}
          <option value="admin">Admin</option>
        {/if}
      </select>

      <input type="password" placeholder="Password" bind:value={newPassword} />
      <button on:click={() => addUser(newName, newEmail, newRole, newPassword)}>Add User</button>
    </div>
  </div>

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

              <!-- Only show role change button if current user is admin -->
              {#if currentUserRole === 'admin'}
                <button
                  on:click={() =>
                    updateUserRole(
                      currentUserRole,
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

<Footer />
