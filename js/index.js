document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const jobsContainer = document.getElementById('jobs-container');

    // Fetch jobs from Firestore
    const fetchJobs = async () => {
        jobsContainer.innerHTML = "<p>Hämtar jobb...</p>";

        try {
            const snapshot = await db.collection('jobs').orderBy('createdAt', 'desc').limit(5).get();

            if (snapshot.empty) {
                jobsContainer.innerHTML = "<p>Inga jobb hittades.</p>";
                return;
            }

            // Clear container and display jobs
            jobsContainer.innerHTML = '';
            snapshot.forEach((doc) => {
                const job = doc.data();
                jobsContainer.innerHTML += `
                    <div class="job-card">
                        <h3>${job.title}</h3>
                        <p><strong>Företag:</strong> ${job.company}</p>
                        <p><strong>Plats:</strong> ${job.location}</p>
                        <p><strong>Anställningsform:</strong> ${job.type}</p>
                        <p>${job.description.substring(0, 100)}...</p>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
            jobsContainer.innerHTML = "<p>Kunde inte hämta jobb. Försök igen senare.</p>";
        }
    };

    fetchJobs(); // Initial fetch
});
