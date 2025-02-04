<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  let user = null;
  let error = null;

  onMount(async () => {
    const username = $page.params.username; // Get dynamic param from URL
    console.log(username);
    await fetchPosts();
    try {
      const res = await fetch(`http://localhost:3000/users/${username}`);
      if (!res.ok) throw new Error("User not found");

      user = await res.json();
    } catch (err) {
      error = err.message;
    }
  });

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  let posts = [];

  async function fetchPosts() {
    try {
      const res = await fetch("http://localhost:3000/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      posts = await res.json();
    } catch (err) {
      console.error(err);
    }
  }
</script>

{#if error}
  <p class="text-red-500">Error: {error}</p>
{:else if user}
<div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md space-y-4">
      <div class="profile text-white text-center align-middle content-center">
        <img 
          src="{user.pfp}"
          alt="" 
          class="w-24 mx-auto rounded-full"
        />
        <h1 class="text-2xl font-bold mt-2">{user.username}</h1>
        <p class="text-base">{user.about}</p>
      </div>
      <div class="posts space-y-4">
        <h2 class="text-white text-xl text-center">Posts:</h2>
        {#each posts as post}
          <div
            class="p-7 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950"
          >
            <div class="author flex text-white items-center gap-2 mb-2">
              <img
                class="w-9 rounded-full"
                src="{post.pfp}"
                alt="User Avatar"
              />
              <div>
                <p class="text-lg">{post.username}</p>
                <p class="text-xs text-gray-400">
                  {formatTimestamp(post.created_at)}
                </p>
              </div>
            </div>
            <p class="text-white">{post.content}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <p class="text-gray-400">Loading...</p>
{/if}
