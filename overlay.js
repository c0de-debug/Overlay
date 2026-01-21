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
};

function loadState() {
  const raw = localStorage.getItem("osis_state");
  if (!raw) return { ...DEFAULTS };
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function formatInt(n) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function clampPct(p) {
  return Math.max(0, Math.min(100, p));
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function render() {
  const s = loadState();

  setText("titleText", s.titleText);
  setText("schoolText", s.schoolText);
  setText("statusText", s.statusText);

  // Background labels
  document.querySelectorAll(".paslon-label.p1").forEach(el => el.textContent = s.p1No);
  document.querySelectorAll(".paslon-label.p2").forEach(el => el.textContent = s.p2No);

  setText("p1Name", s.p1Name);
  setText("p2Name", s.p2Name);

  const v1 = Math.max(0, Number(s.p1Votes) || 0);
  const v2 = Math.max(0, Number(s.p2Votes) || 0);
  const total = v1 + v2;

  const p1 = total === 0 ? 0 : (v1 / total) * 100;
  const p2 = total === 0 ? 0 : (v2 / total) * 100;

  setText("p1Votes", `${formatInt(v1)} suara`);
  setText("p2Votes", `${formatInt(v2)} suara`);
  setText("p1Pct", `${Math.round(p1)}%`);
  setText("p2Pct", `${Math.round(p2)}%`);

  const dummyTotalVoters = 1000;
  const entryPct = Math.min(100, (total / dummyTotalVoters) * 100);
  setText("totalEntryPct", `${entryPct.toFixed(1)}%`); 
}

function tickClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  setText("tickerTime", `${hh}:${mm}`);
}

window.addEventListener("storage", (e) => {
  if (e.key === "osis_state") render();
});

render();
tickClock();
setInterval(tickClock, 1000);
setInterval(render, 300);
