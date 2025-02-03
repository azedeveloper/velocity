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

    fetchPosts();
</script>

<div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md space-y-4">
        {#each posts as post}
            <div class="p-7 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950">
                <div class="author flex text-white items-center gap-2 mb-2">
                    <img class="w-9 rounded-full" src="https://cdn.discordapp.com/embed/avatars/0.png" alt="User Avatar">
                    <div>
                        <p class="text-lg">{post.username}</p>
                        <p class="text-xs text-gray-400">{formatTimestamp(post.created_at)}</p>
                    </div>
                </div>
                <p class="text-white">{post.content}</p>
            </div>
        {/each}
    </div>
</div>
