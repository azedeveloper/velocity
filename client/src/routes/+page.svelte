<script>
    import PostList from "../components/PostList.svelte";
    import CreatePost from "../components/CreatePost.svelte";
    import Me from "../components/Me.svelte";
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-neutral-950">
    <Me/>
    <CreatePost/>
    <PostList/>
</div>
