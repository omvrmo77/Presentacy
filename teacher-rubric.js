const rubricSupabase = getSupabaseClient();

let ALL_STUDENTS = [];

function ensureStatusEl() {
  let status = document.getElementById("status");
  if (!status) {
    status = document.createElement("div");
    status.id = "status";
    status.className = "hint";
    status.style.marginTop = "10px";
    const form = document.getElementById("rubrics-form");
    if (form) form.appendChild(status);
  }
  return status;
}

function setStatus(message, isError) {
  const status = ensureStatusEl();
  status.textContent = message || "";
  status.style.color = isError ? "#b00020" : "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickFirst(row, keys) {
  for (const key of keys) {
    if (
      row &&
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }
  return null;
}

function normalizeStudentRow(row) {
  if (!row || typeof row !== "object") return null;

  return {
    raw: row,
    id: pickFirst(row, [
      "studentId",
      "student_id",
      "Student ID",
      "id",
      "uuid",
      "user_id"
    ]),
    username: pickFirst(row, [
      "username",
      "user_name",
      "student_username"
    ]),
    name: pickFirst(row, [
      "studentName",
      "student_name",
      "name",
      "full_name",
      "student"
    ]),
    className: pickFirst(row, [
      "class",
      "Class",
      "grade",
      "Grade",
      "class_name",
      "className"
    ])
  };
}

function getStudentStorageId(student) {
  return String(student?.id || "").trim();
}

function getStudentLoginKey(student) {
  return String(student?.username || "").trim();
}

async function loadAllStudents() {
  const primary = await rubricSupabase
    .from("Students")
    .select("*")
    .order("studentName", { ascending: true });

  if (!primary.error) {
    return (primary.data || []).map(normalizeStudentRow).filter(Boolean);
  }

  const fallback = await rubricSupabase
    .from("students")
    .select("*")
    .order("studentName", { ascending: true });

  if (fallback.error) {
    throw new Error(fallback.error.message || "Could not load students.");
  }

  return (fallback.data || []).map(normalizeStudentRow).filter(Boolean);
}

function getUniqueClasses(students) {
  const set = new Set();

  (students || []).forEach((student) => {
    const value = String(student.className || "").trim();
    if (value) set.add(value);
  });

  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
  );
}

function fillClassDropdown() {
  const classSelect = document.getElementById("studentClass");
  if (!classSelect) return;

  const classes = getUniqueClasses(ALL_STUDENTS);

  classSelect.innerHTML =
    `<option value="">Choose class…</option>` +
    classes
      .map((cls) => `<option value="${escapeHtml(cls)}">${escapeHtml(cls)}</option>`)
      .join("");
}

function fillStudentDropdown(selectedClass) {
  const studentSelect = document.getElementById("student");
  if (!studentSelect) return;

  const filtered = (ALL_STUDENTS || [])
    .filter(
      (student) =>
        String(student.className || "").trim() === String(selectedClass || "").trim()
    )
    .sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || ""), undefined, {
        sensitivity: "base"
      })
    );

  if (!selectedClass) {
    studentSelect.innerHTML = `<option value="">Choose student…</option>`;
    studentSelect.disabled = true;
    return;
  }

  studentSelect.innerHTML =
    `<option value="">Choose student…</option>` +
    filtered
      .map((student) => {
        const value = getStudentStorageId(student);
        const name = String(student.name || "").trim() || "Unknown";
        const cls = String(student.className || "").trim();
        const login = getStudentLoginKey(student);
        const label = cls
          ? `${name} (${cls})${login ? ` - ${login}` : ""}`
          : `${name}${login ? ` - ${login}` : ""}`;

        return `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;
      })
      .join("");

  studentSelect.disabled = false;
}

function getSelectedStudent() {
  const studentSelect = document.getElementById("student");
  const studentKey = String(studentSelect?.value || "").trim();
  if (!studentKey) return null;

  return (
    ALL_STUDENTS.find(
      (student) => getStudentStorageId(student) === studentKey
    ) || null
  );
}

async function countStudentPresentations(student) {
  if (!student) return 0;

  const studentId = getStudentStorageId(student);
  if (!studentId) return 0;

  const tries = [
    async () =>
      rubricSupabase
        .from("Rubrics")
        .select("*", { count: "exact", head: true })
        .eq("Student ID", studentId),

    async () =>
      rubricSupabase
        .from("Rubrics")
        .select("*", { count: "exact", head: true })
        .eq("studentId", studentId),

    async () =>
      rubricSupabase
        .from("Rubrics")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId),

    async () =>
      rubricSupabase
        .from("rubrics")
        .select("*", { count: "exact", head: true })
        .eq("Student ID", studentId),

    async () =>
      rubricSupabase
        .from("rubrics")
        .select("*", { count: "exact", head: true })
        .eq("studentId", studentId),

    async () =>
      rubricSupabase
        .from("rubrics")
        .select("*", { count: "exact", head: true })
        .eq("student_id", studentId)
  ];

  for (const run of tries) {
    const result = await run();
    if (!result.error) {
      return Number(result.count || 0);
    }
  }

  return 0;
}

async function autoSelectWeek() {
  const weekSelect = document.getElementById("rubric-week");
  const weekHint = document.getElementById("weekHint");
  const student = getSelectedStudent();

  if (!weekSelect) return;

  if (!student) {
    weekSelect.value = "";
    if (weekHint) {
      weekHint.textContent =
        "Week will be chosen automatically after you choose the student.";
    }
    return;
  }

  setStatus("Checking previous presentations...", false);

  const previousCount = await countStudentPresentations(student);
  const nextWeek = Math.min(previousCount + 1, 15);

  weekSelect.value = String(nextWeek);

  if (weekHint) {
    if (previousCount === 0) {
      weekHint.textContent =
        "This student has no previous presentations yet, so Week 1 was selected.";
    } else {
      weekHint.textContent = `This student already has ${previousCount} presentation(s), so Week ${nextWeek} was selected automatically.`;
    }
  }

  setStatus("", false);
}

async function submitRubricsWithSupabase(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const teacher = String(formData.get("teacher") || "").trim() || "Mr. Omar";
  const teacherKey = String(formData.get("teacherKey") || "").trim();
  const topic = String(formData.get("topic") || "").trim();
  const week = Number(formData.get("week") || 0);

  const bodyLanguageFacial = Number(formData.get("bodyLanguageFacial") || 0);
  const eyeContact = Number(formData.get("eyeContact") || 0);
  const intonation = Number(formData.get("intonation") || 0);
  const preparation = Number(formData.get("preparation") || 0);
  const visualAids = Number(formData.get("visualAids") || 0);
  const timeManagement = Number(formData.get("timeManagement") || 0);
  const fluency = Number(formData.get("fluency") || 0);
  const languageAccuracy = Number(formData.get("languageAccuracy") || 0);
  const pronunciation = Number(formData.get("pronunciation") || 0);
  const listening = Number(formData.get("listening") || 0);

  const total =
    bodyLanguageFacial +
    eyeContact +
    intonation +
    preparation +
    visualAids +
    timeManagement +
    fluency +
    languageAccuracy +
    pronunciation +
    listening;

  const student = getSelectedStudent();

  if (!student) {
    setStatus("Please choose the class first, then choose the student.", true);
    return;
  }

  const studentId = getStudentStorageId(student);
  const studentDisplayName = String(student.name || "").trim();

  if (!studentId || !studentDisplayName) {
    setStatus("This student record is incomplete.", true);
    return;
  }

  if (!week) {
    setStatus("Week was not selected.", true);
    return;
  }

  setStatus("Saving...", false);

  try {
    const { data, error } = await rubricSupabase.rpc(
      "submit_rubric_sheet_style_with_key",
      {
        p_teacher_key: teacherKey,
        p_week: week,
        p_student_id: studentId,
        p_student_name: studentDisplayName,
        p_topic: topic,
        p_body_language_facial: bodyLanguageFacial,
        p_eye_contact: eyeContact,
        p_intonation: intonation,
        p_preparation: preparation,
        p_visual_aids: visualAids,
        p_time_management: timeManagement,
        p_fluency: fluency,
        p_language_accuracy: languageAccuracy,
        p_pronunciation: pronunciation,
        p_listening: listening,
        p_total: total,
        p_teacher: teacher
      }
    );

    if (error) {
      console.error(error);
      setStatus(error.message || "Failed to save rubrics.", true);
      return;
    }

    if (data && typeof data === "object" && data.ok === false) {
      setStatus(data.error || "Wrong teacher code.", true);
      return;
    }

    setStatus("Saved ✅", false);

    const classValue = document.getElementById("studentClass")?.value || "";

    form.reset();

    const teacherInput = document.getElementById("teacher");
    if (teacherInput) teacherInput.value = "Mr. Omar";

    const classSelect = document.getElementById("studentClass");
    if (classSelect) classSelect.value = classValue;

    fillStudentDropdown(classValue);

    const studentSelect = document.getElementById("student");
    if (studentSelect) {
      studentSelect.value = "";
      studentSelect.focus();
    }

    const weekHint = document.getElementById("weekHint");
    if (weekHint) {
      weekHint.textContent =
        "Week will be chosen automatically after you choose the student.";
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Unexpected error while saving.", true);
  }
}

async function initTeacherRubricPage() {
  try {
    const teacherInput = document.getElementById("teacher");
    if (teacherInput) teacherInput.value = "Mr. Omar";

    ALL_STUDENTS = await loadAllStudents();
    fillClassDropdown();

    const classSelect = document.getElementById("studentClass");
    const studentSelect = document.getElementById("student");

    if (classSelect) {
      classSelect.addEventListener("change", () => {
        fillStudentDropdown(classSelect.value);

        const weekSelect = document.getElementById("rubric-week");
        const weekHint = document.getElementById("weekHint");

        if (weekSelect) weekSelect.value = "";
        if (weekHint) {
          weekHint.textContent =
            "Week will be chosen automatically after you choose the student.";
        }
      });
    }

    if (studentSelect) {
      studentSelect.addEventListener("change", autoSelectWeek);
    }

    const form = document.getElementById("rubrics-form");
    if (form) {
      form.addEventListener("submit", submitRubricsWithSupabase);
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Could not initialize the teacher rubric page.", true);
  }
}

window.addEventListener("DOMContentLoaded", initTeacherRubricPage);