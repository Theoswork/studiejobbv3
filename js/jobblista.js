document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore();
    const jobsContainer = document.getElementById('jobs-container');
    const searchButton = document.getElementById('search-button');

    // Function to fetch and display jobs
    const fetchJobs = async (filters = {}) => {
        jobsContainer.innerHTML = "<p>Hämtar jobb...</p>";
        let query = db.collection('jobs');

        // Apply filters
        if (filters.keyword) {
            query = query.where('keywords', 'array-contains', filters.keyword.toLowerCase());
        }
        if (filters.location) {
            query = query.where('location', '==', filters.location);
        }
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }

        try {
            const snapshot = await query.get();
            if (snapshot.empty) {
                jobsContainer.innerHTML = "<p>Inga jobb hittades.</p>";
                return;
            }

            // Clear container and render jobs
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
                        <button onclick="viewJobDetails('${doc.id}')">Läs Mer</button>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error fetching jobs:", error.message);
            jobsContainer.innerHTML = "<p>Kunde inte hämta jobb. Försök igen senare.</p>";
        }
    };

    // Function to handle search button click
    searchButton.addEventListener('click', () => {
        const keyword = document.getElementById('search-keyword').value.trim().toLowerCase();
        const location = document.getElementById('search-location').value.trim();
        const type = document.getElementById('search-type').value;

        fetchJobs({ keyword, location, type });
    });

    // Initial fetch of all jobs
    fetchJobs();
});

// View job details (dummy function for now)
function viewJobDetails(jobId) {
    alert(`Job details for ID: ${jobId}`);
}
