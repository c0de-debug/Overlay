const STORAGE_KEY = "osis_state";
const syncChannel = new BroadcastChannel("osis_sync");

// 1. Initialize the audio object (replace with your file path)
const alarmSound = new Audio("assets/Ring.mp3");

const DEFAULTS = {
  timerRemaining: 0,
  timerTarget: 0,
  timerRunning: false,
  alarmPlayed: false,
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULTS };
  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveState(newState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
}

function render() {
  const s = loadState();
  let remaining = s.timerRemaining || 0;

  if (s.timerRunning) {
    const diff = Math.ceil((s.timerTarget - Date.now()) / 1000);
    remaining = Math.max(0, diff);

    if (remaining === 0 && !s.alarmPlayed) {
      alarmSound.play().catch(err => console.log("Audio play blocked:", err));
      
      saveState({ ...s, timerRunning: false, alarmPlayed: true });
    }
  }

  const m = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const text = `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  
  const el = document.getElementById("timerValue");
  if (el) {
    el.textContent = text;
  }
}

setInterval(render, 100);

window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) render();
});

syncChannel.onmessage = (e) => {
  if (e.data.type === "SYNC") render();
};

render();