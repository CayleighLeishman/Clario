<!-- sample code -->
 
<script lang="ts">
  let users = [
    { name: 'John', email: 'john@example.com', role: 'student', created: '10/03/25', status: 'active' },
    { name: 'Jane', email: 'jane@example.com', role: 'student', created: '10/03/25', status: 'active' },
    { name: 'Steve', email: 'steve@example.com', role: 'transcriber', created: '10/03/25', status: 'active' },
    { name: 'Stan', email: 'stan@example.com', role: 'transcriber', created: '10/03/25', status: 'active' },
    { name: 'Will', email: 'will@example.com', role: 'transcriber', created: '10/05/25', status: 'active' }
  ];

  let filter = 'all';
  let joinSessionCode = '';

  function filteredUsers() {
    if (filter === 'all') return users;
    return users.filter(u => u.role === filter);
  }

  function removeUser(index: number) {
    users.splice(index, 1);
  }
</script>

<header>
  <div class="logo">Logo</div>
  <button>Sign Out</button>
</header>

<div class="admin-container">
  <div class="sidebar">
    <div>Total Clients: {users.filter(u => u.role === 'student').length}</div>
    <div>Total Transcribers: {users.filter(u => u.role === 'transcriber').length}</div>
    <div>Active Sessions: 1</div>

    <div style="margin-top:1rem;">
      <label>Join Session:</label>
      <input type="text" bind:value={joinSessionCode} placeholder="Enter session code" />
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
        {#each filteredUsers() as user, i}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.created}</td>
            <td>{user.status}</td>
            <td>
              <button on:click={() => removeUser(i)}>Remove</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<footer>
  Footer
</footer>
