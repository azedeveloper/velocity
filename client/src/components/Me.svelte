<script>
    import { onMount } from 'svelte';

    let user = {}; // This needs to be updated reactively

    onMount(async () => {
        try {
            const response = await fetch('http://localhost:3000/auth/me', {
                credentials: 'include', // Ensures cookies are sent with the request
            });

            if (!response.ok) throw new Error('Failed to fetch auth data');

            let currentUser = await response.json();
            console.log(currentUser);

            const userResponse = await fetch(`http://localhost:3000/users/${currentUser.user.username}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user data');

            user = await userResponse.json(); // This does NOT trigger a UI update

            // Instead, reassign the object:
            user = { ...user };
        } catch (error) {
            console.error('Failed to fetch user', error);
        }
    });
</script>

<div class="w-full max-w-lg space-y-4 mt-4">
    <div class="flex items-center p-2 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950 text-white align-middle gap-2">
        {#if user.pfp}
            <img src="{user.pfp}" alt="User Profile Picture" class="w-10 h-10 rounded-full cursor-pointer" onclick={() => window.location = `/@${user.username}`}/>
        {/if}
        {#if user.username}
            <h1 class="text-lg cursor-pointer" onclick={() => window.location = `/@${user.username}`}>@{user.username}</h1>
        {:else}
            <h1 class="text-sm">Please <a href="/login" class="text-purple-600">Login</a> or <a href="/register" class="text-purple-600">Register</a> to use Velocity.</h1>
        {/if}
    </div>
</div>
