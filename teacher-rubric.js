// ✅ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const API_URL = "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

function getScoreSelect(id) {
  const value = document.getElementById(id).value;
  const n = parseInt(value, 10);
  if (isNaN(n)) return 1;
  return Math.min(4, Math.max(1, n)); // clamp 1–4
}

function getListeningSelect(id) {
  const value = document.getElementById(id).value;
  const n = parseInt(value, 10);
  if (isNaN(n)) return 0;
  return Math.min(2, Math.max(-2, n)); // clamp -2..2
}

async function loadStudents() {
  const status = document.getElementById("status");
  status.textContent = "Loading students...";

  try {
    const res = await fetch(`${API_URL}?action=students`);
    const data = await res.json();

    if (!data.ok) {
      status.textContent = "Failed to load students: " + (data.error || "");
      return;
    }

    const sel = document.getElementById("studentSelect");
    sel.innerHTML = "";

    data.students.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.studentId;
      opt.textContent = `${s.studentName} (${s.studentId})`;
      opt.dataset.name = s.studentName;
      sel.appendChild(opt);
    });

    status.textContent = "";
  } catch (err) {
    status.textContent = "Error loading students: " + err;
  }
}

async function submitRubric() {
  const status = document.getElementById("status");
  status.textContent = "Saving...";

  const teacher = document.getElementById("teacherName").value.trim();
  const teacherKey = document.getElementById("teacherKey").value.trim();

  const sel = document.getElementById("studentSelect");
  if (!sel.value) {
    status.textContent = "Please select a student.";
    return;
  }

  const studentId = sel.value;
  const studentName = sel.options[sel.selectedIndex].dataset.name;
  const topic = document.getElementById("topic").value.trim();

  const payload = {
    action: "submit_rubric",
    teacherKey,
    teacher,
    studentId,
    studentName,
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
    listening:          getListeningSelect("listening")
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!data.ok) {
      status.textContent = "Error: " + (data.error || "Unknown error");
      return;
    }

    status.textContent = `Saved ✅ Total score = ${data.total}`;
  } catch (err) {
    status.textContent = "Error saving rubric: " + err;
  }
}

// Run when the page is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadStudents();
  const btn = document.getElementById("saveRubricButton");
  if (btn) {
    btn.addEventListener("click", submitRubric);
  }
});