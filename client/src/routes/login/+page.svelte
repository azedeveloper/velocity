<script>
    let username = '';
    let password = '';
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Login:', { username, password });
      //Login logic
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
        .then(response => response.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('velocity_token', data.token);
            window.href = '/'; // Redirect to home page
          } else {
            console.error('Login failed:', data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
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
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-neutral-900 text-white"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-white">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="w-full mt-1 px-4 py-2 border border-neutral-800 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-neutral-900 text-white"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Log In
        </button>
      </form>
      <p class="mt-4 text-sm text-center text-gray-300">
        Don't have an account? <a href="/register" class="text-indigo-600 hover:underline">Sign up</a>
      </p>
    </div>
  </div>
  