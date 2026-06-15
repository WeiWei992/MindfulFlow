let timeLeft = 25 * 60; 
let timerInterval = null;
let isFocusState = true;
let isPaused = true;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const timerState = document.getElementById('timer-state');
const wellnessModal = document.getElementById('wellness-modal');
const wellnessTip = document.getElementById('wellness-tip');
const closeBreakBtn = document.getElementById('close-break-btn');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    if (isPaused) {
        // Start or Resume
        isPaused = false;
        startBtn.textContent = "Pause Session";
        startBtn.style.backgroundColor = "#e53e3e"; // Red alert color for pause
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                isPaused = true;
                if (isFocusState) {
                    triggerWellnessBreak();
                } else {
                    returnToFocus();
                }
            }
        }, 1000);
    } else {
        // Pause
        isPaused = true;
        startBtn.textContent = "Resume Session";
        startBtn.style.backgroundColor = "#319795"; // Return to classic teal
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function triggerWellnessBreak() {
    isFocusState = false;
    timerState.textContent = "🧘 Mindful Break Mode";
    timerState.style.color = "#2b6cb0";
    wellnessModal.classList.remove('hidden');
    startBtn.classList.add('hidden'); // Hide main button during forced break
    
    fetch('/api/wellness-tip')
        .then(res => res.json())
        .then(data => {
            wellnessTip.textContent = data.tip;
        });
        
    timeLeft = 5 * 60; 
    updateDisplay();
}

function returnToFocus() {
    isFocusState = true;
    isPaused = true;
    timerState.textContent = "🎯 Focus Time";
    timerState.style.color = "#4a5568";
    wellnessModal.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.textContent = "Start Next Block";
    startBtn.style.backgroundColor = "#319795";
    timeLeft = 25 * 60;
    updateDisplay();
}

startBtn.addEventListener('click', toggleTimer);
closeBreakBtn.addEventListener('click', returnToFocus);

updateDisplay();