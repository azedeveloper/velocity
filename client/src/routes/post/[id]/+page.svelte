<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let postId = $page.params.id;
  let post = null;
  let replies = [];
  let replyContent = "";
  let liked = false;

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  async function fetchPostAndReplies() {
    try {
      let res = await fetch(`http://localhost:3000/posts/${postId}/replies`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      let data = await res.json();

      // put the postreplycount in data
      data[0].replyCount = await postRepliesCount(postId);

      post = data[0];
      post = { ...data[0], liked: data[0].liked };
      replies = data.slice(1);
      //add replyCount to replies
      for (let i = 0; i < replies.length; i++) {
        replies[i].replyCount = await postRepliesCount(replies[i].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function postRepliesCount(postId) {
    try {
      let res = await fetch(`http://localhost:3000/posts/${postId}/replies/count`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch post replies");
      let data = await res.json();
      console.log(data.count);
      return data.count;
    } catch (err) {
      console.error(err);
    }
  }

  function navigate(path) {
    window.location = path;
  }

  async function likePost(postId, isReply = false) {
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to like/unlike post");

      const data = await res.json();

      if (post && post.id === postId) {
        post = {
          ...post,
          liked: data.liked,
          likes: data.liked ? post.likes + 1 : post.likes - 1,
        };
      }

      if (isReply) {
        replies = replies.map((reply) =>
          reply.id === postId
            ? {
                ...reply,
                liked: data.liked,
                likes: data.liked ? reply.likes + 1 : reply.likes - 1,
              }
            : reply
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function replyToPost(content) {
    try {
      let res = await fetch(`http://localhost:3000/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content, parent_id: postId }),
      });

      if (!res.ok) throw new Error("Failed to reply");
      await fetchPostAndReplies();
    } catch (err) {
      console.error(err);
    }
  }

  onMount(fetchPostAndReplies);
</script>

<div class="h-screen items-center bg-neutral-950">
  <div
    class="p-7 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950 max-w-lg mx-auto my-auto justify-center align-middle self-center flex flex-col mt-10"
  >
  {#if post}
    <div class="author flex text-white items-center gap-2 mb-2">
      <img class="w-9 rounded-full" src={post.pfp} alt="User Avatar" />
      <div>
        <p class="text-lg">{post.username}</p>
        <p class="text-xs text-gray-400">{formatTimestamp(post.created_at)}</p>
      </div>
    </div>
    <p class="text-white">{post.content}</p>
    <div class="like flex align-middle gap-2 items-center mt-2">
      <i
        class="{post.liked
          ? 'fa-solid fa-heart text-pink-500'
          : 'fa-regular fa-heart text-gray-400'} text-xl cursor-pointer"
        on:click={() => likePost(post.id)}
      >
      </i>
      <p class="text-gray-400">{post.likes}</p>
    </div>

    <h3 class="text-gray-400 mt-2">{post.replyCount} Replies:</h3>
    <div class="reply flex gap-2 mt-2">
      <input
        type="text"
        bind:value={replyContent}
        placeholder="Reply..."
        class="w-full p-2 text-white bg-neutral-950 border-neutral-800 rounded"
      />
      <button
        class="px-4 py-2 bg-purple-600 text-white rounded"
        on:click={() => replyToPost(replyContent)}
      >
        Reply
      </button>
    </div>
    


    {#each replies as reply}
      <div class="p-4 bg-neutral-950 outline-1 mt-2">
        <div class="flex items-center gap-2">
          <img class="w-7 rounded-full" src={reply.pfp} alt="User Avatar" />
          <p class="text-white"><b>{reply.username}</b> <span class="text-gray-400">{formatTimestamp(post.created_at)}</span></p>
        </div>
        <p class="text-white mt-1">{reply.content}</p>


        <div class="like flex align-middle gap-4 items-center mt-1">
          <div class="like flex align-middle gap-2 items-center">
            <i
              class="{reply.liked
                ? 'fa-solid fa-heart text-pink-500'
                : 'fa-regular fa-heart text-gray-400'} text-xl cursor-pointer"
              on:click={() => likePost(reply.id, true)}
            >
            </i>
            <p class="text-gray-400">{reply.likes}</p>
          </div>
          <div class="like flex align-middle gap-2 items-center">
            <i
            class="fa-regular fa-comment text-gray-400 text-xl cursor-pointer"
            on:click={() => navigate(`/post/${reply.id}`)}
          ></i>
            <p class="text-gray-400">{reply.replyCount}</p>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
</div>
