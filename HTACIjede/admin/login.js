document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Replace with your actual admin credentials
        const adminUsername = 'admin';
        const adminPassword = 'password123';

        if (username === adminUsername && password === adminPassword) {
            // Redirect to admin page
            window.location.href = 'admin/admin.html';
        } else {
            errorMessage.textContent = 'Invalid username or password. Please try again.';
        }
    });
});