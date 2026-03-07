const supabaseClient = getSupabaseClient();

function extractStudentName(row) {
  if (!row || typeof row !== "object") return "";
  return String(
    row.name ||
    row.full_name ||
    row.student_name ||
    row.student ||
    ""
  ).trim();
}

async function loadStudentsList() {
  const dataList = document.getElementById("studentsList");
  if (!dataList) return;

  try {
    const { data, error } = await supabaseStudentsClient
      .from("students")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Failed to load students:", error);
      return;
    }

    dataList.innerHTML = "";

    (data || []).forEach(function (row) {
      const name = extractStudentName(row);
      if (!name) return;

      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      dataList.appendChild(option);
    });
  } catch (err) {
    console.error("Unexpected students load error:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadStudentsList);
