import { firebaseConfig } from "./firebaseConfig.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Fungsi untuk memperbarui tampilan profil pengguna
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Ambil data pengguna dari Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          updateUserProfile(userData); // Perbarui tampilan dengan data pengguna
        } else {
          console.warn("Data pengguna tidak ditemukan di database.");
        }
      });
    } else {
      console.warn("Pengguna tidak terautentikasi.");
      // Alihkan ke halaman login
      window.location.href = "login.html";
    }
  });

  // Fungsi untuk logout pengguna dari aplikasi
  const signoutButton = document.getElementById("signout-button");
  if (signoutButton) {
    signoutButton.addEventListener("click", () => {
      signOut(auth)
        .then(() => {
          // Alihkan ke halaman awal
          window.location.href = "index.html";
        })
        .catch(() => {
          console.error("Gagal keluar");
        });
    });
  } else {
    // console.error("Element with ID 'signout-button' not found.");
  }
});

function updateUserProfile(userData) {
  if (!userData) {
    console.error("Data pengguna tidak tersedia.");
    return;
  }

  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = userData.name || "Nama tidak tersedia";
  } else {
    // console.error("Element with ID 'userName' not found.");
  }

  const fullNameElement = document.getElementById("fullName");
  if (fullNameElement) {
    fullNameElement.textContent = userData.name || "Nama tidak tersedia";
  } else {
    // console.error("Element with ID 'fullName' not found.");
  }

  const userEmailElement = document.getElementById("userEmail");
  if (userEmailElement) {
    userEmailElement.textContent = userData.email || "Email tidak tersedia";
  } else {
    // console.error("Element with ID 'userEmail' not found.");
  }

  const userGenderElement = document.getElementById("userGender");
  if (userGenderElement) {
    userGenderElement.textContent =
      userData.gender || "Jenis kelamin tidak tersedia";
  } else {
    // console.error("Element with ID 'userGender' not found.");
  }

  const userTtlElement = document.getElementById("userTtl");
  if (userTtlElement) {
    userTtlElement.textContent = userData.ttl || "Tanggal lahir tidak tersedia";
  } else {
    // console.error("Element with ID 'userTtl' not found.");
  }

  const userNohpElement = document.getElementById("userNohp");
  if (userNohpElement) {
    userNohpElement.textContent = userData.nohp || "Nomor HP tidak tersedia";
  } else {
    // console.error("Element with ID 'userNohp' not found.");
  }

  const lastLoginElement = document.getElementById("lastLogin");
  if (lastLoginElement) {
    lastLoginElement.textContent =
      userData.last_login || "Last Login tidak tersedia";
  } else {
    // console.error("Element with ID 'lastLogin' not found.");
  }
}

// Fungsi untuk menyimpan hasil test ke database
function saveQuizResult(score, userAnswers) {
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    const userRef = ref(database, `users/${uid}`);
    const testResultRef = ref(database, `testResults/${uid}`);

    // Ambil data nama pengguna dari database
    get(userRef).then((snapshot) => {
      const name = snapshot.exists()
        ? snapshot.val().name
        : user.displayName || "Nama Tidak Tersedia";

      const testResult = {
        name: name,
        score: score,
        question: 20,
        userAnswers: userAnswers,
        timestamp: new Date().toISOString(),
      };

      set(testResultRef, testResult)
        .then(() => {
          console.log("Hasil test berhasil disimpan ke database.");
          showPopup("Hasil test berhasil disimpan.");
        })
        .catch((error) => {
          // console.error("Gagal menyimpan hasil test:", error);
          showPopup("Gagal menyimpan hasil test.");
        });
    });
  } else {
    console.error("Pengguna tidak login. Hasil quiz tidak dapat disimpan.");
  }
}

export { saveQuizResult };

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
