let timeLeft = 25 * 60; 
let timerInterval = null;
let isFocusState = true;
let isPaused = true;
const totalFocusTime = 25 * 60;

const timeDisplay = document.getElementById('time-display');
const startBtn = document.getElementById('start-btn');
const timerState = document.getElementById('timer-state');
const wellnessModal = document.getElementById('wellness-modal');
const wellnessTip = document.getElementById('wellness-tip');
const closeBreakBtn = document.getElementById('close-break-btn');

// Tree Elements
const treeEmoji = document.getElementById('tree-emoji');
const growthStatus = document.getElementById('growth-status');

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Dynamically update tree growth based on time remaining
    if (isFocusState && !isPaused) {
        updateTreeGrowth();
    }
}

function updateTreeGrowth() {
    const elapsed = totalFocusTime - timeLeft;
    
    if (elapsed > totalFocusTime * 0.75) {
        treeEmoji.textContent = "🌳";
        growthStatus.textContent = "Fully Grown!";
    } else if (elapsed > totalFocusTime * 0.40) {
        treeEmoji.textContent = "🌿";
        growthStatus.textContent = "Sapling Stage";
    } else if (elapsed > totalFocusTime * 0.10) {
        treeEmoji.textContent = "🌱";
        growthStatus.textContent = "Sprout Stage";
    } else {
        treeEmoji.textContent = "🌰";
        growthStatus.textContent = "Planted Seed";
    }
}

function toggleTimer() {
    if (isPaused) {
        isPaused = false;
        startBtn.textContent = "Pause Session";
        startBtn.style.backgroundColor = "#e53e3e"; 
        
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
        isPaused = true;
        startBtn.textContent = "Resume Session";
        startBtn.style.backgroundColor = "#319795"; 
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function triggerWellnessBreak() {
    isFocusState = false;
    timerState.textContent = "🧘 Mindful Break Mode";
    timerState.style.color = "#2b6cb0";
    wellnessModal.classList.remove('hidden');
    startBtn.classList.add('hidden');
    
    // Harvest bonus visual effect on successful completion
    treeEmoji.textContent = "🎉🌳"; 
    growthStatus.textContent = "Wellness Harvested!";
    
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
    startBtn.textContent = "Plant Next Tree";
    startBtn.style.backgroundColor = "#319795";
    
    treeEmoji.textContent = "🌰";
    growthStatus.textContent = "Planted Seed";
    
    timeLeft = 25 * 60;
    updateDisplay();
}

startBtn.addEventListener('click', toggleTimer);
closeBreakBtn.addEventListener('click', returnToFocus);

// Set initial state
treeEmoji.textContent = "🌰";
growthStatus.textContent = "Ready to Plant";
updateDisplay();