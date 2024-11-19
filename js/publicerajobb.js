document.addEventListener("DOMContentLoaded", () => {
    const db = firebase.firestore(); // Initialize Firestore

    const jobForm = document.getElementById('publish-job-form');

    // Handle form submission
    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect job details from the form
            const job = {
                title: document.getElementById('job-title').value.trim(),
                company: document.getElementById('company-name').value.trim(),
                location: document.getElementById('location').value.trim(),
                type: document.getElementById('job-type').value,
                description: document.getElementById('description').value.trim(),
                createdAt: firebase.firestore.Timestamp.now(),
            };

            // Save job to Firestore
            db.collection('jobs')
                .add(job)
                .then(() => {
                    alert("Job posted successfully!");
                    jobForm.reset(); // Reset the form
                })
                .catch((error) => {
                    console.error("Error adding job:", error.message);
                    alert("Failed to post the job. Please try again.");
                });
        });
    }
});