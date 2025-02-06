<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        try {
            const response = await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (response.ok) {
                window.location.href = "/login"; // Redirect to login page
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });
</script>
