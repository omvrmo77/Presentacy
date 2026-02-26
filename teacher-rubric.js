const API_URL =
  "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

function getScoreSelect(id) {
  const el = document.getElementById(id);
  const n = parseInt(el ? el.value : "", 10);
  if (isNaN(n)) return 1;
  return Math.min(4, Math.max(1, n)); // clamp 1–4
}

function getListeningSelect(id) {
  const el = document.getElementById(id);
  const n = parseInt(el ? el.value : "", 10);
  if (isNaN(n)) return 0;
  return Math.min(2, Math.max(-2, n)); // clamp -2..2
}

async function loadStudents() {
  const status = document.getElementById("status");
  const sel = document.getElementById("studentSelect");

  if (!sel) return;
  if (status) status.textContent = "Loading students...";

  try {
    const res = await fetch(`${API_URL}?action=students`, { cache: "no-store" });
    const data = await res.json();

    if (!data.ok) {
      if (status) status.textContent = "Failed to load students: " + (data.error || "");
      return;
    }

    sel.innerHTML = "";

    // ✅ Backend returns: {id,name,username,class}
    data.students.forEach((s) => {
      const id = String((s && (s.id || s.studentId)) || "").trim();
      const name = String((s && (s.name || s.studentName)) || "").trim();
      if (!id && !name) return;

      const opt = document.createElement("option");
      opt.value = id || name; // prefer id
      opt.textContent = id ? `${name} (${id})` : name;
      opt.dataset.name = name;
      opt.dataset.id = id;
      sel.appendChild(opt);
    });

    if (status) status.textContent = "";
  } catch (err) {
    if (status) status.textContent = "Error loading students: " + err;
  }
}

async function submitRubric() {
  const status = document.getElementById("status");
  if (status) status.textContent = "Saving...";

  const teacher = (document.getElementById("teacherName")?.value || "").trim();
  const teacherKey = (document.getElementById("teacherKey")?.value || "").trim();

  const week = (document.getElementById("week")?.value || "").trim(); // if you have a week input
  const topic = (document.getElementById("topic")?.value || "").trim();

  const sel = document.getElementById("studentSelect");
  if (!sel || !sel.value) {
    if (status) status.textContent = "Please select a student.";
    return;
  }

  const studentId = String(sel.options[sel.selectedIndex].dataset.id || sel.value || "").trim();
  const studentName = String(sel.options[sel.selectedIndex].dataset.name || "").trim();

  // ✅ Your Apps Script doPost(e) expects:
  // teacherKey, week, student (name), studentId, topic, teacher, and rubric fields
  const payload = {
    teacherKey,
    teacher,
    week,
    student: studentName,     // ✅ IMPORTANT: backend uses p.student
    studentId,                // ✅ backend uses p.studentId
    topic,

    bodyLanguageFacial: getScoreSelect("bodyLanguageFacial"),
    eyeContact:         getScoreSelect("eyeContact"),
    intonation:         getScoreSelect("intonation"),
    preparation:        getScoreSelect("preparation"),
    visualAids:         getScoreSelect("visualAids"),
    timeManagement:     getScoreSelect("timeManagement"),
    fluency:            getScoreSelect("fluency"),
    languageAccuracy:   getScoreSelect("languageAccuracy"),
    pronunciation:      getScoreSelect("pronunciation"),
    listening:          getListeningSelect("listening"),
  };

  try {
    // ✅ Send as FORM ENCODED so Apps Script e.parameter works
    const form = new URLSearchParams();
    Object.keys(payload).forEach((k) => form.append(k, payload[k]));

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: form.toString(),
    });

    const text = await res.text();

    // If you later change backend to return JSON, this will still work:
    try {
      const data = JSON.parse(text);
      if (!data.ok) {
        if (status) status.textContent = "Error: " + (data.error || "Unknown error");
        return;
      }
      if (status) status.textContent = `Saved ✅ Total score = ${data.total ?? ""}`;
      return;
    } catch (_) {
      // Backend currently returns HTML ("Rubric saved ✅")
      if (status) status.textContent = "Saved ✅";
      return;
    }
  } catch (err) {
    if (status) status.textContent = "Error saving rubric: " + err;
  }
}

// Run when the page is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadStudents();
  const btn = document.getElementById("saveRubricButton");
  if (btn) btn.addEventListener("click", submitRubric);
});
