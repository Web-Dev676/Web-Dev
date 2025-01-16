// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');

// Add logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include' // Important for cross-origin requests
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                window.location.href = '/login.html';
            } else {
                alert(data.error || 'Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Connection error. Please check your internet connection and try again.');
        }
    });
}