<script>
    let username = '';
    let password = '';
  
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password }),
            credentials: "include"  // Ensures cookies are sent with the request
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = "/"; // Redirect to home
        } else {
            console.error("Login failed:", data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-neutral-950">
    <div class="w-full max-w-md p-12 rounded-lg shadow-md outline-neutral-800 outline outline-1">
      <h1 class="text-2xl font-semibold text-white mb-6 text-center">Login</h1>
      <form class="space-y-4" on:submit={handleSubmit}>
        <div>
          <label for="email" class="block text-sm font-medium text-white">Username</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            required
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-purple-600 focus:ring-purple-600 bg-neutral-950 text-white"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-purple-600 focus:ring-purple-600 bg-neutral-950 text-white"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 duration-300"
        >
          Log In
        </button>
      </form>
      <p class="mt-4 text-sm text-center text-gray-300">
        Don't have an account? <a href="/register" class="text-purple-600 hover:underline">Sign up</a>
      </p>
    </div>
  </div>
  