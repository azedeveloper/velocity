<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import PostList from "../../components/PostList.svelte";

  let user = null;
  let error = null;
  let username = null;

  onMount(async () => {
    username = $page.params.username;
    try {
      const res = await fetch(`http://localhost:3000/users/${username}`);
      if (!res.ok) throw new Error("User not found");

      user = await res.json();
    } catch (err) {
      error = err.message;
    }
  });
</script>

{#if error}
  <p class="text-red-500">Error: {error}</p>
{:else if user}
  <div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md space-y-4">
      <div class="profile text-white text-center mt-10">
        <img src="{user.pfp}" alt="User Avatar" class="w-24 mx-auto rounded-full"/>
        <h1 class="text-2xl font-bold mt-2">{user.username}</h1>
        <p class="text-base">{user.about}</p>
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
