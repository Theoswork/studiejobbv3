document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore(); // Initialize Firestore
    const auth = firebase.auth(); // Initialize Firebase Auth
    const jobsContainer = document.getElementById('jobs-container'); // Jobs container
    const jobDetails = document.getElementById('job-details'); // Job details section
    const loginSection = document.querySelector('.login-section'); // Login section

    // Check authentication state
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            const userEmail = user.email;
            loginSection.innerHTML = `
                <h3>Welcome, ${userEmail}</h3>
                <button id="logout-button">Logga ut</button>
            `;

            // Add logout functionality
            const logoutButton = document.getElementById('logout-button');
            logoutButton.addEventListener('click', () => {
                auth.signOut().then(() => {
                    alert("Du har loggats ut!");
                    location.reload(); // Reload to reset UI
                }).catch((error) => {
                    console.error("Error logging out:", error.message);
                });
            });
        } else {
            // User is not logged in, show login and signup forms
            loginSection.innerHTML = `
                <h3>Logga in</h3>
                <form id="login-form">
                    <label for="email">E-post</label>
                    <input type="email" id="email" name="email" placeholder="Ange din e-post" required>
                
                    <label for="password">Lösenord</label>
                    <input type="password" id="password" name="password" placeholder="Ange ditt lösenord" required>
                
                    <button type="submit">Logga in</button>
                </form>
                <h3>Skapa Konto</h3>
                <form id="signup-form">
                    <label for="signup-email">E-post</label>
                    <input type="email" id="signup-email" placeholder="Ange din e-post" required>
                
                    <label for="signup-password">Lösenord</label>
                    <input type="password" id="signup-password" placeholder="Ange ditt lösenord" required>
                
                    <button type="submit">Skapa Konto</button>
                </form>
                <div id="error-message" style="color: red;"></div>
            `;

            // Attach login and signup event listeners
            attachAuthHandlers();
        }
    });

    // Attach login and signup handlers
    const attachAuthHandlers = () => {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = loginForm.email.value.trim();
                const password = loginForm.password.value.trim();

                auth.signInWithEmailAndPassword(email, password)
                    .then(() => {
                        alert("Inloggning lyckades!");
                    })
                    .catch((error) => {
                        console.error("Login error:", error.message);
                        document.getElementById('error-message').textContent = "Felaktigt användarnamn eller lösenord.";
                    });
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = signupForm['signup-email'].value.trim();
                const password = signupForm['signup-password'].value.trim();

                try {
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    const user = userCredential.user;

                    // Save user data to Firestore
                    await db.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName || "", // Optional field for display name
                        photoURL: user.photoURL || "",       // Optional field for profile picture
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        jobs: { saved: [] }, // Initialize saved jobs
                        
                    });

                    alert("Konto skapat framgångsrikt!");
                } catch (error) {
                    console.error("Signup error:", error.message);
                    document.getElementById('error-message').textContent = "Kunde inte skapa konto. Försök igen.";
                }
            });
        }
    };

    // Function to fetch jobs from Firestore
    const fetchJobs = async () => {
        jobsContainer.innerHTML = "<p>Hämtar jobb...</p>"; // Show loading message

        try {
            const snapshot = await db.collection('jobs').orderBy('createdAt', 'desc').limit(5).get();

            // If no jobs found
            if (snapshot.empty) {
                jobsContainer.innerHTML = "<p>Inga jobb hittades.</p>";
                return;
            }

            // Clear the container and display jobs
            jobsContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const job = doc.data(); // Get job data
                jobsContainer.innerHTML += `
                    <div class="job-card" data-id="${doc.id}">
                        <h3>${job.title}</h3>
                        <p><strong>Företag:</strong> ${job.company}</p>
                        <p><strong>Plats:</strong> ${job.location}</p>
                        <p><strong>Anställningsform:</strong> ${job.type}</p>
                        <p>${job.description.substring(0, 100)}...</p>
                        <button class="save-job-button" data-id="${doc.id}">♡</button>
                    </div>
                `;
            });

            // Add click event listeners to job cards
            const jobCards = document.querySelectorAll('.job-card');
            jobCards.forEach((card) => {
                card.addEventListener('click', () => {
                    const jobId = card.getAttribute('data-id');
                    showJobDetails(jobId);
                });
            });

            // Attach save listeners to jobs
            attachSaveListeners();
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
            jobsContainer.innerHTML = "<p>Kunde inte hämta jobb. Försök igen senare.</p>";
        }
    };

    // Function to attach save listeners
    const attachSaveListeners = () => {
        const saveButtons = document.querySelectorAll('.save-job-button');
        saveButtons.forEach((button) => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent triggering parent click event
                const jobId = button.getAttribute('data-id');
                const user = auth.currentUser;

                if (!user) {
                    alert("Du måste vara inloggad för att spara ett jobb!");
                    return;
                }

                const userRef = db.collection('users').doc(user.uid);

                try {
                    // Check current state of the heart
                    const isSaved = button.textContent === "❤️";

                    // Update Firestore: Add or remove the saved job
                    if (isSaved) {
                        await userRef.update({
                            "jobs.saved": firebase.firestore.FieldValue.arrayRemove(jobId),
                        });
                        button.textContent = "♡"; // Change back to unsaved
                    } else {
                        await userRef.update({
                            "jobs.saved": firebase.firestore.FieldValue.arrayUnion(jobId),
                        });
                        button.textContent = "❤️"; // Change to saved
                    }
                } catch (error) {
                    console.error("Error updating saved jobs:", error.message);
                    alert("Kunde inte uppdatera jobbstatus. Försök igen senare.");
                }
            });
        });
    };

    // Function to display job details
    const showJobDetails = async (jobId) => {
        try {
            const doc = await db.collection('jobs').doc(jobId).get();
            if (doc.exists) {
                const job = doc.data();
                jobDetails.innerHTML = `
                    <h2>${job.title}</h2>
                    <p><strong>Företag:</strong> ${job.company}</p>
                    <p><strong>Plats:</strong> ${job.location}</p>
                    <p><strong>Anställningsform:</strong> ${job.type}</p>
                    <p><strong>Beskrivning:</strong> ${job.description}</p>
                    <p><strong>Krav:</strong> ${job.requirements || "Inga specifika krav angivna"}</p>
                    <p><strong>Nyckelord:</strong> ${job.keywords ? job.keywords.join(', ') : "Inga nyckelord angivna"}</p>
                `;
            } else {
                jobDetails.innerHTML = "<p>Kunde inte hitta detaljer för det valda jobbet.</p>";
            }
        } catch (error) {
            console.error("Error fetching job details:", error.message);
            jobDetails.innerHTML = "<p>Kunde inte hämta jobbdetaljer. Försök igen senare.</p>";
        }
    };

    fetchJobs(); // Fetch jobs on page load
});
