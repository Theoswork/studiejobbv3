async function addSavedJob() {
    const savedJobsRef = doc(db, "users", userId, "jobs", "saved");

    await updateDoc(savedJobsRef, {
        jobs: arrayUnion({
            title: "Backend Developer",
            company: "XYZ AB",
            location: "Göteborg",
            savedDate: new Date().toISOString(),
        }),
    });
}
