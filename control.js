const STORAGE_KEY = "osis_state";
const syncChannel = new BroadcastChannel("osis_sync");

const DEFAULTS = {
  titleText: "PEMILIHAN KETUA OSIS",
  schoolText: "SMK BUNDA MULIA • 2026",
  statusText: "LIVE",

  p1No: "01",
  p1Name: "Nama Ketua • Nama Wakil",
  p1Votes: 0,

  p2No: "02",
  p2Name: "Nama Ketua • Nama Wakil",
  p2Votes: 0,

  tps: 0,

  sourceText: "Sumber: Panitia OSIS SMK Bunda Mulia",
  footerRightText: "Rekap sementara",

  timerRemaining: 0,
  timerTarget: 0,
  timerRunning: false,
};

const FIELDS = [
  "titleText",
  "schoolText",
  "statusText",
  "p1No",
  "p1Name",
  "p1Votes",
  "p2No",
  "p2Name",
  "p2Votes",
  "tps",
  "sourceText",
  "footerRightText",
  "timerRemaining",
  "timerTarget",
  "timerRunning",
];

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncChannel.postMessage({ type: "SYNC", state });
}

function getEl(id) {
  return document.getElementById(id);
}

function hydrateForm() {
  const s = loadState();
  for (const id of FIELDS) {
    const el = getEl(id);
    if (!el) continue;
    if (el.tagName === "INPUT" || el.tagName === "SELECT") {
      el.value = s[id] ?? "";
    }
  }
}

function bindInputs() {
  for (const id of FIELDS) {
    const el = getEl(id);
    if (!el || (id === "timerRemaining" || id === "timerTarget" || id === "timerRunning")) continue;

    el.addEventListener("input", () => {
      const s = loadState();
      if (el.type === "number") {
        s[id] = Math.max(0, Number(el.value || 0));
      } else {
        s[id] = el.value;
      }
      saveState(s);
    });
  }
}

function bumpValue(targetId, delta) {
  const input = getEl(targetId);
  if (!input) return;

  const cur = Math.max(0, Number(input.value || 0));
  const next = Math.max(0, cur + delta);

  input.value = String(next);
  input.dispatchEvent(new Event("input"));
}

function bindSteppers() {
  document.querySelectorAll(".step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      const delta = btn.classList.contains("plus") ? 1 : -1;
      bumpValue(targetId, delta);
    });
  });
}

function bindBumpButtons() {
  document.querySelectorAll("[data-bump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-bump");
      const amount = Number(btn.getAttribute("data-amount") || 0);
      if (!targetId || !amount) return;
      bumpValue(targetId, amount);
    });
  });
}

function bindTopButtons() {
  const demo = getEl("btnDemo");
  const reset = getEl("btnReset");

  if (demo) {
    demo.addEventListener("click", () => {
      saveState({
        ...DEFAULTS,
        p1Name: "Aldo • Nabila",
        p2Name: "Raka • Salsa",
        p1Votes: 412,
        p2Votes: 430,
        tps: 12,
        footerRightText: "Rekap sementara",
      });
      hydrateForm();
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      saveState({ ...DEFAULTS });
      hydrateForm();
    });
  }

  const syncTest = getEl("btnSyncTest");
  if (syncTest) {
    syncTest.addEventListener("click", () => {
      syncChannel.postMessage({ type: "TEST" });
    });
  }
}

// TIMER LOGIC
function renderTimerDisplay() {
  const s = loadState();
  let remaining = s.timerRemaining;

  if (s.timerRunning) {
    remaining = Math.max(0, Math.ceil((s.timerTarget - Date.now()) / 1000));
    if (remaining === 0 && s.timerRunning) {
        s.timerRunning = false;
        s.timerRemaining = 0;
        saveState(s);
    }
  }

  const m = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const text = `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  const el = getEl("timerDisplay");
  if (el) el.textContent = text;
}

function bindTimerControls() {
  const btnSet = getEl("btnSetTimer");
  const btnStart = getEl("btnStartTimer");
  const btnStop = getEl("btnStopTimer");
  const btnReset = getEl("btnResetTimer");

  const syncInputsToState = () => {
    const min = Number(getEl("inputTimerMin").value || 0);
    const sec = Number(getEl("inputTimerSec").value || 0);
    const s = loadState();
    s.timerRemaining = min * 60 + sec;
    s.timerRunning = false;
    saveState(s);
    return s;
  };

  if (btnSet) {
    btnSet.addEventListener("click", () => {
      syncInputsToState();
      renderTimerDisplay();
    });
  }

  if (btnStart) {
    btnStart.addEventListener("click", () => {
      // Auto-set from inputs before starting
      const s = syncInputsToState();
      if (s.timerRemaining > 0) {
        s.timerTarget = Date.now() + s.timerRemaining * 1000;
        s.timerRunning = true;
        saveState(s);
      }
    });
  }

  if (btnStop) {
    btnStop.addEventListener("click", () => {
      const s = loadState();
      if (s.timerRunning) {
        s.timerRemaining = Math.max(0, Math.ceil((s.timerTarget - Date.now()) / 1000));
        s.timerRunning = false;
        saveState(s);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener("click", () => {
      const s = loadState();
      s.timerRemaining = 0;
      s.timerRunning = false;
      saveState(s);
      renderTimerDisplay();
    });
  }
}

// init
(function init() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    saveState({ ...DEFAULTS });
  }
  hydrateForm();
  bindInputs();
  bindSteppers();
  bindBumpButtons();
  bindTopButtons();
  bindTimerControls();
  
  setInterval(renderTimerDisplay, 100);

  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      hydrateForm();
      renderTimerDisplay();
    }
  });

  syncChannel.onmessage = (e) => {
    if (e.data.type === "SYNC") {
      hydrateForm();
      renderTimerDisplay();
    }
  };

  // Display Origin for Debugging
  const note = document.querySelector(".bottom-note");
  if (note) {
      const originInfo = document.createElement("div");
      originInfo.id = "originDisplay";
      originInfo.style.fontSize = "10px";
      originInfo.style.marginTop = "8px";
      originInfo.style.opacity = "0.5";
      originInfo.textContent = `Sync Origin: ${window.location.origin}`;
      note.appendChild(originInfo);
  }
})();
