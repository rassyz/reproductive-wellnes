import { saveQuizResult } from "./home.js";

const quizData = [
  {
    question: "Apakah anda menjaga kesehatan reproduksi dengan baik dan benar?",
    options: ["Iya", "Tidak"],
    correct: 0,
  },
  {
    question: "Apakah anda sudah pernah berhubungan seksual?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah anda mengganti celana dalam minimal 2 kali sehari?",
    options: ["Iya", "Tidak"],
    correct: 0,
  },
  {
    question: "Apakah anda melakukan pemeriksaan kesehatan secara rutin?",
    options: ["Iya", "Tidak"],
    correct: 0,
  },
  {
    question:
      "Apakah anda pernah mendapatkan vaksinasi untuk mencegah penyakit sistem reproduksi?",
    options: ["Iya", "Tidak"],
    correct: 0,
  },
  {
    question:
      "Apakah anda pernah mengalami perubahan yang mencolok dalam kesehatan reproduksi? (misal terdapat kutil di sekitar area kelamin)",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apakah anda sebelumnya pernah terkena Infeksi Menular Seksual (IMS)?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah anda pernah merasakan nyeri pada daerah kelamin?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah anda menjaga pola makan yang sehat?",
    options: ["Iya", "Tidak"],
    correct: 0,
  },
  {
    question: "Apakah anda mengkonsumsi alkohol dan rokok?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah area kelamin anda terasa gatal dan terdapat ruam?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apakah di sekitar mulut anda terdapat luka atau seperti bercak putih?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah anda mengalami perubahan warna pada urine?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah ketika buang air kecil terasa menyakitkan atau panas?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apakah anda pernah menggunakan produk pembersih area reproduksi?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apakah anda pernah merasakan bau yang tidak sedap di area reproduksi?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apakah anda sudah menikah?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question: "Apabila sudah menikah, apakah menikah diumur < 19 tahun?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apabila sudah menikah apakah anda pernah berhubungan seksual dengan orang yang berbeda-beda?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
  {
    question:
      "Apabila sudah menikah apakah anda pernah mengalami nyeri saat berhubungan seksual?",
    options: ["Iya", "Tidak"],
    correct: 1,
  },
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const timerEl = document.getElementById("timer");
const progressBar = document.querySelector(".progress-bar");
const quizContainer = document.getElementById("quiz");

function loadQuestion() {
  const question = quizData[currentQuestion];
  questionEl.textContent = question.question;
  optionsEl.innerHTML = "";
  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.addEventListener("click", () => selectOption(button, index));
    optionsEl.appendChild(button);
  });
  nextBtn.style.display = "none";
  timeLeft = 30;
  if (timer) clearInterval(timer);
  startTimer();
  updateProgress();
}

function selectOption(selectedButton, optionIndex) {
  const buttons = optionsEl.getElementsByClassName("option");
  Array.from(buttons).forEach((button) => button.classList.remove("selected"));
  selectedButton.classList.add("selected");
  nextBtn.style.display = "block";
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      checkAnswer();
    }
  }, 1000);
}

function checkAnswer() {
  const selectedOption = document.querySelector(".option.selected");
  if (!selectedOption) return;

  const selectedAnswer = Array.from(optionsEl.children).indexOf(selectedOption);
  const question = quizData[currentQuestion];

  if (selectedAnswer === question.correct) {
    score++;
    selectedOption.classList.add("correct");
  } else {
    selectedOption.classList.add("incorrect");
    optionsEl.children[question.correct].classList.add("correct");
  }

  Array.from(optionsEl.children).forEach((button) => (button.disabled = true));
  clearInterval(timer);
}

function updateProgress() {
  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

function showResults() {
  let message;
  let userAnswers = []; // Array untuk menyimpan jawaban pengguna

  let goodjob = `
    <h2 style="text-align: center; margin-bottom: 20px; font-weight: bold;">Good Job!</h2>
    <p style="text-align: justify;">
      Untuk pria dan wanita, jaga kebersihan sistem reproduksi dengan benar meliputi:
    </p>
    <ol style="text-align: justify;">
      <li>Selalu membersihkan alat kelamin setelah BAK.</li>
      <li>Pastikan organ reproduksi dalam keadaan kering dan tidak lembab.</li>
      <li>Hindari penggunaan sabun pembersih kelamin karena area kelamin rentan iritasi.</li>
      <li>Ganti celana dalam minimal 2 kali sehari.</li>
      <li>Sunat bagi pria karena apabila tidak sunat menyebabkan penumpukan kotoran pada kulup dan meningkatkan risiko infeksi.</li>
    </ol>
  `;
  let hmm = `
    <h2 style="text-align: center; margin-bottom: 20px; font-weight: bold;">Hmmm!</h2>
    <p style="text-align: justify;">
      Untuk pria dan wanita, hindari perilaku seks beresiko seperti :
    </p>
    <ol style="text-align: justify;">
      <li>Tidak ganti ganti pasangan.</li>
      <li>Periksa dan periksa kembali riwayat seksual diri sendiri dan pasangan.</li>
      <li>Menggunakan alat kontrasepsi sebelum berhubungan seksual.</li>
      <li>Menjaga kebersihan organ intim sebelum dan sesudah berhubungan seksual.</li>
    </ol>
  `;
  let yahh = `
    <h2 style="text-align: center; margin-bottom: 20px; font-weight: bold;">Yahhh!</h2>
    <p style="text-align: justify;">
      Cara penanganan masalah kesehatan reproduksi bagi pria dan wanita adalah dengan memeriksakan kesehatan reproduksi ke dokter spesialis kandungan atau dokter spesialis urologi secara rutin meliputi :
    </p>
    <ol style="text-align: justify;">
      <li>Pemeriksaan urine.</li>
      <li>USG.</li>
      <li>HSG.</li>
      <li>Tes penyakit kelamin, seperti sifilis.</li>
      <li>VDRL.</li>
      <li>Pap Smear.</li>
    </ol>
  `;
  
  // Loop untuk menyimpan jawaban pengguna
  quizData.forEach((q, index) => {
    const selectedOption = document.querySelector(`.question-${index} .selected`);
    if (selectedOption) {
      const answerIndex = Array.from(selectedOption.parentNode.children).indexOf(
        selectedOption
      );
      userAnswers.push(answerIndex);
    } else {
      userAnswers.push(null); // Jika tidak ada jawaban
    }
  });

  // Pilih pesan berdasarkan skor
  if (score === quizData.length || score >= 14) {
    message = goodjob;
  } else if (score >= 8 && score <= 13) {
    message = hmm;
  } else {
    message = yahh;
  }

  // Update the quiz container with the results
  quizContainer.innerHTML = `
  <div class="results">
    <div class="result-icon">
      <i class="fas ${
        score >= 14
          ? "fa-smile text-success" 
          : score >= 8 && score <= 13
          ? "fa-frown text-warning" 
          : score >= 0 && score <= 7
          ? "fa-exclamation-triangle text-danger" 
          : ""
      }"></i>
    </div>
    <div class="score">Score: ${score}/${quizData.length}</div>
    <p>${message}</p>
    <button class="btn btn-primary" onclick="location.reload()">Deteksi Ulang</button>
  </div>
  `;
  // Simpan hasil ke Firebase
  saveQuizResult(score, userAnswers);
}

nextBtn.addEventListener("click", () => {
  checkAnswer();
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

loadQuestion();