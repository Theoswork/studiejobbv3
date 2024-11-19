document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();

  // Login functionality
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = loginForm.email.value;
          const password = loginForm.password.value;

          auth.signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  console.log("Logged in:", userCredential.user);
                  document.getElementById('error-message').textContent = "Logged in successfully!";
                  window.location.href = "mittkonto.html";
              })
              .catch((error) => {
                  console.error("Error logging in:", error.message);
                  document.getElementById('error-message').textContent = error.message;
              });
      });
  }

  // Signup functionality
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = signupForm['signup-email'].value;
          const password = signupForm['signup-password'].value;

          auth.createUserWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  console.log("Account created:", userCredential.user);
                  document.getElementById('error-message').textContent = "Account created successfully!";
              })
              .catch((error) => {
                  console.error("Error creating account:", error.message);
                  document.getElementById('error-message').textContent = error.message;
              });
      });
  }
});


import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

const auth = getAuth();
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User UID:", user.uid);
    } else {
        console.log("No user is signed in.");
    }
});
