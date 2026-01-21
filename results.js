const STORAGE_KEY = "osis_state";

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function formatInt(n) {
    return new Intl.NumberFormat("id-ID").format(n);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function render() {
    const s = loadState();
    if (!s) return;

    // Header Info
    setText("titleText", s.titleText);
    setText("schoolText", s.schoolText);
    setText("statusText", s.statusText);
    setText("tpsCount", s.tps);

    // Paslon Numbers
    setText("p1No", s.p1No);
    setText("p2No", s.p2No);

    // Names
    setText("p1Name", s.p1Name);
    setText("p2Name", s.p2Name);

    // Votes & Logic
    const v1 = Math.max(0, Number(s.p1Votes) || 0);
    const v2 = Math.max(0, Number(s.p2Votes) || 0);
    const total = v1 + v2;

    const p1Pct = total === 0 ? 0 : (v1 / total) * 100;
    const p2Pct = total === 0 ? 0 : (v2 / total) * 100;

    // Update Text
    setText("p1Votes", formatInt(v1));
    setText("p2Votes", formatInt(v2));
    setText("totalVotes", formatInt(total));
    setText("p1Pct", `${Math.round(p1Pct)}%`);
    setText("p2Pct", `${Math.round(p2Pct)}%`);

    // Update Bars
    const bar1 = document.getElementById("p1Bar");
    const bar2 = document.getElementById("p2Bar");
    if (bar1) bar1.style.width = `${p1Pct}%`;
    if (bar2) bar2.style.width = `${p2Pct}%`;

    // Winner Highlight
    const card1 = document.getElementById("cardP1");
    const card2 = document.getElementById("cardP2");

    if (total > 0) {
        if (v1 > v2) {
            card1.classList.add("winner");
            card2.classList.remove("winner");
        } else if (v2 > v1) {
            card2.classList.add("winner");
            card1.classList.remove("winner");
        } else {
            card1.classList.remove("winner");
            card2.classList.remove("winner");
        }
    } else {
        card1.classList.remove("winner");
        card2.classList.remove("winner");
    }
}

// Initial render
render();

// Watch for changes in localStorage
window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) render();
});

// Periodic check (optional, but good for local dev without storage events across same-origin tabs)
setInterval(render, 1000);
