document.addEventListener("DOMContentLoaded", () => {
    const auth = firebase.auth();

    // Display user email
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('user-email').textContent = user.email;
        } else {
            // Redirect to login if no user is logged in
            window.location.href = "index.html";
        }
    });

    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            auth.signOut()
                .then(() => {
                    console.log("User logged out");
                    window.location.href = "index.html"; // Redirect to home
                })
                .catch((error) => {
                    console.error("Error logging out:", error.message);
                });
        });
    }
});
