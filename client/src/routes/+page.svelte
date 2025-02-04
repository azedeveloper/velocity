<script>
    import { onMount } from "svelte";
    let posts = [];

    async function fetchPosts() {
        try {
            const res = await fetch("http://localhost:3000/posts", {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("velocity_token")}`,
                }
            });
            if (!res.ok) throw new Error("Failed to fetch posts");
            posts = await res.json();
        } catch (err) {
            console.error(err);
        }
    }

    async function likePost(postId, liked) {
        try {
            const res = await fetch(`http://localhost:3000/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("velocity_token")}`
                }
            });

            if (!res.ok) throw new Error("Failed to like/unlike post");

            // Update the post in the local state
            posts = posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        liked: !liked, 
                        likes: liked ? post.likes - 1 : post.likes + 1 
                    };
                }
                return post;
            });
        } catch (err) {
            console.error(err);
        }
    }

    function navigate(path) {
        window.location = path;
    }

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

    onMount(fetchPosts);
</script>

<div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md space-y-4">
        {#each posts as post}
            <div class="p-7 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950">
                <div class="author flex text-white items-center gap-2 cursor-pointer mb-2" on:click={() => navigate(`/@${post.username}`)}>
                    <img class="w-9 rounded-full" src="{post.pfp}" alt="User Avatar">
                    <div>
                        <p class="text-lg">{post.username}</p>
                        <p class="text-xs text-gray-400">{formatTimestamp(post.created_at)}</p>
                    </div>
                </div>
                <p class="text-white">{post.content}</p>
                <div class="like flex mt-4 align-middle gap-2 items-center">
                    <i 
                        class="{post.liked ? 'fa-solid fa-heart text-pink-500' : 'fa-regular fa-heart text-gray-400'} text-xl cursor-pointer"
                        on:click={() => likePost(post.id, post.liked)}>
                    </i>
                    <p class="text-gray-400">{post.likes}</p>
                </div>
            </div>
        {/each}
    </div>
</div>
