import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

async function getUserPreferences() {
    const preferencesRef = doc(db, "users", userId, "preferences", "settings");
    const preferencesSnap = await getDoc(preferencesRef);

    if (preferencesSnap.exists()) {
        const preferences = preferencesSnap.data();
        console.log("Preferences:", preferences);
    } else {
        console.log("No preferences found!");
    }
}
