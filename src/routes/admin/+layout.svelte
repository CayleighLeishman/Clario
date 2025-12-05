<script lang="ts">

  import '$lib/styles/admin.css';
  import type { LayoutData } from './$types';

  export let data: LayoutData;   
  let session = data.session;  
</script>

<div class="admin-container">
  <slot />
</div>


