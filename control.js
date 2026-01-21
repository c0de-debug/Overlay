const STORAGE_KEY = "osis_state";

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
}

function getEl(id) {
  return document.getElementById(id);
}

function hydrateForm() {
  const s = loadState();
  for (const id of FIELDS) {
    const el = getEl(id);
    if (!el) continue;
    el.value = s[id] ?? "";
  }
}

function bindInputs() {
  for (const id of FIELDS) {
    const el = getEl(id);
    if (!el) continue;

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
})();
