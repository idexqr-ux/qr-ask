async function loadCSV(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const text = await res.text();

// Fix: some exports wrap EACH WHOLE ROW in quotes, making it a 1-column CSV.
// If a line starts/ends with a quote and does NOT contain '","', strip the outer quotes.
const fixedText = text
  .split(/\r?\n/)
  .map(line => {
    const s = line.trim();
    if (s.startsWith('"') && s.endsWith('"') && s.includes(",") && !s.includes('","')) {
      return s.slice(1, -1);
    }
    return line;
  })
  .join("\n");

return parseCSV(fixedText);
}

function parseCSV(text) {
  const firstLine = (text.split(/\r?\n/).find(l => l.trim().length) || "");
  const delimiter = (firstLine.includes("\t") && !firstLine.includes(",")) ? "\t" : ",";

  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && inQuotes && next === '"') { cell += '"'; i++; continue; }
    if (c === '"') { inQuotes = !inQuotes; continue; }

    if (c === delimiter && !inQuotes) { row.push(cell); cell = ""; continue; }

    if ((c === "\n" || c === "\r") && !inQuotes) {
      if (cell.length || row.length) { row.push(cell); rows.push(row); }
      cell = ""; row = [];
      if (c === "\r" && next === "\n") i++;
      continue;
    }
       
function qs(name) {
  return new URLSearchParams(location.search).get(name);
}
// ===== Ask logic for runner.html =====
window.askQuestion = function(question) {
  const el = document.getElementById("askAnswer");
  if (!el) return;

  const q = String(question || "").trim().toLowerCase();
  if (!q) {
    el.textContent = "Type a question, or tap one of the prompts above.";
    return;
  }

  let answer = "";

  // 1) Distance conversion: 1m 4f
  if (q.includes("modern distance") || q.includes("1 mile 4 furlongs") || q.includes("1m 4f") || q.includes("1m4f")) {
    answer = `
1 mile 4 furlongs is approximately 2.4 kilometres.

1 mile equals 1.609 km.
1 furlong equals 201 metres.
Four furlongs add roughly 804 metres.

Together, that makes just over 2.4 km.

For context, that’s around a steady 12–15 minute jog for many recreational runners,
or a brisk 25–30 minute walk.
    `.trim();
  }

  // 2) Dam's sire explanation (with your improved nuance)
  else if (q.includes("dam's sire") || q.includes("dams sire") || q.includes("maternal grandfather")) {
    answer = `
The dam (mother) may not have raced, and in many cases may never have raced.

The dam’s sire — the maternal grandfather — was usually a proven racehorse.

Traits such as stamina, speed tendencies, physical type, and temperament
can influence performance across generations.

Listing the dam’s sire provides deeper insight into inherited characteristics,
especially when the dam herself may never have raced.
    `.trim();
  }

  // Fallback
  else {
    answer = "I don’t have a saved answer for that yet — try one of the prompts above.";
  }

  el.textContent = answer;
};
