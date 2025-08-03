const inputBox = document.getElementById("inputBox");
const timerDisplay = document.getElementById("timer");
const wpmLive = document.getElementById("wpmLive");
const highlightedText = document.getElementById("highlightedText");
const progressBar = document.getElementById("progress");
const durationSelect = document.getElementById("duration");

let promptText = `Typing is an essential skill that is used in everyday life. Whether it's for writing emails, programming code, composing essays, or chatting with friends online, the ability to type quickly and accurately makes communication more efficient and productive. Over the years, touch typing has become increasingly important as the use of digital devices continues to grow. Practicing typing consistently not only improves speed but also enhances muscle memory, allowing your fingers to move instinctively over the keyboard without needing to look down. Typing tests are a great way to track your progress and identify areas where you can improve. They help in building concentration and reducing the number of errors you make. Many professionals rely on their typing skills for their jobs, including writers, developers, journalists, and data entry clerks. By participating in daily typing exercises, you build the confidence needed to work faster while maintaining a high level of accuracy. With time, typing can become second nature, just like speaking or walking. So make typing practice part of your daily routine to see real improvement.`;

let interval, totalSeconds, timerStarted = false, startTime, endTime;

function resetTest() {
  clearInterval(interval);
  timerDisplay.textContent = "Time: 00:00";
  wpmLive.textContent = "WPM: 0";
  inputBox.value = "";
  inputBox.disabled = false;
  highlightedText.innerHTML = promptText.split("").map(ch => `<span>${ch}</span>`).join("");
  progressBar.style.width = "0%";
  timerStarted = false;
}

function updateTextHighlighting() {
  const input = inputBox.value;
  const spans = highlightedText.querySelectorAll("span");
  spans.forEach(span => span.className = "");
  input.split("").forEach((char, i) => {
    if (!spans[i]) return;
    if (char === promptText[i]) {
      spans[i].className = "correct";
    } else {
      spans[i].className = "incorrect";
    }
  });
}

function startTimer() {
  totalSeconds = parseInt(durationSelect.value) * 60;
  startTime = Date.now();
  interval = setInterval(() => {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    let remaining = totalSeconds - elapsed;
    if (remaining <= 0) {
      clearInterval(interval);
      showResults();
      return;
    }
    timerDisplay.textContent = `Time: ${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
    const words = inputBox.value.trim().split(/\s+/).filter(Boolean);
    wpmLive.textContent = `WPM: ${Math.floor(words.length / (elapsed / 60))}`;
    progressBar.style.width = `${((elapsed) / totalSeconds) * 100}%`;
  }, 1000);
}

function showResults() {
  const inputWords = inputBox.value.trim().split(/\s+/);
  const promptWords = promptText.trim().split(/\s+/);
  const timeUsed = (Date.now() - startTime) / 1000 / 60;

  const grossWPM = Math.floor(inputWords.length / timeUsed);
  let correctWords = 0;
  let errors = [];

  inputWords.forEach((word, i) => {
    if (word === promptWords[i]) {
      correctWords++;
    } else {
      errors.push(word);
    }
  });

  const netWPM = Math.max(grossWPM - errors.length, 0);

  const resultHTML = `
    <p><strong>Time:</strong> ${durationSelect.value} minutes</p>
    <p><strong>Gross WPM:</strong> ${grossWPM}</p>
    <p><strong>Net WPM:</strong> ${netWPM}</p>
    <p><strong>Errors:</strong> ${errors.join(", ") || 'None'}</p>
  `;

  localStorage.setItem("latestResult", resultHTML);
  window.location.href = "result.html";
}

inputBox.addEventListener("input", () => {
  if (!timerStarted) {
    timerStarted = true;
    startTimer();
  }
  updateTextHighlighting();
});

document.getElementById("stopBtn").addEventListener("click", showResults);

const pauseBtn = document.getElementById("pauseBtn");
let isPaused = false;
let pausedTime = 0;

pauseBtn.addEventListener("click", () => {
  if (!isPaused) {
    clearInterval(interval);
    inputBox.disabled = true;
    pauseBtn.textContent = "Resume";
    pausedTime = Date.now();
    isPaused = true;
  } else {
  
    const pauseDuration = Date.now() - pausedTime;
    startTime += pauseDuration;
    inputBox.disabled = false;
    pauseBtn.textContent = "Pause";
    interval = setInterval(() => {
      let elapsed = Math.floor((Date.now() - startTime) / 1000);
      let remaining = totalSeconds - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        showResults();
        return;
      }
      timerDisplay.textContent = `Time: ${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
      const words = inputBox.value.trim().split(/\s+/).filter(Boolean);
      wpmLive.textContent = `WPM: ${Math.floor(words.length / (elapsed / 60))}`;
      progressBar.style.width = `${((elapsed) / totalSeconds) * 100}%`;
    }, 1000);
    isPaused = false;
  }
});

function showResults() {
  const inputWords = inputBox.value.trim().split(/\s+/);
  const promptWords = promptText.trim().split(/\s+/);
  const timeUsed = (Date.now() - startTime) / 1000 / 60;

  const grossWPM = Math.floor(inputWords.length / timeUsed);
  let correctWords = 0;
  let errors = [];

  inputWords.forEach((word, i) => {
    if (word === promptWords[i]) {
      correctWords++;
    } else {
      errors.push(word);
    }
  });

  const netWPM = Math.max(grossWPM - errors.length, 0);
  const accuracy = ((correctWords / inputWords.length) * 100).toFixed(1);

  const resultHTML = `
    <p><strong>Time:</strong> ${durationSelect.value} minutes</p>
    <p><strong>Gross WPM:</strong> ${grossWPM}</p>
    <p><strong>Net WPM:</strong> ${netWPM}</p>
    <p><strong>Accuracy:</strong> ${accuracy}%</p>
    <p><strong>Errors:</strong> ${errors.join(", ") || 'None'}</p>
  `;

  localStorage.setItem("latestResult", resultHTML);
  window.location.href = "result.html";
}

durationSelect.addEventListener("change", resetTest);

resetTest();