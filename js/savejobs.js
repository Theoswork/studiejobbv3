import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Listen for clicks on Save Job buttons
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("save-job-button")) {
        // Get job details from the button's data attributes
        const jobTitle = e.target.dataset.title;
        const jobCompany = e.target.dataset.company;
        const jobLocation = e.target.dataset.location;

        // Get the currently logged-in user
        const user = auth.currentUser;
        if (!user) {
            alert("Du måste vara inloggad för att spara ett jobb!");
            return;
        }

        const userId = user.uid;

        try {
            // Reference to the user's saved jobs in Firestore
            const userRef = doc(db, "users", userId);

            // Update the saved jobs array
            await updateDoc(userRef, {
                "jobs.saved": arrayUnion({
                    title: jobTitle,
                    company: jobCompany,
                    location: jobLocation,
                    savedDate: new Date().toISOString(),
                }),
            });

            alert(`Jobbet "${jobTitle}" har sparats!`);
        } catch (error) {
            console.error("Error saving job:", error);
            alert("Kunde inte spara jobbet. Försök igen senare.");
        }
    }
});
