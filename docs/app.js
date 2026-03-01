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

    cell += c;
  }

  if (cell.length || row.length) { row.push(cell); rows.push(row); }

  const rawHeaders = (rows.shift() || []);
  const headers = rawHeaders.map(h => String(h).replace(/^\uFEFF/, "").trim());

  return rows
    .filter(r => r.length && r.some(x => String(x).trim() !== ""))
    .map(r => Object.fromEntries(headers.map((h, idx) => [h, String(r[idx] ?? "").trim()])));
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

// ===== Ask logic for runner.html =====
window.askQuestion = function(question) {
  const el = document.getElementById("askAnswer");
  if (!el) return;
else if (q.includes("form") || q.includes("form code") || q === "pf" || q === "p" || q === "f") {
  answer = `
Form code is a shorthand summary of how a horse finished in recent runs.

Common examples:
P = Pulled up (did not finish)
F = Fell
U = Unseated rider
R = Refused
B = Brought down
RO = Ran out

So “PF” means: Pulled up, then fell.
  `.trim();
}
  const q = String(question || "").trim().toLowerCase();
  if (!q) {
    el.textContent = "Type a question, or tap one of the prompts above.";
    return;
  }
