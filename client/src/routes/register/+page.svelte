<script>
    let email = '';
    let username = '';
    let password = '';

    let error = false;
    let errorMsg = '';
  
      const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "/login"; 
        } else {
            error = true;
            errorMsg = data.error;
        }
    } catch (error) {
        error = true;
        errorMsg = error;
    }
};
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md p-12 rounded-lg shadow-md outline-neutral-800 outline outline-1">
      <h1 class="text-2xl font-semibold text-white mb-6 text-center">Register</h1>
      <form class="space-y-4" on:submit={handleSubmit}>
        <div>
            <label for="email" class="block text-sm font-medium text-white">Email</label>
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 bg-neutral-950 text-white"
            />
          </div>
        <div>
          <label for="username" class="block text-sm font-medium text-white">Username</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            required
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 bg-neutral-950 text-white"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-rose-500 focus:border-rose-500 bg-neutral-950 text-white"
          />
        {#if error}
        <p class="text-red-500 text-center mt-3">{errorMsg}</p>
        {/if} 
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-rose-500 hover:bg-rose-700 rounded-lg shadow-md focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        >
          Register
        </button>
      </form>
      <p class="mt-4 text-sm text-center text-gray-300">
        Already have an account? <a href="/login" class="text-rose-500 hover:underline">Sign in</a>
      </p>
    </div>
  </div>
  