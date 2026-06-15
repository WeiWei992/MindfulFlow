let timeLeft = 25 * 60; // 25 minutes standard focus
let timerInterval = null;
let isFocusState = true;

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

function startTimer() {
    if (timerInterval !== null) return;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            if (isFocusState) {
                triggerWellnessBreak();
            } else {
                returnToFocus();
            }
        }
    }, 1000);
}

function triggerWellnessBreak() {
    isFocusState = false;
    timerState.textContent = "Mindful Break";
    wellnessModal.classList.remove('hidden');
    
    // Fetch a dynamic health prompt from our Flask API
    fetch('/api/wellness-tip')
        .then(res => res.json())
        .then(data => {
            wellnessTip.textContent = data.tip;
        });
        
    timeLeft = 5 * 60; // 5 minute recovery break
    updateDisplay();
}

function returnToFocus() {
    isFocusState = true;
    timerState.textContent = "Focus Time";
    wellnessModal.classList.add('hidden');
    timeLeft = 25 * 60;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
closeBreakBtn.addEventListener('click', returnToFocus);

updateDisplay();