<script>
    import { onMount } from "svelte";
    import PostList from "../components/PostList.svelte";

    function navigate(path) {
        window.location = path;
    }

</script>

<div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <PostList/>
</div>
