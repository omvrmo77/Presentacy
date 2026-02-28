const API_URL =
  "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

/**
 * Loads students into a <datalist id="studentsList"> for autocomplete input.
 * Expects backend: { ok:true, students:[{id,name,username,class}, ...] }
 */
async function loadStudentsList() {
  const dataList = document.getElementById("studentsList");
  if (!dataList) return;

  try {
    const res = await fetch(`${API_URL}?action=students`, { cache: "no-store" });
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Could not parse JSON from students API:", text);
      return;
    }

    if (!data.ok || !Array.isArray(data.students)) {
      console.error("Students API error:", data);
      return;
    }

    // Clear old options
    dataList.innerHTML = "";

    data.students.forEach((s) => {
      // Backend uses: {id,name,...}
      const name = String((s && (s.name || s.studentName)) || "").trim();
      if (!name) return;

      const opt = document.createElement("option");
      opt.value = name; // user types / sees full name
      opt.textContent = name;
      dataList.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load students", err);
  }
}

window.addEventListener("DOMContentLoaded", loadStudentsList);