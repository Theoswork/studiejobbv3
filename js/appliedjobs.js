import { getFirestore, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const db = getFirestore();
const userId = "USER_ID"; // Replace with actual user ID

async function addAppliedJob() {
    const appliedJobsRef = doc(db, "users", userId, "jobs", "applied");

    await updateDoc(appliedJobsRef, {
        jobs: arrayUnion({
            title: "Frontend Developer",
            company: "ABC AB",
            location: "Stockholm",
            appliedDate: new Date().toISOString(),
        }),
    });
}
