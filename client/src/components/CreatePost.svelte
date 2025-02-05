<script>
    import { createEventDispatcher } from 'svelte';
    let content = '';
    const dispatch = createEventDispatcher();

    function handleSubmit() {
    if (content.trim() === '') return;
    const postData = { content };
    dispatch('submit', postData);

    fetch('http://localhost:3000/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        content = ''; // Clear only after successful submission
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

</script>

<div class="w-full max-w-lg space-y-4 mb-5 mt-2">
    <div class="flex items-center p-2 rounded-lg shadow-md outline-neutral-800 outline outline-1 bg-neutral-950">
        <textarea 
            id="content" 
            bind:value={content} 
            placeholder="What's happening?"
            class="w-full resize-none outline-none text-lg bg-transparent p-2 text-white border-none rounded-lg h-fit "
        ></textarea>
        <button on:click={handleSubmit} 
            class="bg-purple-700 w-10 h-10 flex items-center justify-center text-center text-2xl p-2 ml-3 rounded-full text-white">
            +
        </button>
    </div>
</div>
