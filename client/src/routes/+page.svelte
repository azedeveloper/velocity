<script>
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

    fetchPosts();
</script>

<div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md space-y-4">
        {#each posts as post}
            <div class="p-7 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950">
                <div class="author flex text-white items-center gap-2 mb-2">
                    <img class="w-8 rounded-full" src="https://cdn.discordapp.com/embed/avatars/0.png" alt="User Avatar">
                    <p class="text-lg">{post.username}</p>
                </div>
                <p class="text-white">{post.content}</p>
            </div>
        {/each}
    </div>
</div>
