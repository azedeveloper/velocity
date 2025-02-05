<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import PostList from "../../components/PostList.svelte";

  let user = null;
  let error = null;
  let username = null;
  let currentUser = null;
  let ownProfile = false;
  let newPfp = "";
  let newAbout = "";
  let editing = false;

  async function updateProfile(field, value) {
  try {
    const res = await fetch(`http://localhost:3000/auth/me/${field}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });

    if (!res.ok) throw new Error("Update failed");

    // Re-fetch user data to ensure consistency
    const updatedUserRes = await fetch(`http://localhost:3000/users/${username}`);
    if (!updatedUserRes.ok) throw new Error("Failed to refresh user data");

    user = await updatedUserRes.json();
    newPfp = user.pfp;
    newAbout = user.about;
  } catch (err) {
    error = err.message;
  }
}


  onMount(async () => {
    username = $page.params.username;
    try {
      const res = await fetch(`http://localhost:3000/users/${username}`);
      if (!res.ok) throw new Error("User not found");
      user = await res.json();

      const meRes = await fetch("http://localhost:3000/auth/me", {
        credentials: "include",
      });
      currentUser = await meRes.json();

      if(!currentUser.error) {
        if (currentUser.user.username === username) {
          ownProfile = true;
          newPfp = user.pfp;
          newAbout = user.about;
        }
      }
    } catch (err) {
      error = err.message;
    }
  });
</script>

{#if error}
  <p class="text-red-500">Error: {error}</p>
{:else if user}
  <div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-lg space-y-4">
      <div class="profile text-white text-center mt-10">
        {#if ownProfile}
          <button on:click={() => editing = !editing} class="mb-4 bg-purple-600 text-white px-4 py-2 rounded">{editing ? "Back" : "Edit Profile"}</button>
        {/if}

        {#if editing}
          <input type="text" bind:value={newPfp} class="text-white p-1 rounded w-full bg-transparent" />
          <button on:click={() => updateProfile("pfp", newPfp)} class="mt-2 bg-purple-600 text-white px-4 py-2 rounded mb-5">Update Avatar</button>
          
          <textarea bind:value={newAbout} class="text-white p-1 rounded w-full bg-transparent"></textarea>
          <button on:click={() => updateProfile("about", newAbout)} class="mt-2 bg-purple-600 text-white px-4 py-2 rounded">Update About</button>
        {:else}
          <img src="{user.pfp}" alt="User Avatar" class="w-24 mx-auto rounded-full"/>
          <h1 class="text-2xl font-bold mt-2">{user.username}</h1>
          <p class="text-base">{user.about}</p>
        {/if}
      </div>
      
      <div class="posts space-y-4">
        <h2 class="text-white text-xl text-center"><b>Posts:</b></h2>
        <PostList {username} />
      </div>
    </div>
  </div>
{:else}
  <p class="text-gray-400">Loading...</p>
{/if}
