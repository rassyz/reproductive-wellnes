import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Get buttons
let signinButton = document.getElementById("signin-button");
let signupButton = document.getElementById("signup-button");

// Sign-up functionality
signupButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission

  // Get input values
  let name = document.getElementById("name").value;
  let gender = document.getElementById("gender").value;
  let ttl = document.getElementById("ttl").value;
  let nohp = document.getElementById("nohp").value;
  let emailSignup = document.getElementById("email_signup").value;
  let passwordSignup = document.getElementById("psw_signup").value;

  // Validasi input
  if (!name || !ttl || !nohp || !emailSignup || !passwordSignup) {
    showPopup("Semua kolom wajib diisi!");
    return;
  }

  // Buat akun dengan Firebase
  createUserWithEmailAndPassword(auth, emailSignup, passwordSignup)
    .then((userCredential) => {
      const user = userCredential.user;

      // Simpan data pengguna ke Realtime Database
      set(ref(database, "users/" + user.uid), {
        name: name,
        gender: gender,
        ttl: ttl,
        nohp: nohp,
        email: emailSignup,
      })
        .then(() => {
          showPopup("Berhasil membuat akun, silahkan login!");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          console.error("Gagal menyimpan data pengguna:", error);
          showPopup("Gagal menyimpan data pengguna. Silakan coba lagi.");
        });
    })
    .catch((error) => {
      let errorMessage = "Login gagal!";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Pengguna tidak ditemukan!";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password terlalu lemah!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email tidak valid!";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Terlalu banyak percobaan login! Coba lagi nanti.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email sudah terdaftar!";
      }
      showPopup(errorMessage);
    });
});

// Sign-in functionality
signinButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent form submission

  // Get input values
  let emailSignin = document.getElementById("email_signin").value;
  let passwordSignin = document.getElementById("psw_signin").value;

  // Sign in with email and password
  signInWithEmailAndPassword(auth, emailSignin, passwordSignin)
    .then((userCredential) => {
      const user = userCredential.user;

      // Update last login time in Realtime Database
      let lgDate = new Date();
      update(ref(database, "users/" + user.uid), {
        last_login: lgDate,
      })
        .then(() => {
          showPopup("Login berhasil!");
          setTimeout(() => {
            window.location.href = "home.html";
          }, 1200);
        })
        .catch((error) => {
          // Handle database update error
          showPopup("Gagal memperbarui data login: " + error.message);
        });
    })
    .catch((error) => {
      // Handle sign-in error
      showPopup("Login gagal, email atau password salah!");
    });
});

// Function to show a popup message
function showPopup(message) {
  let popup = document.createElement("div");
  popup.innerText = message;
  popup.className = "popup";
  popup.style.display = "block";
  document.body.appendChild(popup);
  setTimeout(() => {
    document.body.removeChild(popup);
  }, 3000);
}
