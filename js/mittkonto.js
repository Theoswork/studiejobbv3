// Import Firebase modules
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

// On page load, check for logged-in user and display data
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userId = user.uid;

        // Display the user's email
        document.getElementById("user-email").textContent = user.email;

        // Fetch and display the user's data
        await fetchUserPreferences(userId);
        await fetchAppliedJobs(userId);
        await fetchSavedJobs(userId);
    } else {
        // Redirect to login page if not logged in
        window.location.href = "index.html";
    }
});

// Fetch user preferences and display them
async function fetchUserPreferences(userId) {
    const preferencesRef = doc(db, "users", userId);
    const docSnap = await getDoc(preferencesRef);

    if (docSnap.exists()) {
        const preferences = docSnap.data().preferences || {};
        document.getElementById("preferred-location").value = preferences.location || "";
        document.getElementById("job-type").value = preferences.jobType || "";
    } else {
        console.log("No preferences found for this user.");
    }
}

// Fetch applied jobs and display them
async function fetchAppliedJobs(userId) {
    const appliedJobsRef = doc(db, "users", userId);
    const docSnap = await getDoc(appliedJobsRef);

    if (docSnap.exists()) {
        const appliedJobs = docSnap.data().jobs?.applied || [];
        const appliedJobsContainer = document.getElementById("applied-jobs");
        appliedJobsContainer.innerHTML = ""; // Clear the container

        if (appliedJobs.length > 0) {
            appliedJobs.forEach((job) => {
                const jobElement = document.createElement("p");
                jobElement.textContent = `${job.title} at ${job.company} (${job.location})`;
                appliedJobsContainer.appendChild(jobElement);
            });
        } else {
            appliedJobsContainer.innerHTML = "<p>Du har inte ansökt till några jobb än.</p>";
        }
    }
}

// Fetch saved jobs and display them
async function fetchSavedJobs(userId) {
    const savedJobsRef = doc(db, "users", userId);
    const docSnap = await getDoc(savedJobsRef);

    if (docSnap.exists()) {
        const savedJobs = docSnap.data().jobs?.saved || [];
        const savedJobsContainer = document.getElementById("saved-jobs");
        savedJobsContainer.innerHTML = ""; // Clear the container

        if (savedJobs.length > 0) {
            savedJobs.forEach((job) => {
                const jobElement = document.createElement("p");
                jobElement.textContent = `${job.title} at ${job.company} (${job.location})`;
                savedJobsContainer.appendChild(jobElement);
            });
        } else {
            savedJobsContainer.innerHTML = "<p>Du har inte sparat några jobb än.</p>";
        }
    }
}

// Save updated preferences
document.getElementById("preferences-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const location = document.getElementById("preferred-location").value;
        const jobType = document.getElementById("job-type").value;

        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                preferences: {
                    location,
                    jobType,
                },
            });
            alert("Dina inställningar har sparats!");
        } catch (error) {
            console.error("Error saving preferences:", error);
            alert("Kunde inte spara inställningarna.");
        }
    }
});

// Log out the user
document.getElementById("logout-button").addEventListener("click", async () => {
    try {
        await signOut(auth);
        alert("Du har loggats ut.");
        window.location.href = "index.html"; // Redirect to login page
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Kunde inte logga ut.");
    }
});
