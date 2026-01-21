const STORAGE_KEY = "osis_state";
const syncChannel = new BroadcastChannel("osis_sync");

const DEFAULTS = {
  timerRemaining: 0,
  timerTarget: 0,
  timerRunning: false,
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

function render() {
  const s = loadState();
  let remaining = s.timerRemaining || 0;

  if (s.timerRunning) {
    const diff = Math.ceil((s.timerTarget - Date.now()) / 1000);
    remaining = Math.max(0, diff);
  }

  const m = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const text = `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  
  const el = document.getElementById("timerValue");
  if (el) {
    el.textContent = text;
  }
}

// Update frequently for smooth countdown
setInterval(render, 100);

// Listen for changes from other tabs
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    render();
  }
});

syncChannel.onmessage = (e) => {
  if (e.data.type === "SYNC") {
    render();
  }
};

// Initial render
render();

// Debugging for OBS
console.log("Timer loaded on origin:", window.location.origin);
