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

<div class="w-full max-w-md space-y-4 mt-5">
    <div class="flex items-center p-2 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950 text-white align-middle gap-2 cursor-pointer" onclick={() => window.location = `/@${user.username}`}>
        {#if user.pfp}
            <img src="{user.pfp}" alt="User Profile Picture" class="w-10 h-10 rounded-full"/>
        {/if}
        <h1 class="text-lg">@{user.username}</h1>
    </div>
</div>
