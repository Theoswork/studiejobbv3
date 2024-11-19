// firebase/mittkonto.js

import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Display user email
auth.onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("user-email").textContent = user.email;

        // Fetch applied jobs
        fetchAppliedJobs(user.uid);

        // Fetch saved jobs
        fetchSavedJobs(user.uid);

        // Fetch user preferences
        fetchPreferences(user.uid);
    } else {
        window.location.href = "index.html"; // Redirect to login if not logged in
    }
});

// Fetch applied jobs
async function fetchAppliedJobs(userId) {
    const docRef = doc(db, "users", userId, "jobs", "applied");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const appliedJobs = docSnap.data().jobs || [];
        const container = document.getElementById("applied-jobs");
        container.innerHTML = appliedJobs.map((job) => `<p>${job.title} - ${job.company}</p>`).join("");
    }
}

// Fetch saved jobs
async function fetchSavedJobs(userId) {
    const docRef = doc(db, "users", userId, "jobs", "saved");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const savedJobs = docSnap.data().jobs || [];
        const container = document.getElementById("saved-jobs");
        container.innerHTML = savedJobs.map((job) => `<p>${job.title} - ${job.company}</p>`).join("");
    }
}

// Fetch user preferences
async function fetchPreferences(userId) {
    const docRef = doc(db, "users", userId, "preferences", "settings");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const preferences = docSnap.data();
        document.getElementById("preferred-location").value = preferences.location || "";
        document.getElementById("job-type").value = preferences.jobType || "";
    }
}

// Save preferences
document.getElementById("preferences-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
        const location = document.getElementById("preferred-location").value;
        const jobType = document.getElementById("job-type").value;

        await setDoc(doc(db, "users", user.uid, "preferences", "settings"), {
            location,
            jobType,
        });

        alert("Dina inställningar har sparats!");
    }
});

// Logout
document.getElementById("logout-button").addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html"; // Redirect to home page
});
