document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore(); // Initialize Firestore
    const jobsContainer = document.getElementById('jobs-container'); // Jobs container
    const jobDetails = document.getElementById('job-details'); // Job details section

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
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
            jobsContainer.innerHTML = "<p>Kunde inte hämta jobb. Försök igen senare.</p>";
        }
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
