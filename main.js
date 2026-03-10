
// ============================
// 2. AUTH HELPERS (LOGIN DATA)
// ============================

const PRESENTACY_USER_KEY = "presentacy_current_user";

function presentacySetCurrentUser(account) {
  if (!account) return;

  const data = {
    username: (account.username || "").trim().toLowerCase(),
    name: account.name || "",
    class: account.class || "",
    studentId: account.studentId || "",
    password: account.password || "",
    role: account.role || "student"
  };

  try {
    localStorage.setItem(PRESENTACY_USER_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Could not save user", e);
  }
}

function presentacyGetCurrentUser() {
  try {
    const raw = localStorage.getItem(PRESENTACY_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Could not read user", e);
    return null;
  }
}

function applyRoleBasedNav() {
  let currentUser = null;
  try {
    currentUser =
      typeof presentacyGetCurrentUser === "function"
        ? presentacyGetCurrentUser()
        : null;
  } catch (e) {
    currentUser = null;
  }

  const teacherLink = document.querySelector('[data-nav="teacher-rubrics"]');

  if (teacherLink) {
    // Show only for teachers
    if (!currentUser || currentUser.role !== "teacher") {
      teacherLink.style.display = "none";
    } else {
      teacherLink.style.display = "";
    }
  }
}

function presentacyLogout() {
  try {
    localStorage.removeItem(PRESENTACY_USER_KEY);
  } catch (e) {
    // ignore
  }
  window.location.href = "login.html";
}

function setupLogoutButton() {
  const logoutLink = document.getElementById("logout-link");
  if (!logoutLink) return;
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    presentacyLogout();
  });
}

// ============================
// 3. LOGIN PAGE LOGIC
// ============================

async function initPresentacyLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const errorEl = document.getElementById("login-error");

  const existing = presentacyGetCurrentUser();
  if (existing) {
    window.location.href = "index.html";
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = (usernameInput.value || "").trim().toLowerCase();
    const password = (passwordInput.value || "").trim();

    if (!username || !password) {
      if (errorEl) errorEl.textContent = "Please fill both username and password.";
      return;
    }

    if (errorEl) errorEl.textContent = "Logging in...";

    try {
      const supabase = getSupabaseClient();
      let account = null;

      // STUDENTS TABLE
      {
        const { data, error } = await supabase
          .from("Students")
          .select("*")
          .eq("username", username)
          .limit(1);

        if (error) {
          console.error("Students login error:", error);
        } else if (Array.isArray(data) && data.length > 0) {
          const row = data[0];
          const dbPassword = String(row.studentId ?? "").trim();

          if (dbPassword === password) {
            account = {
  username: String(row.username || "").trim().toLowerCase(),
  name: String(row.studentName || row["Student Name"] || row.username || "").trim(),
  class: String(row.Class || row.class || row.grade || row.class_name || "").trim(),
  studentId: String(row.studentId || "").trim(),
  password: String(row.studentId || "").trim(),
  role: "student"
};
          }
        }
      }

      // TEACHERS TABLE
      if (!account) {
        const { data, error } = await supabase
          .from("Teachers")
          .select("*")
          .eq("username", username)
          .limit(1);

        if (error) {
          console.error("Teachers login error:", error);
        } else if (Array.isArray(data) && data.length > 0) {
          const row = data[0];
          const dbPassword = String(row.password ?? "").trim();

          if (dbPassword === password) {
            account = {
              username: String(row.username || "").trim().toLowerCase(),
              name: String(row.name || row.teacherName || row.username || "").trim(),
              class: "",
              role: "teacher"
            };
          }
        }
      }

      if (!account) {
        if (errorEl) errorEl.textContent = "Username or password is wrong. Try again.";
        return;
      }

      if (errorEl) errorEl.textContent = "";
      presentacySetCurrentUser(account);
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      if (errorEl) {
        errorEl.textContent = err.message || "Login failed.";
      }
    }
  });
}

/**
 * Fetch scores from the spreadsheet backend and merge into STUDENTS.
 * Expected JSON shape:
 * [
 *   { "username": "ahassan", "week1": 25, "week2": 18 },
 *   { "username": "jahmed",  "week1": 20 },
 *   ...
 * ]
 */
async function loadScoresFromAPI() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("Rubrics")
    .select("*");

  if (error) {
    console.error("Supabase rubrics load failed:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

async function loadStudentsFromSupabase() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("Students")
    .select("username, studentId, studentName, Class");

  if (error) {
    console.error("Supabase students load failed:", error);
    return [];
  }

  return (Array.isArray(data) ? data : []).map((row) => ({
    username: String(row.username || "").trim().toLowerCase(),
    studentId: String(row.studentId || "").trim(),
    password: String(row.studentId || "").trim(),
    name: String(row.studentName || row.username || "").trim(),
    class: String(row.Class || "").trim(),
    role: "student",
    scores: {}
  }));
}

function normalizeStudentUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeStudentName(value) {
  return String(value || "").trim();
}

function getStudentUsername(student) {
  return normalizeStudentUsername(
    student.username ||
    student.user_name ||
    student.student_id ||
    student.id
  );
}

function getRubricUsername(row) {
  return normalizeStudentUsername(
    row["Student ID"] ||
    row.studentId ||
    row.student_id ||
    row.student_username ||
    row.username ||
    row.user_name
  );
}

function getStudentClassName(student) {
  return String(
    student.Class ||
    student.class ||
    student.grade ||
    student.class_name ||
    ""
  ).trim();
}

function getRubricWeek(row) {
  return Number(
    row.week ||
    row.week_no ||
    row.week_number ||
    0
  ) || 0;
}

function getRubricTotal(row) {
  return Number(
    row.total ||
    row.total_points ||
    row.score ||
    row.points ||
    0
  ) || 0;
}

function getRubricUsername(row) {
  return normalizeStudentUsername(
    row["Student ID"] ||
    row.studentId ||
    row.student_id ||
    row.student_username ||
    row.username ||
    row.user_name
  );
}

function getRubricStudentName(row) {
  return normalizeStudentName(
    row["Student Name"] ||
    row.studentName ||
    row.student_name ||
    row.name ||
    row.full_name
  );
}

function cloneStudentRecord(student) {
  const cloned = JSON.parse(JSON.stringify(student));
  cloned.scores = {};
  return cloned;
}

function mergeFrontendStudentsWithRubrics(frontendStudents, rubricRows) {
  const merged = (frontendStudents || []).map(cloneStudentRecord);

  const byUsername = new Map();
  const byStudentId = new Map();

  merged.forEach((student) => {
    const username = normalizeStudentUsername(student.username);
    const studentId = String(student.studentId || student.password || "").trim();

    if (username) {
      byUsername.set(username, student);
    }

    if (studentId) {
      byStudentId.set(studentId, student);
    }
  });

  (rubricRows || []).forEach((row) => {
    const rubricStudentId = String(
      row["Student ID"] ||
      row.studentId ||
      row.student_id ||
      ""
    ).trim();

    const week = getRubricWeek(row);
    const total = getRubricTotal(row);

    if (!rubricStudentId || !week) return;

    let student = byStudentId.get(rubricStudentId);

    if (!student) {
      student = {
        name: getRubricStudentName(row) || rubricStudentId,
        username: "",
        studentId: rubricStudentId,
        password: "",
        class: "",
        role: "student",
        scores: {}
      };

      merged.push(student);
      byStudentId.set(rubricStudentId, student);
    }

    if (!student.scores || typeof student.scores !== "object") {
      student.scores = {};
    }

    student.scores["week" + week] = total;

    if (!student.name) {
      student.name = getRubricStudentName(row) || student.username || rubricStudentId;
    }
  });

  return merged;
}

async function getMergedStudentsData() {
  const [studentsFromSupabase, rubricRows] = await Promise.all([
    loadStudentsFromSupabase(),
    loadScoresFromAPI()
  ]);

  const baseStudents = Array.isArray(studentsFromSupabase)
  ? studentsFromSupabase
  : [];

return mergeFrontendStudentsWithRubrics(baseStudents, rubricRows);
}



// ============================
// 4. LEADERBOARD HELPERS
// ============================

// Sum of all weeks for leaderboard
function getTotalPoints(student) {
  if (!student || !student.scores) return 0;

  const apiTotal = Number(student.scores.totalPoints);
  if (Number.isFinite(apiTotal) && apiTotal > 0) return apiTotal;

  let total = 0;
  for (const [k, v] of Object.entries(student.scores)) {
    if (/^week\d+$/i.test(k)) {
      const n = Number(v);
      if (Number.isFinite(n)) total += n;
    }
  }
  return total;
}

function getBadgeForPoints(points) {
  if (points >= 100) return "Presentacy Star";
  if (points >= 85) return "Diamond Star";
  if (points >= 55) return "Golden Star";
  if (points >= 30) return "Silver Star";
  return "Rising Star";
}

function calculateBadge(points) {
  const label = getBadgeForPoints(points);
  let text = "";

  if (points >= 100) {
    text = "You are a Presentacy Star! Your talent, confidence, and hard work truly stand out.";
  } else if (points >= 85) {
    text = "You are a Diamond Star! A brilliant performance with confidence and skill.";
  } else if (points >= 55) {
    text = "You are a Golden Star! Your effort and progress are shining beautifully.";
  } else if (points >= 30) {
    text = "You are a Silver Star! You are growing stronger with every presentation.";
  } else if (points > 0) {
    text = "You are a Rising Star! Keep going—your journey is just beginning.";
  } else {
    text = "Your badge will appear after your first score.";
  }

  return { label, text };
}

// Build the leaderboard table (top 5) for whole school or for a class
async function renderLeaderboardTable(classFilter) {
  const tbody = document.getElementById("leaderboard-table-body");
  if (!tbody) return;

  const allStudents = await getMergedStudentsData();

  let pool =
    classFilter && classFilter !== ""
      ? allStudents.filter((s) => s.class === classFilter)
      : allStudents.slice();

  pool = pool.filter((s) => s.role !== "teacher");

  const withTotals = pool.map((s) => ({
    ...s,
    totalPoints: getTotalPoints(s)
  }));

  const nonZero = withTotals.filter((s) => s.totalPoints > 0);
  nonZero.sort((a, b) => b.totalPoints - a.totalPoints);

  const top = nonZero.slice(0, 5);

  tbody.innerHTML = top
    .map((student, index) => {
      const rank = index + 1;
      const rankClass =
        rank === 1
          ? "rank rank-1"
          : rank === 2
          ? "rank rank-2"
          : rank === 3
          ? "rank rank-3"
          : "rank";
      const badge = getBadgeForPoints(student.totalPoints);

      return `
        <tr>
          <td class="${rankClass}">${rank}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.totalPoints}</td>
          <td><span class="badge">${badge}</span></td>
        </tr>
      `;
    })
    .join("");

  if (top.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="font-size:0.85rem; color:var(--text-muted); padding:0.75rem;">
          No scores yet. The leaderboard will appear after the first presentations.
        </td>
      </tr>
    `;
  }
}

function getMotivationText(scoreWeek1) {
  const score = typeof scoreWeek1 === "number" ? scoreWeek1 : 0;

  if (score >= 28) {
    return "Amazing start! Keep this level and try to challenge yourself with harder topics.";
  } else if (score >= 20) {
    return "Great work. You have a solid base—focus on one skill (like eye contact or voice) to level up.";
  } else if (score > 0) {
    return "You’ve started the journey. Every presentation is practice—keep going and you will feel the difference.";
  } else {
    return "Your first score will appear here after your first presentation. Get ready to show us what you can do!";
  }
}

function getSortedWeekEntries(student) {
  const scores = student?.scores || {};

  return Object.entries(scores)
    .filter(([key]) => /^week\d+$/i.test(key))
    .sort((a, b) => {
      const numA = parseInt(String(a[0]).replace("week", ""), 10) || 0;
      const numB = parseInt(String(b[0]).replace("week", ""), 10) || 0;
      return numA - numB;
    });
}

function getLatestWeekEntry(student) {
  const entries = getSortedWeekEntries(student);
  return entries.length ? entries[entries.length - 1] : null;
}

function renderStudentResultCard(student, targetEl) {
  if (!targetEl) return;

  if (!student) {
    targetEl.innerHTML = `
      <p class="student-message">
        No matching student was found. Please check the name and class.
      </p>
    `;
    return;
  }

  const weekEntries = getSortedWeekEntries(student);
  const latestEntry = getLatestWeekEntry(student);
  const totalPoints = getTotalPoints(student);

  let presentationsHtml = "";

  if (!weekEntries.length) {
    presentationsHtml = `
      <div class="student-presentations-empty">
        <strong>Not Presented Yet</strong>
      </div>
    `;
  } else {
    presentationsHtml = weekEntries
      .map(([weekKey, score], index) => {
        const weekNumber = weekKey.replace("week", "");
        const label =
          index === 0
            ? "First presentation"
            : index === 1
            ? "Second presentation"
            : index === 2
            ? "Third presentation"
            : `Presentation ${index + 1}`;

        return `
          <div class="student-presentation-item">
            <div><strong>${label}</strong></div>
            <div>Week ${weekNumber}: <strong>${score}</strong> points</div>
          </div>
        `;
      })
      .join("");
  }

  targetEl.innerHTML = `
    <div class="student-result-card student-result-card--expanded">
      <button type="button" class="student-card-toggle" aria-expanded="true">
        <div class="student-card-toggle-head">
          <h3>${student.name}</h3>
          <span class="student-card-toggle-icon">▲</span>
        </div>

        <div class="student-meta">
          Class: ${student.class || "—"}
        </div>

        <div class="student-latest-score">
          ${
            latestEntry
              ? `Latest presentation: <strong>Week ${String(latestEntry[0]).replace("week", "")}</strong> — <strong>${latestEntry[1]}</strong> points`
              : `<strong>Not Presented Yet</strong>`
          }
        </div>

        <div class="student-total-score">
          Total points: <strong>${totalPoints}</strong>
        </div>
      </button>

      <div class="student-card-details is-open">
        ${presentationsHtml}
      </div>
    </div>
  `;

  const toggleBtn = targetEl.querySelector(".student-card-toggle");
  const detailsEl = targetEl.querySelector(".student-card-details");
  const iconEl = targetEl.querySelector(".student-card-toggle-icon");

  if (toggleBtn && detailsEl && iconEl) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = detailsEl.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      iconEl.textContent = isOpen ? "▲" : "▼";
    });
  }
}

function renderMultipleResults(list, term, selectedClassLabel, targetEl) {
  if (!targetEl) return;

  const classInfo =
    selectedClassLabel && selectedClassLabel !== ""
      ? ` in class <strong>${selectedClassLabel}</strong>`
      : "";

  const cards = list
    .map((student, index) => {
      const weekEntries = getSortedWeekEntries(student);
      const latestEntry = getLatestWeekEntry(student);
      const totalPoints = getTotalPoints(student);
      const detailsId = `student-details-${index}`;

      const presentationsHtml = weekEntries.length
        ? weekEntries
            .map(([weekKey, score], presentationIndex) => {
              const weekNumber = weekKey.replace("week", "");
              const label =
                presentationIndex === 0
                  ? "First presentation"
                  : presentationIndex === 1
                  ? "Second presentation"
                  : presentationIndex === 2
                  ? "Third presentation"
                  : `Presentation ${presentationIndex + 1}`;

              return `
                <div class="student-presentation-item">
                  <div><strong>${label}</strong></div>
                  <div>Week ${weekNumber}: <strong>${score}</strong> points</div>
                </div>
              `;
            })
            .join("")
        : `<div class="student-presentations-empty"><strong>Not Presented Yet</strong></div>`;

      return `
        <div class="student-result-card student-result-card--collapsible">
          <button type="button" class="student-card-toggle" data-details-id="${detailsId}" aria-expanded="false">
            <div class="student-card-toggle-head">
              <h3>${student.name}</h3>
              <span class="student-card-toggle-icon">▼</span>
            </div>

            <div class="student-meta">
              Class: ${student.class || "—"}
            </div>

            <div class="student-latest-score">
              ${
                latestEntry
                  ? `Latest presentation: <strong>Week ${String(latestEntry[0]).replace("week", "")}</strong> — <strong>${latestEntry[1]}</strong> points`
                  : `<strong>Not Presented Yet</strong>`
              }
            </div>

            <div class="student-total-score">
              Total points: <strong>${totalPoints}</strong>
            </div>
          </button>

          <div class="student-card-details" id="${detailsId}">
            ${presentationsHtml}
          </div>
        </div>
      `;
    })
    .join("");

  targetEl.innerHTML = `
    <div style="margin-bottom:0.4rem; font-size:0.85rem; color:var(--text-muted);">
      We found ${list.length} students matching "<strong>${term}</strong>"${classInfo}.
      Click any card to see all presentations.
    </div>
    <div class="student-multi-results">
      ${cards}
    </div>
  `;

  const toggleButtons = targetEl.querySelectorAll(".student-card-toggle");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const detailsId = btn.getAttribute("data-details-id");
      const detailsEl = detailsId ? targetEl.querySelector(`#${detailsId}`) : null;
      const iconEl = btn.querySelector(".student-card-toggle-icon");
      if (!detailsEl || !iconEl) return;

      const isOpen = detailsEl.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      iconEl.textContent = isOpen ? "▲" : "▼";
    });
  });
}

function renderNotFound(term, selectedClassLabel, targetEl) {
  if (!targetEl) return;
  const classInfo =
    selectedClassLabel && selectedClassLabel !== ""
      ? ` in class "<strong>${selectedClassLabel}</strong>"`
      : "";

  targetEl.innerHTML = `
    <div class="error-message">
      No student found with the name "<strong>${term}</strong>"${classInfo}. 
      Check your spelling or try your full name.
    </div>
  `;
}

// ============================
// 5. LEADERBOARD SEARCH MODES
// ============================

async function setupTeacherSearchOnLeaderboard() {
  const classFilter = document.getElementById("class-filter");
  const nameInput = document.getElementById("student-search-input");
  const searchBtn = document.getElementById("student-search-button");
  const resultEl = document.getElementById("student-result");

  if (!classFilter || !nameInput || !searchBtn || !resultEl) return;

  const allStudents = await getMergedStudentsData();

  classFilter.disabled = false;
  nameInput.disabled = false;
  searchBtn.disabled = false;
  searchBtn.textContent = "Search";

  searchBtn.addEventListener("click", () => {
    const selectedClass = classFilter.value.trim();
    const term = nameInput.value.trim();
    if (!term) {
      resultEl.innerHTML =
        '<p class="student-message">Please type a name to search.</p>';
      return;
    }

    const lowerTerm = term.toLowerCase();

    let pool = allStudents.filter((s) => s.role === "student");
    if (selectedClass) {
      pool = pool.filter((s) => s.class === selectedClass);
    }

    if (pool.length === 0) {
      renderNotFound(term, selectedClass, resultEl);
      return;
    }

    const exact = pool.find(
      (s) => String(s.name || "").toLowerCase() === lowerTerm
    );
    if (exact) {
      renderStudentResultCard(exact, resultEl);
      return;
    }

    const startsWith = pool.filter((s) => {
      const n = String(s.name || "").toLowerCase();
      return n === lowerTerm || n.startsWith(lowerTerm + " ");
    });

    if (startsWith.length === 1) {
      renderStudentResultCard(startsWith[0], resultEl);
      return;
    } else if (startsWith.length > 1) {
      renderMultipleResults(startsWith, term, selectedClass, resultEl);
      return;
    }

    const broad = pool.filter((s) =>
      String(s.name || "").toLowerCase().includes(lowerTerm)
    );

    if (broad.length === 1) {
      renderStudentResultCard(broad[0], resultEl);
    } else if (broad.length > 1) {
      renderMultipleResults(broad, term, selectedClass, resultEl);
    } else {
      renderNotFound(term, selectedClass, resultEl);
    }
  });
}

async function setupStudentViewOnLeaderboard(currentUser) {
  const searchSection = document.getElementById("student-search");
  const resultEl = document.getElementById("student-result");

  if (!searchSection || !resultEl) return;

  const titleEl = searchSection.querySelector("h1");
  const infoPara = searchSection.querySelector("p");
  const searchRow = searchSection.querySelector(".search-row");

  if (searchRow) {
    searchRow.style.display = "none";
  }

  if (titleEl) {
    titleEl.textContent = "Your Presentacy Score";
  }

  if (infoPara) {
    infoPara.textContent = `This card shows your score for each week, ${currentUser.name}.`;
  }

  const allStudents = await getMergedStudentsData();

  const me = allStudents.find(
    (s) =>
      (s.username || "").trim().toLowerCase() ===
      (currentUser.username || "").trim().toLowerCase()
  );

  if (!me) {
    resultEl.innerHTML = `
      <p class="student-message">
        You are logged in as <strong>${currentUser.name}</strong>,
        but we couldn’t find your data. Please tell your teacher.
      </p>
    `;
    return;
  }

  resultEl.innerHTML = `
    <p class="student-message">
      Hi <strong>${me.name}</strong> (${me.class}) 👋  
      Here is your Presentacy score for each week:
    </p>
  `;

  renderStudentResultCard(me, resultEl);
}

function setupAnonymousViewOnLeaderboard() {
  const classFilter = document.getElementById("class-filter");
  const nameInput = document.getElementById("student-search-input");
  const searchBtn = document.getElementById("student-search-button");
  const resultEl = document.getElementById("student-result");

  if (!resultEl) return;

  if (classFilter) classFilter.disabled = true;
  if (nameInput) {
    nameInput.disabled = true;
    nameInput.placeholder = "Log in to see your own score.";
  }
  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.textContent = "Login required";
  }

  resultEl.innerHTML = `
    <p class="student-message">
      Please log in on this device if you want to see your own score.
    </p>
  `;
}

async function initLeaderboardPage() {
  const leaderboardBody = document.getElementById("leaderboard-table-body");
  const leaderboardClassFilter = document.getElementById("leaderboard-class-filter");
  if (!leaderboardBody) return;

  await renderLeaderboardTable("");

  if (leaderboardClassFilter) {
    leaderboardClassFilter.addEventListener("change", async () => {
      const cls = leaderboardClassFilter.value || "";
      await renderLeaderboardTable(cls);
    });
  }

  const currentUser = presentacyGetCurrentUser();

  if (!currentUser) {
    setupAnonymousViewOnLeaderboard();
    return;
  }

  if (currentUser.role === "teacher") {
    await setupTeacherSearchOnLeaderboard();
  } else {
    await setupStudentViewOnLeaderboard(currentUser);
  }
}

// ============================
// 5.5 MY SCORES PAGE (student view with rubrics)
// ============================
const SUPABASE_URL = "https://ifrfqwzhsgedsxqcnjqj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_qtHdGfV0k1DEFntuxIBCAA_kTmgZPGr";

const PRESENTACY_TABLES = Object.freeze({
  RUBRICS: "Rubrics",
  STUDENTS: "Students",
  TEACHERS: "Teachers",
  WORDLE_WINS: "WordleWins"
});

if (typeof window !== "undefined") {
  window.PRESENTACY_TABLES = PRESENTACY_TABLES;
}

let presentacySupabaseClient = null;

function getSupabaseClient() {
  if (presentacySupabaseClient) return presentacySupabaseClient;

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    throw new Error("Supabase library is not loaded.");
  }

  presentacySupabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  return presentacySupabaseClient;
}

// ============================
// 6. NAVBAR + HOME + GENERATOR + WALL
// ============================

function setupNavHighlight() {
  const currentPage = document.body.dataset.page;
  const links = document.querySelectorAll("[data-page-link]");
  links.forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("nav-link--active");
    }
  });
}

let mobileNavInitialized = false;

function setupMobileNav() {
  if (mobileNavInitialized) return; // prevent adding the listener twice
  mobileNavInitialized = true;

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-links--open");
  });
}

function renderUserGreeting() {
  const greetingEl = document.getElementById("user-greeting");
  if (!greetingEl) return;

  const user = presentacyGetCurrentUser();
  if (!user) {
    greetingEl.textContent = "";
    return;
  }

  const fullName = user.name || "";
  const firstName = fullName.split(" ")[0] || fullName;

  const hour = new Date().getHours();
  let prefix = "Welcome";
  if (hour < 12) {
    prefix = "Good morning";
  } else if (hour < 18) {
    prefix = "Good afternoon";
  } else {
    prefix = "Good evening";
  }

  greetingEl.textContent = `${prefix}, ${firstName}!`;
}

function initHomePage() {
  const quoteEl = document.getElementById("presentacy-quote");
  const challengeEl = document.getElementById("presentacy-challenge");

  if (!quoteEl || !challengeEl) return;

  const quotes = [
    "Every time you speak, you get 1% better.",
    "Your voice matters more than your mistakes.",
    "Confidence is just practice wearing a costume.",
    "The audience wants you to win, not fail.",
    "A strong start is good, but a clear ending is magic.",
    "If you’re nervous, that means you care. Use it.",
    "Fluency grows when you keep talking, not when you’re perfect."
  ];

  const challenges = [
    "In your next presentation, try to look at three different people in the room.",
    "Choose one key word and say it a little slower and stronger than the others.",
    "Start your next talk with a question instead of “Today I will talk about…”.",
    "Use one new word from your vocabulary notebook in your next presentation.",
    "Try not to read for 10 seconds: just look up and speak from your head.",
    "Add one short personal story to your next presentation.",
    "End your next talk with one clear sentence that starts with “So in the end…”."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomChallenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  quoteEl.textContent = randomQuote;
  challengeEl.textContent = randomChallenge;
}

function initGeneratorPage() {
  const topicButton = document.getElementById("topic-button");
  const topicLikeButton = document.getElementById("topic-like-button");
  const topicOutput = document.getElementById("topic-output");
  const topicIdeas = document.getElementById("topic-ideas");

  if (!topicButton || !topicOutput) return;

  // ========= 1. WHO IS THE STUDENT? =========
  const currentUser =
    (typeof presentacyGetCurrentUser === "function" &&
      presentacyGetCurrentUser()) ||
    null;

  let firstName = "";
  if (currentUser) {
    if (typeof getFirstName === "function") {
      firstName = getFirstName(currentUser.name || currentUser.username);
    } else {
      firstName = (currentUser.name || currentUser.username || "")
        .split(" ")[0];
    }
  }

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  // Initial message
  if (firstName) {
    topicOutput.textContent =
      'Hi ' +
      firstName +
      '! Press "Give me another topic" to get started.';
  } else {
    topicOutput.textContent =
      'Press "Give me another topic" to get your first topic.';
  }

  // ========= 2. TOPICS LIST (more interesting ones) =========
  const topicGenresUpper = {
  history: [
    "The first iPhone and how it changed phones",
    "The history of cars: from the first car to today",
    "The history of the internet",
    "The history of football",
    "The history of the airplane",
    "The history of the Olympic Games",
    "How Egypt changed through history",
    "The story of ancient pyramids",
    "The history of writing",
    "The history of schools"
  ],

  science: [
    "Why do volcanoes erupt?",
    "Why do we dream?",
    "How does the human brain work?",
    "Why is the sky blue?",
    "How do airplanes fly?",
    "How do vaccines help us?",
    "What would happen if gravity disappeared?",
    "The science of sleep",
    "How does the heart work?",
    "Why is water important for life?"
  ],

  technology: [
    "The first iPhone and how it changed technology",
    "Artificial intelligence in our lives",
    "Robots in the future",
    "Electric cars vs petrol cars",
    "How social media changes people",
    "The most useful app for students",
    "A cool invention that changed our lives",
    "How video games have changed over time",
    "If I could design a new app",
    "The future of smart homes"
  ],

  interesting: [
    "The most mysterious place in the world",
    "A strange fact that sounds fake but is true",
    "The most interesting animal in the world",
    "The world 100 years from now",
    "If humans lived on Mars",
    "A job that might disappear in the future",
    "The most surprising invention ever",
    "A famous unsolved mystery",
    "A place in nature I would love to visit",
    "If I could travel to the future"
  ],

  opinion: [
    "Should homework be banned?",
    "Social media: helpful or harmful?",
    "Fast food: good or bad?",
    "Should students wear school uniforms?",
    "Should school start later in the morning?",
    "Are exams the best way to measure students?",
    "Should children have phones at school?",
    "Is online learning better than classroom learning?",
    "Should video games be limited?",
    "Is technology making us lazy?"
  ],

  people: [
    "What makes a good friend",
    "Why teamwork is important",
    "A person from history I would like to meet",
    "A scientist I admire",
    "A leader who changed the world",
    "A time when I helped someone",
    "A famous person who inspires me",
    "The kindest person in my life",
    "If I could meet any famous person",
    "What makes someone a hero?"
  ],

  school: [
    "One rule I would add to our school",
    "One small change that could improve our classroom",
    "What makes a great teacher",
    "The perfect school trip",
    "My ideal classroom",
    "How to make school more fun",
    "Why school presentations are important",
    "A subject that should be added to school",
    "Should students choose some of their subjects?",
    "The best way to learn English"
  ]
};

  // ========= 2.1 LEVEL TOGGLE (Grades 1–3 vs 4–9) =========

// Young topics (Grades 1–3): very simple, personal, easy
const topicsYoung = [
  "My weekend",
  "My family",
  "My best friend",
  "My favourite food",
  "My favourite animal",
  "My favourite toy or game",
  "My favourite cartoon",
  "A place I like to go",
  "What makes me happy",
  "My favourite school day"
];

// Upper topics (Grades 4–9): your existing list + NEW topics
const topicsUpper = Object.values(topicGenresUpper).flat();

// Active pool state
let topicLevel = "upper"; // "young" | "upper"
let selectedGenre = "all";

// ========= UI: add Level Buttons (Young / Upper) =========
if (document.getElementById("presentacy-grade-controls")) return;
const controls = document.createElement("div");
controls.id = "presentacy-grade-controls";
controls.style.display = "flex";
controls.style.gap = "0.5rem";
controls.style.flexWrap = "wrap";
controls.style.margin = "0.75rem 0 0.5rem";

controls.innerHTML = `
  <button type="button" id="level-young" class="primary-button secondary-button"
    style="padding:0.35rem 0.9rem; font-size:0.85rem;">
    👶 Grades 1–3
  </button>
  <button type="button" id="level-upper" class="primary-button"
    style="padding:0.35rem 0.9rem; font-size:0.85rem;">
    🧠 Grades 4–9
  </button>
  <span class="myscores-muted" id="level-label" style="align-self:center;">
    Current: Grades 4–9
  </span>
`;

// Put controls right above the topic output text
topicOutput.parentElement.insertBefore(controls, topicOutput);

const youngBtn = document.getElementById("level-young");
const upperBtn = document.getElementById("level-upper");
const levelLabel = document.getElementById("level-label");

const genreControls = document.createElement("div");
genreControls.id = "presentacy-genre-controls";
genreControls.style.display = "flex";
genreControls.style.flexWrap = "wrap";
genreControls.style.gap = "0.5rem";
genreControls.style.margin = "0.25rem 0 0.75rem";

genreControls.innerHTML = `
  <button type="button" class="primary-button genre-button" data-genre="all" style="padding:0.35rem 0.9rem; font-size:0.85rem;">🎲 All</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="history" style="padding:0.35rem 0.9rem; font-size:0.85rem;">📜 History</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="science" style="padding:0.35rem 0.9rem; font-size:0.85rem;">🔬 Science</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="technology" style="padding:0.35rem 0.9rem; font-size:0.85rem;">💻 Technology</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="interesting" style="padding:0.35rem 0.9rem; font-size:0.85rem;">🌍 Interesting</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="opinion" style="padding:0.35rem 0.9rem; font-size:0.85rem;">💭 Opinion</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="people" style="padding:0.35rem 0.9rem; font-size:0.85rem;">🧑 People</button>
  <button type="button" class="primary-button secondary-button genre-button" data-genre="school" style="padding:0.35rem 0.9rem; font-size:0.85rem;">🏫 School</button>
`;

topicOutput.parentElement.insertBefore(genreControls, topicOutput);

const genreButtons = document.querySelectorAll(".genre-button");

function updateGenreButtons() {
  genreButtons.forEach((btn) => {
    if (btn.dataset.genre === selectedGenre) {
      btn.classList.remove("secondary-button");
    } else {
      btn.classList.add("secondary-button");
    }
  });
}

genreButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedGenre = btn.dataset.genre || "all";
    updateGenreButtons();
    pickRandomTopic();
  });
});

updateGenreButtons();

function setLevel(level) {
  topicLevel = level;

  if (topicLevel === "young") {
    youngBtn.classList.remove("secondary-button");
    upperBtn.classList.add("secondary-button");
    levelLabel.textContent = "Current: Grades 1–3";

    selectedGenre = "all";
    if (genreControls) genreControls.style.display = "none";
  } else {
    upperBtn.classList.remove("secondary-button");
    youngBtn.classList.add("secondary-button");
    levelLabel.textContent = "Current: Grades 4–9";

    if (genreControls) genreControls.style.display = "flex";
  }

  pickRandomTopic();
}

youngBtn.addEventListener("click", () => setLevel("young"));
upperBtn.addEventListener("click", () => setLevel("upper"));

function getActiveTopics() {
  if (topicLevel === "young") {
    return topicsYoung;
  }

  if (selectedGenre === "all") {
    return topicsUpper;
  }

  return topicGenresUpper[selectedGenre] || topicsUpper;
}

  let currentTopic = "";

  function clearTopicIdeas() {
    if (!topicIdeas) return;
    topicIdeas.innerHTML = "";
    topicIdeas.classList.remove("topic-ideas--visible");
  }

  function pickRandomTopic() {
  const pool = getActiveTopics();
  const randomTopic = pool[Math.floor(Math.random() * pool.length)];
  currentTopic = randomTopic;
  clearTopicIdeas();

  if (firstName) {
    const greeting = getTimeGreeting();
    topicOutput.textContent =
      greeting + ", " + firstName + '! How about you talk about "' + randomTopic + '"?';
  } else {
    topicOutput.textContent = randomTopic;
  }
}

  // ========= 3. PRESENTATION STRUCTURE (what you already liked) =========
  function getPresentationGuide(topic) {
    const lower = topic.toLowerCase();

    // Hobby
    if (lower.includes("hobby")) {
      return {
        category: "Favourite hobby",
        hook: [
          "Guess what I love doing in my free time…",
          "When I have some free time, there is one thing I always want to do."
        ],
        structure: [
          "Say the name of the hobby and how you discovered it.",
          "Explain where/when you do it and if you do it alone or with others.",
          "Describe what you actually do, step by step.",
          "Explain how it makes you feel and why it is important to you."
        ],
        ideas: [
          "Who taught you this hobby or how you learned it.",
          "A funny or special memory connected to this hobby.",
          "What you need (equipment, place, people).",
          "How this hobby could help your future or your skills."
        ],
        phrases: [
          "In my free time, I really enjoy…",
          "I started this hobby when…",
          "One thing I love about it is…",
          "That’s why this hobby is a big part of my life."
        ]
      };
    }

    // School / classroom
    if (
      lower.includes("school") ||
      lower.includes("classroom") ||
      lower.includes("rule")
    ) {
      return {
        category: "School life",
        hook: [
          "Let me take you on a tour of my school day.",
          "School is more than just lessons and homework for me."
        ],
        structure: [
          "Introduce your school and which grade you are in.",
          "Describe a normal day: morning, lessons, breaks.",
          "Talk about one subject, activity or teacher you really like.",
          "Mention one thing you would improve and why."
        ],
        ideas: [
          "Describe the atmosphere in your class (quiet, noisy, friendly…).",
          "Talk about a special event at school (trip, show, project).",
          "Explain how school helps you build your future.",
          "Say how you feel at the end of a school day."
        ],
        phrases: [
          "A typical day at my school starts when…",
          "One of my favourite things about my school is…",
          "If I could change one thing, it would be…",
          "School is important to me because…"
        ]
      };
    }

    // Travel / place / Mars
    if (
      lower.includes("place") ||
      lower.includes("visit") ||
      lower.includes("travel") ||
      lower.includes("mars") ||
      lower.includes("future")
    ) {
      return {
        category: "Travel & places",
        hook: [
          "Close your eyes and imagine you are with me in this place.",
          "There is one place I will never forget."
        ],
        structure: [
          "Say where the place is and when you visited (or want to visit).",
          "Describe what you saw, heard, smelt or tasted.",
          "Explain who you were with and what you did together.",
          "Tell why this place is special for you."
        ],
        ideas: [
          "Describe the weather, colours and sounds around you.",
          "A small story that happened during the trip.",
          "How you felt when you arrived and when you left.",
          "Would you recommend this place to others? Why?"
        ],
        phrases: [
          "I still remember the moment when…",
          "One thing that surprised me was…",
          "If you ever go there, you should definitely…",
          "That’s why this place is unforgettable for me."
        ]
      };
    }

    // Friends / teamwork
    if (lower.includes("friend") || lower.includes("team")) {
      return {
        category: "Friends & teamwork",
        hook: [
          "We all need people around us – let me tell you about mine.",
          "I understood the real meaning of friendship when…"
        ],
        structure: [
          "Give your own definition of a good friend or good team.",
          "Introduce one friend or one team you are part of.",
          "Tell a short story where this friend/team helped you or needed you.",
          "Explain what you learned from this experience."
        ],
        ideas: [
          "How you met this friend / joined this team.",
          "What makes this friend or team special (kind, funny, honest…).",
          "How you solve problems or conflicts together.",
          "Why friendship or teamwork is important in life."
        ],
        phrases: [
          "For me, a real friend is someone who…",
          "We worked together and…",
          "This showed me that…",
          "That’s why I am grateful for my friends / my team."
        ]
      };
    }

    // Life lessons / helping / mistakes
    if (
      lower.includes("helped") ||
      lower.includes("mistake") ||
      lower.includes("learned") ||
      lower.includes("time when")
    ) {
      return {
        category: "Life lessons",
        hook: [
          "There is one moment in my life that taught me something important.",
          "Let me tell you a short story that changed me."
        ],
        structure: [
          "Set the scene: when and where did it happen?",
          "Introduce the people who were there.",
          "Explain what happened step by step.",
          "Say what you learned from this moment."
        ],
        ideas: [
          "How you felt during the situation.",
          "What you would do differently now.",
          "How this lesson helps you today.",
          "Why this memory stayed in your mind."
        ],
        phrases: [
          "At first, I thought that…",
          "Then something unexpected happened…",
          "In the end, I realised that…",
          "Since that day, I always remember…"
        ]
      };
    }

    

    /* =======================
   PRESENTACY TOPIC PACK (25 topics)
   Paste this into main.js where your topic generator topics live.
   If you already have a TOPICS array, you can do:
   TOPICS.push(...NEW_PRESENTACY_TOPICS);
   ======================= */

   

const NEW_PRESENTACY_TOPICS = [
  {
    title: "Cars: from the first engine to today",
    info: {
      hook: [
        "Cars aren’t just “transport”—they changed cities, jobs, travel, and even how people live.",
        "This topic lets you mix history + brands + safety + future tech in one presentation."
      ],
      keyFacts: [
        "The first practical automobile is usually credited to Karl Benz (Benz Patent-Motorwagen) in 1885–1886.",
        "Early cars were rare and expensive; mass production made them common.",
        "Ford popularized assembly-line mass production for cars (Model T era), making cars affordable for more people.",
        "BMW was founded in 1916 (as an aircraft-engine company). The first BMW car is commonly cited as the BMW 3/15 in 1929 (BMW took over Dixi and produced the 3/15).",
        "Mercedes-Benz as a brand formed in 1926 (merger of Daimler-Motoren-Gesellschaft and Benz & Cie.).",
        "Toyota Motor Corporation dates to 1937; it later became famous for reliability and efficient production.",
        "Today, big changes include electric cars, hybrids, driver-assist systems, and smarter safety tech."
      ],
      talkingPoints: [
        "What a car is (engine/motor, transmission, brakes, steering, safety systems).",
        "How cars evolved: steam → gasoline → diesel → hybrid → electric.",
        "Famous brands and what they’re known for (examples below).",
        "Safety: seatbelts, airbags, ABS, ESC, crash tests—how they save lives.",
        "Why people choose certain cars: price, fuel, reliability, maintenance, parts availability.",
        "Environmental impact: emissions, fuel economy, EV charging, recycling batteries.",
        "The future: self-driving levels, smart sensors, car-sharing, cleaner fuels."
      ],
      brandMiniCards: [
        { brand: "BMW", knownFor: "performance + driving feel", started: "Company founded 1916; first car era 1929 (BMW 3/15)" },
        { brand: "Mercedes-Benz", knownFor: "luxury + engineering + safety", started: "Brand formed 1926; Benz’s first car 1885–86" },
        { brand: "Ford", knownFor: "mass production + popular models", started: "Company founded 1903" },
        { brand: "Toyota", knownFor: "reliability + efficiency", started: "Company founded 1937" },
        { brand: "Honda", knownFor: "efficient engines + motorcycles + cars", started: "Company founded 1948" },
        { brand: "Tesla", knownFor: "EVs + software features", started: "Company founded 2003" }
      ],
      vocabulary: [
        "engine / motor", "horsepower", "torque", "fuel economy", "hybrid", "electric vehicle (EV)",
        "battery", "charging", "transmission", "ABS", "airbags", "stability control", "autopilot/driver assist",
        "emissions", "maintenance", "warranty"
      ],
      questionsToAnswer: [
        "What makes a car ‘good’ for a student/family?",
        "Which matters more: brand name or reliability?",
        "Are electric cars better for the environment in our country right now?",
        "What safety feature do you think is the most important—and why?"
      ],
      miniOutline: [
        "1) Quick intro: why cars matter",
        "2) Short history timeline (1886 → mass production → modern era)",
        "3) Brands & identity (what each brand is known for)",
        "4) Safety & rules (how cars protect people)",
        "5) Future (EVs, smarter tech) + your opinion"
      ],
      quickActivity: [
        "Show 3 car types (sedan/SUV/hatchback) and ask: which is best for a family of 5 and why?",
        "Ask the audience: ‘What’s one feature you cannot live without?’ (AC, safety, fuel economy, etc.)"
      ]
    }
  },

  {
    title: "My ‘future me’ message",
    info: {
      hook: ["Imagine you can send ONE voice note to yourself one year from now—what would you say?"],
      keyPoints: [
        "One skill I want stronger",
        "One habit I will stop",
        "One habit I will build",
        "One promise and why it matters",
        "One fear I want to defeat"
      ],
      vocabulary: ["goal", "habit", "discipline", "progress", "mindset", "challenge"],
      miniOutline: ["Intro → my life now → my plan → obstacles → message to future me"]
    }
  },

  {
    title: "If my school had one new rule",
    info: {
      hook: ["One small rule can change a whole school day."],
      keyPoints: [
        "The rule",
        "Why it helps students",
        "How teachers/parents might react",
        "Possible problems",
        "A simple fix"
      ],
      vocabulary: ["policy", "fair", "responsibility", "discipline", "respect"],
      miniOutline: ["Problem → new rule → benefits → concerns → conclusion"]
    }
  },

  {
    title: "The best teacher (without saying a name)",
    info: {
      hook: ["A great teacher doesn’t just teach a subject—they change confidence."],
      keyPoints: [
        "What they do differently",
        "A moment that proved it",
        "How it changed me",
        "How students can learn better with them"
      ],
      vocabulary: ["supportive", "encouraging", "feedback", "motivation", "growth"],
      miniOutline: ["Intro → story → what makes them great → lesson"]
    }
  },

  {
    title: "My ideal class: the perfect 45 minutes",
    info: {
      hook: ["If you could design one lesson that students actually love, what would it look like?"],
      keyPoints: [
        "Warm-up",
        "Main activity",
        "How we practice",
        "How we end the class",
        "Why it works"
      ],
      vocabulary: ["engaging", "interactive", "teamwork", "challenge", "reflection"],
      miniOutline: ["Intro → class plan → why it’s effective"]
    }
  },

  {
    title: "A time I improved at something",
    info: {
      hook: ["Improvement has a turning point—one moment where you decide to level up."],
      keyPoints: [
        "What I struggled with",
        "The turning point",
        "What I practiced",
        "The result",
        "The lesson"
      ],
      vocabulary: ["practice", "repeat", "fail", "improve", "confidence"],
      miniOutline: ["Before → turning point → practice → after → lesson"]
    }
  },

  {
    title: "A small invention I wish existed",
    info: {
      hook: ["If you could invent a tiny tool to fix one daily problem, what would it be?"],
      keyPoints: [
        "The problem",
        "The invention",
        "Who needs it",
        "How it works",
        "Why it matters"
      ],
      vocabulary: ["invent", "feature", "prototype", "solve", "design"],
      miniOutline: ["Problem → invention → how it works → impact"]
    }
  },

  {
    title: "My confidence ‘cheat code’",
    info: {
      hook: ["Confidence isn’t magic—it’s a system."],
      keyPoints: [
        "What confidence looks like",
        "What destroys confidence",
        "My 3-step routine",
        "A phrase I tell myself",
        "How to use it before a presentation"
      ],
      vocabulary: ["mindset", "body language", "voice", "practice", "calm"],
      miniOutline: ["Intro → problems → routine → example → conclusion"]
    }
  },

  {
    title: "If I had a school app",
    info: {
      hook: ["One app can save time for students, teachers, and parents."],
      keyPoints: [
        "Features for students",
        "Features for teachers",
        "Features for parents",
        "Safety/privacy idea",
        "What makes it easy to use"
      ],
      vocabulary: ["feature", "dashboard", "notifications", "privacy", "user-friendly"],
      miniOutline: ["Need → features → benefits → safety → wrap-up"]
    }
  },

  {
    title: "My favorite place in Egypt",
    info: {
      hook: ["A place can feel like a memory you can walk inside."],
      keyPoints: [
        "Where it is",
        "What you see/hear/smell",
        "A personal memory",
        "Why people should visit"
      ],
      vocabulary: ["atmosphere", "landmark", "culture", "crowded", "peaceful"],
      miniOutline: ["Intro → description → story → why it matters"]
    }
  },

  {
    title: "A rule I disagree with (respectfully)",
    info: {
      hook: ["You can disagree and still be respectful—and that’s a real skill."],
      keyPoints: [
        "The rule",
        "Why it exists",
        "Why it doesn’t work",
        "A better solution",
        "How to communicate it politely"
      ],
      vocabulary: ["respectfully", "reasonable", "solution", "improve", "suggest"],
      miniOutline: ["Rule → why → problem → solution → respectful ending"]
    }
  },

  {
    title: "The most useful skill for teenagers",
    info: {
      hook: ["One skill can make school, friends, and future jobs easier."],
      keyPoints: [
        "Choose the skill",
        "Why it matters now",
        "How to practice in a week",
        "What changes if you master it"
      ],
      vocabulary: ["communication", "discipline", "time management", "focus", "habits"],
      miniOutline: ["Pick skill → why → plan → results"]
    }
  },

  {
    title: "Handling stress before exams",
    info: {
      hook: ["Stress is normal—panic is optional."],
      keyPoints: [
        "What triggers my stress",
        "What makes it worse",
        "3 things that help",
        "A simple exam-week plan"
      ],
      vocabulary: ["stress", "panic", "schedule", "breaks", "sleep"],
      miniOutline: ["Triggers → problems → solutions → plan"]
    }
  },

  {
    title: "Upgrade my brain like a phone",
    info: {
      hook: ["If your brain had updates, what would you install today?"],
      keyPoints: [
        "New feature",
        "Bug I’d delete",
        "Storage I’d clean",
        "Battery-saving habits",
        "One app I’d keep forever (a skill)"
      ],
      vocabulary: ["upgrade", "bug", "reset", "focus", "habits"],
      miniOutline: ["Intro → upgrades → example day → conclusion"]
    }
  },

  {
    title: "A friendship I’m grateful for",
    info: {
      hook: ["Good friends don’t just make you laugh—they make you better."],
      keyPoints: [
        "What makes it special",
        "A story that shows it",
        "How we solve problems",
        "What I learned"
      ],
      vocabulary: ["trust", "support", "loyal", "honest", "conflict"],
      miniOutline: ["Intro → story → what I learned → thank-you ending"]
    }
  },

  {
    title: "A sport/game that teaches real life",
    info: {
      hook: ["Games are training for real life—teamwork, patience, and strategy."],
      keyPoints: [
        "The game",
        "How it works (quick)",
        "What it teaches",
        "A real example"
      ],
      vocabulary: ["strategy", "teamwork", "focus", "practice", "competition"],
      miniOutline: ["Intro → rules → life lesson → example"]
    }
  },

  {
    title: "A day without the internet",
    info: {
      hook: ["If the internet disappears for 24 hours… what happens to your life?"],
      keyPoints: [
        "What would be hard",
        "What would be peaceful",
        "What I’d do instead",
        "What I’d learn"
      ],
      vocabulary: ["offline", "bored", "creative", "connected", "peaceful"],
      miniOutline: ["Hard parts → good parts → new plan → lesson"]
    }
  },

  {
    title: "My dream school trip",
    info: {
      hook: ["Trips can teach lessons you never forget."],
      keyPoints: [
        "Where we go",
        "What we do",
        "What students learn",
        "How it builds memories",
        "Budget-friendly idea"
      ],
      vocabulary: ["trip", "experience", "explore", "learn", "team"],
      miniOutline: ["Destination → activities → learning → why it’s worth it"]
    }
  },

  {
    title: "A mistake I’m happy I made",
    info: {
      hook: ["Some mistakes are expensive—but they make you smarter forever."],
      keyPoints: [
        "The mistake",
        "What I felt",
        "What it taught me",
        "How it helped later"
      ],
      vocabulary: ["mistake", "lesson", "regret", "growth", "improve"],
      miniOutline: ["Story → feelings → lesson → advice"]
    }
  },

  {
    title: "The most underrated school subject",
    info: {
      hook: ["Some subjects look boring… until you realize they’re secretly powerful."],
      keyPoints: [
        "The subject",
        "Why people ignore it",
        "Why it matters",
        "How to make it fun"
      ],
      vocabulary: ["underrated", "useful", "skills", "practice", "real life"],
      miniOutline: ["Pick → why ignored → why important → improvements"]
    }
  },

  {
    title: "My perfect morning routine",
    info: {
      hook: ["The morning decides your mood. Your mood decides your day."],
      keyPoints: [
        "Wake up time (realistic)",
        "3 steps",
        "Busy-day version",
        "How it changes my mood"
      ],
      vocabulary: ["routine", "habit", "energy", "focus", "discipline"],
      miniOutline: ["Intro → routine → busy routine → results"]
    }
  },

  {
    title: "How to deal with bullying",
    info: {
      hook: ["Bullying grows in silence. It shrinks when people act smart and together."],
      keyPoints: [
        "What bullying looks like",
        "What not to do",
        "What to do (steps)",
        "How to support a friend"
      ],
      vocabulary: ["bullying", "support", "report", "safe", "confidence"],
      miniOutline: ["Define → wrong responses → right steps → support"]
    }
  },

  {
    title: "If I had 1 million pounds for my school",
    info: {
      hook: ["Money doesn’t fix everything, but smart spending can change everything."],
      keyPoints: [
        "3 priorities",
        "Why each matters",
        "Who benefits",
        "How to measure success"
      ],
      vocabulary: ["budget", "priority", "impact", "improve", "resources"],
      miniOutline: ["Intro → plan → impact → conclusion"]
    }
  },

  {
    title: "One thing I would teach every parent",
    info: {
      hook: ["Teenagers don’t need perfect parents—just parents who understand the basics."],
      keyPoints: [
        "The message",
        "Why teens need it",
        "What parents do wrong sometimes",
        "A better way"
      ],
      vocabulary: ["understand", "support", "pressure", "listen", "trust"],
      miniOutline: ["Message → why → common mistakes → better way"]
    }
  },

  {
    title: "My hero isn’t famous",
    info: {
      hook: ["Heroes aren’t always on TV. Sometimes they’re in your real life."],
      keyPoints: [
        "Who they are (role)",
        "What they do daily",
        "Why it inspires me",
        "What I want to copy"
      ],
      vocabulary: ["inspire", "example", "values", "hardworking", "kind"],
      miniOutline: ["Intro → description → story → lesson"]
    }
  },

  {
    title: "Presentations: how to make people listen",
    info: {
      hook: ["If people don’t listen, your ideas don’t land. Let’s fix that."],
      keyPoints: [
        "The biggest mistake",
        "A strong opening",
        "Body language tips",
        "Voice tips",
        "Ending with impact"
      ],
      vocabulary: ["hook", "pause", "intonation", "eye contact", "structure"],
      miniOutline: ["Mistakes → opening → delivery → ending"]
    }
  }
];

/* Optional: if your generator expects a simple array of titles, use this: */
const NEW_PRESENTACY_TOPIC_TITLES = NEW_PRESENTACY_TOPICS.map(t => t.title);

/* Optional: quick lookup by title */
const NEW_PRESENTACY_TOPIC_BY_TITLE = Object.fromEntries(
  NEW_PRESENTACY_TOPICS.map(t => [t.title.toLowerCase(), t])
);

    // Sports
    if (
      lower.includes("football") ||
      lower.includes("player") ||
      lower.includes("sport")
    ) {
      return {
        category: "Sports",
        hook: [
          "Sport is a big part of my life.",
          "Let me tell you about the sport that I really enjoy."
        ],
        structure: [
          "Introduce the sport or team and how you discovered it.",
          "Explain the basic rules in a simple way.",
          "Talk about your favourite team / player / match.",
          "Say why this sport is special for you."
        ],
        ideas: [
          "A special match or goal you remember.",
          "How sport teaches teamwork and discipline.",
          "How often you play or watch it.",
          "How sport helps your health or your mood."
        ],
        phrases: [
          "One match I will never forget is…",
          "What I admire about this player is…",
          "When I watch this sport, I feel…",
          "That’s why this sport is important to me."
        ]
      };
    }

    // Tech, games, social media, robots, apps
    if (
      lower.includes("video game") ||
      lower.includes("game") ||
      lower.includes("social media") ||
      lower.includes("app") ||
      lower.includes("robot")
    ) {
      return {
        category: "Technology & media",
        hook: [
          "Technology is everywhere in our lives.",
          "There is one app / game / website I use a lot."
        ],
        structure: [
          "Introduce the app / game / technology.",
          "Explain what you use it for and how it works in simple words.",
          "Talk about why you like it or what is dangerous about it.",
          "Give your opinion: is it good, bad, or depends on how we use it?"
        ],
        ideas: [
          "Screen time and how many hours per day is healthy.",
          "Online safety and being kind on the internet.",
          "How this technology makes life easier or harder.",
          "What the future with this technology might look like."
        ],
        phrases: [
          "One reason I like it is…",
          "However, there is also a problem:",
          "If we use it in a smart way, we can…",
          "In my opinion, the most important thing is…"
        ]
      };
    }

    // Food, fast food, health
    if (lower.includes("food")) {
      return {
        category: "Food & health",
        hook: [
          "We all eat every day, but today I want to talk about one type of food.",
          "There is one kind of food many people love, but it can be a problem too."
        ],
        structure: [
          "Introduce the type of food (fast food, traditional food, a dish).",
          "Explain why people like it so much.",
          "Talk about the good and bad effects on our health.",
          "Give your opinion and maybe a suggestion."
        ],
        ideas: [
          "Examples of fast food and what they contain.",
          "Difference between eating it sometimes and every day.",
          "Better choices you can make when you eat out.",
          "A healthy version of this food you could try."
        ],
        phrases: [
          "On the one hand,…",
          "On the other hand,…",
          "A simple change we can make is…",
          "I think balance is the key because…"
        ]
      };
    }

    // Default guide
    return {
      category: "Any topic",
      hook: [
        "Let me share my ideas about this topic.",
        "I chose this topic because it is close to my heart."
      ],
      structure: [
        "Start with one clear opening sentence that introduces the topic.",
        "Give 2–3 main ideas or reasons in the middle.",
        "Use an example or short story to make it real.",
        "Finish with one strong sentence that repeats your main message."
      ],
      ideas: [
        "Think of one real situation from your life connected to the topic.",
        "Explain your opinion and also the opposite opinion.",
        "Use connecting words: first, also, however, finally.",
        "Add feelings: how does this topic make you feel?"
      ],
      phrases: [
        "First of all, I believe…",
        "Another important point is…",
        "For example,…",
        "To sum up, I think…"
      ]
    };
  }

  function getTopicContentIdeas(topic) {
  const text = String(topic || "").trim();
  const lower = text.toLowerCase();

  // =========================
  // GRADES 1–3 (keep simple)
  // =========================
  if (text === "My weekend") {
    return {
      title: text,
      intro: "Use these ideas to talk about your weekend in a clear, simple way:",
      bullets: [
        "Say which days are your weekend and why you like them.",
        "Talk about one relaxing thing you usually do.",
        "Describe one place you often go on the weekend.",
        "Tell a story about a special weekend you remember.",
        "Explain how the weekend helps you feel ready for school again."
      ],
      extra: "Try to give one normal weekend example and one special weekend memory."
    };
  }

  if (text === "My family") {
    return {
      title: text,
      intro: "Here are ideas to help you talk about your family:",
      bullets: [
        "Say who is in your family.",
        "Describe one nice thing about each person.",
        "Talk about something you do together.",
        "Share a happy family memory.",
        "Explain why your family is important to you."
      ],
      extra: "You do not need to mention everyone. Choose the people closest to you."
    };
  }

  // =========================
  // HISTORY TOPICS
  // =========================
  if (text === "The first iPhone and how it changed phones") {
    return {
      title: text,
      intro: "These facts and ideas can help you build a strong presentation about the first iPhone:",
      bullets: [
        "The first iPhone was announced by Steve Jobs in 2007.",
        "It was special because it combined a phone, an iPod, and internet tools in one device.",
        "Its touchscreen design was very different from many phones with keyboards at that time.",
        "It changed how people used phones for photos, apps, music, and the internet.",
        "You can compare phones before the iPhone and after the iPhone to show its impact."
      ],
      extra: "A nice structure is: what phones were like before, what made the first iPhone special, and how it changed daily life."
    };
  }

  if (text === "The history of cars: from the first car to today") {
    return {
      title: text,
      intro: "Use these ideas to explain how cars changed over time:",
      bullets: [
        "The first cars were simple and slow compared with modern cars.",
        "Early cars were expensive, so not many people could own them.",
        "Over time, factories made cars faster and cheaper to produce.",
        "Cars changed travel, work, and how cities were built.",
        "Today cars include electric technology, better safety, and smart systems."
      ],
      extra: "You can divide your talk into three parts: early cars, the growth of famous car companies, and modern cars today."
    };
  }

  if (text === "The history of the internet") {
    return {
      title: text,
      intro: "These points can help you explain the internet in a simple but interesting way:",
      bullets: [
        "The internet started as a way for computers to share information.",
        "At first, only a small number of people and organizations used it.",
        "Later, websites, email, and search engines made it useful for everyone.",
        "The internet changed communication, education, shopping, and entertainment.",
        "Today it is a huge part of daily life, but it also brings problems like privacy and too much screen time."
      ],
      extra: "A good ending is to give your opinion: has the internet improved life more than it has harmed it?"
    };
  }

  if (text === "The history of football") {
    return {
      title: text,
      intro: "Here are simple ideas to help you talk about football history:",
      bullets: [
        "Football became one of the most popular sports in the world over many years.",
        "Rules were organized to make the game fair and clear.",
        "Big clubs, famous players, and international tournaments helped football spread globally.",
        "Football is not only a sport, but also a part of culture and identity in many countries.",
        "You can mention why football became more popular than many other sports."
      ],
      extra: "Try talking about rules, famous competitions, and why so many people love football."
    };
  }

  if (text === "The history of the airplane") {
    return {
      title: text,
      intro: "Use these points to explain the amazing development of airplanes:",
      bullets: [
        "Humans dreamed of flying for a very long time before airplanes were invented.",
        "The first successful airplanes were simple and small.",
        "Airplanes improved quickly in speed, size, and safety.",
        "They changed travel, trade, tourism, and even war.",
        "Modern airplanes connect people around the world in just hours."
      ],
      extra: "A clear talk could be: the dream of flying, the first airplanes, and how planes changed the world."
    };
  }

  if (text === "The history of the Olympic Games") {
    return {
      title: text,
      intro: "These ideas can help you speak about the Olympic Games:",
      bullets: [
        "The Olympic Games began in ancient times and were later brought back in the modern world.",
        "They bring athletes from many countries together.",
        "The Olympics are about competition, peace, and international friendship.",
        "Different sports were added over time, making the Games bigger and more exciting.",
        "The Olympics inspire young athletes and unite people around the world."
      ],
      extra: "You can compare the ancient Olympics with the modern Olympic Games."
    };
  }

  if (text === "How Egypt changed through history") {
    return {
      title: text,
      intro: "This topic is rich, so focus on the biggest changes in Egypt’s history:",
      bullets: [
        "Egypt has a very long history, from ancient civilization to modern times.",
        "It changed in language, architecture, government, and daily life.",
        "Ancient Egypt is famous for pyramids, temples, and strong rulers.",
        "Later periods brought new cultures, religions, and systems of life.",
        "Modern Egypt mixes history, tradition, and technology."
      ],
      extra: "A strong structure is: ancient Egypt, later historical periods, and modern Egypt today."
    };
  }

  if (text === "The story of ancient pyramids") {
    return {
      title: text,
      intro: "These points can help students speak confidently about the pyramids:",
      bullets: [
        "The pyramids are among the most famous monuments in the world.",
        "They were built in ancient Egypt and are connected to powerful rulers.",
        "They show amazing skill in engineering and planning.",
        "Many people still wonder exactly how the pyramids were built.",
        "The pyramids are an important symbol of Egyptian history and pride."
      ],
      extra: "A nice speaking plan is: what pyramids are, why they were built, and why they still amaze people today."
    };
  }

  if (text === "The history of writing") {
    return {
      title: text,
      intro: "Use these ideas to explain how writing changed human life:",
      bullets: [
        "Writing helped humans record information and share ideas across time.",
        "Early writing systems were very different from modern alphabets.",
        "Writing made education, history, trade, and government more organized.",
        "Over time, writing moved from stone and paper to screens and keyboards.",
        "Without writing, human knowledge would be much harder to save and pass on."
      ],
      extra: "You can finish by asking: how would the world be different without writing?"
    };
  }

  if (text === "The history of schools") {
    return {
      title: text,
      intro: "These points can help students talk about how schools developed:",
      bullets: [
        "Schools changed a lot from the past to the present.",
        "In the past, education was more limited and not available to everyone.",
        "Modern schools try to teach more subjects and more skills.",
        "Technology has changed classrooms, homework, and communication.",
        "Schools today prepare students for jobs, society, and life."
      ],
      extra: "A good idea is to compare old schools and modern schools."
    };
  }

  // =========================
  // SCIENCE TOPICS
  // =========================
  if (text === "Why do volcanoes erupt?") {
    return {
      title: text,
      intro: "These facts can help you explain volcanoes in a simple scientific way:",
      bullets: [
        "A volcano erupts when hot melted rock, called magma, rises from inside the Earth.",
        "Pressure builds up under the ground until the magma escapes.",
        "When magma comes out, it is called lava.",
        "Volcanoes can produce lava, ash, smoke, and gases.",
        "Some volcanoes are very dangerous, but they can also create new land and rich soil."
      ],
      extra: "A clear structure is: what a volcano is, why pressure builds up, and what happens during an eruption."
    };
  }

  if (text === "Why do we dream?") {
    return {
      title: text,
      intro: "Dreams are mysterious, but here are simple ideas students can use:",
      bullets: [
        "Dreams usually happen while we are sleeping.",
        "Scientists believe dreams may be connected to memory, emotions, and the brain’s activity.",
        "Some dreams are realistic, while others are strange or impossible.",
        "Dreams may help the brain organize thoughts and experiences.",
        "People still do not fully understand why we dream, which makes the topic interesting."
      ],
      extra: "This topic becomes stronger if the student adds one personal example of a strange or memorable dream."
    };
  }

  if (text === "How does the human brain work?") {
    return {
      title: text,
      intro: "These ideas can help explain the brain in a student-friendly way:",
      bullets: [
        "The brain controls thinking, memory, movement, emotions, and the senses.",
        "It sends and receives messages through the nervous system.",
        "Different parts of the brain have different jobs.",
        "The brain works all the time, even when we are asleep.",
        "A healthy brain needs sleep, good food, learning, and rest."
      ],
      extra: "A simple speaking order is: what the brain does, how it sends messages, and how we can keep it healthy."
    };
  }

  if (text === "Why is the sky blue?") {
    return {
      title: text,
      intro: "This is a great topic because the answer is short but interesting:",
      bullets: [
        "Sunlight looks white, but it contains many colors.",
        "When sunlight passes through the atmosphere, the light spreads out.",
        "Blue light spreads more than many other colors.",
        "That is why the sky often looks blue during the day.",
        "At sunset, the colors can change because the light travels through more air."
      ],
      extra: "The student can make the topic more exciting by comparing a blue sky with red or orange sunsets."
    };
  }

  if (text === "How do airplanes fly?") {
    return {
      title: text,
      intro: "Use these points to explain flight in a simple way:",
      bullets: [
        "Airplanes fly because of forces like lift, thrust, gravity, and drag.",
        "The wings are designed to help create lift.",
        "The engines push the airplane forward, which creates thrust.",
        "Pilots control speed, direction, and height using different parts of the plane.",
        "Modern airplanes use strong materials and advanced technology to fly safely."
      ],
      extra: "A good plan is: the four forces, the job of the wings, and the role of the engines."
    };
  }

  if (text === "How do vaccines help us?") {
    return {
      title: text,
      intro: "These facts help explain vaccines in a calm and clear way:",
      bullets: [
        "Vaccines help the body prepare to fight some diseases.",
        "They train the immune system to recognize harmful germs.",
        "Because of vaccines, many dangerous diseases have become less common.",
        "Vaccines protect both individuals and communities.",
        "This topic connects science with public health and daily life."
      ],
      extra: "A strong presentation can explain what vaccines do, why they matter, and how they help society."
    };
  }

  if (text === "What would happen if gravity disappeared?") {
    return {
      title: text,
      intro: "This is a fun science topic because it mixes facts and imagination:",
      bullets: [
        "Gravity keeps people, buildings, water, and air connected to Earth.",
        "Without gravity, objects and people would float away.",
        "The Moon and planets also depend on gravity in space.",
        "Life on Earth would completely change without it.",
        "This topic is great because students can mix real science with creative examples."
      ],
      extra: "The best way to present this topic is to begin with real science, then imagine daily life without gravity."
    };
  }

  if (text === "The science of sleep") {
    return {
      title: text,
      intro: "Use these ideas to explain why sleep is important:",
      bullets: [
        "Sleep helps the body and brain rest and recover.",
        "It is important for memory, learning, mood, and health.",
        "Lack of sleep can make people tired, unfocused, and stressed.",
        "Good sleep habits improve school performance and daily energy.",
        "Sleep is not wasted time; it is an important part of health."
      ],
      extra: "Students can make this topic stronger by giving advice for better sleep habits."
    };
  }

  if (text === "How does the heart work?") {
    return {
      title: text,
      intro: "These points can help students explain the heart clearly:",
      bullets: [
        "The heart is a powerful muscle inside the chest.",
        "Its main job is to pump blood around the body.",
        "Blood carries oxygen and nutrients where the body needs them.",
        "The heart works all day and night without stopping.",
        "Exercise and healthy habits help keep the heart strong."
      ],
      extra: "A good presentation order is: what the heart is, what blood does, and how to protect heart health."
    };
  }

  if (text === "Why is water important for life?") {
    return {
      title: text,
      intro: "This topic is easy to understand but full of strong ideas:",
      bullets: [
        "All living things need water to survive.",
        "Water is important for drinking, farming, cleaning, and industry.",
        "The human body needs water to stay healthy.",
        "Without clean water, life becomes difficult and dangerous.",
        "Protecting water is important for both people and the planet."
      ],
      extra: "A strong ending is to talk about saving water and not wasting it."
    };
  }

    // =========================
  // TECHNOLOGY TOPICS
  // =========================
  if (text === "The first iPhone and how it changed technology") {
    return {
      title: text,
      intro: "These ideas can help you explain why the first iPhone was so important in technology:",
      bullets: [
        "The first iPhone was introduced in 2007 and changed the smartphone industry.",
        "It combined a phone, music player, and internet device in one product.",
        "Its touchscreen design made phones feel more modern and easier to use.",
        "It helped make mobile apps a big part of daily life.",
        "After it appeared, many companies changed the way they designed phones."
      ],
      extra: "A strong way to present this topic is: technology before the iPhone, what made it special, and how it changed the future."
    };
  }

  if (text === "Artificial intelligence in our lives") {
    return {
      title: text,
      intro: "Use these facts and ideas to talk about artificial intelligence clearly:",
      bullets: [
        "Artificial intelligence means machines or programs doing tasks that normally need human thinking.",
        "AI is used in phones, search engines, maps, shopping apps, and online recommendations.",
        "It can help people save time and work more efficiently.",
        "AI is becoming more common in schools, medicine, and transportation.",
        "This topic is interesting because AI has both advantages and challenges."
      ],
      extra: "You can organize the topic into three parts: what AI is, where we use it, and whether it is always helpful."
    };
  }

  if (text === "Robots in the future") {
    return {
      title: text,
      intro: "These points can help students speak about future robots in an interesting way:",
      bullets: [
        "Robots may do more jobs in the future, especially dangerous or repetitive jobs.",
        "They can help in factories, hospitals, homes, and even space missions.",
        "Future robots may become smarter and more independent.",
        "Some people think robots will improve life, while others worry about jobs and control.",
        "This topic allows students to mix facts with imagination."
      ],
      extra: "A good plan is: what robots do now, what they may do in the future, and your opinion about that future."
    };
  }

  if (text === "Electric cars vs petrol cars") {
    return {
      title: text,
      intro: "Use these ideas to compare electric cars and petrol cars:",
      bullets: [
        "Petrol cars have been common for many years, but electric cars are becoming more popular.",
        "Electric cars can be quieter and may cause less pollution.",
        "Petrol cars are often easier to refuel quickly, while electric cars need charging.",
        "Technology is improving electric cars every year.",
        "This topic works well because students can compare advantages and disadvantages."
      ],
      extra: "An easy structure is: how each type works, the benefits of each one, and which one may be better for the future."
    };
  }

  if (text === "How social media changes people") {
    return {
      title: text,
      intro: "These points can help explain the influence of social media:",
      bullets: [
        "Social media changes how people communicate, share ideas, and spend free time.",
        "It can help people learn news, follow trends, and stay connected.",
        "It can also affect confidence, attention, and emotions.",
        "Some people use social media positively, while others are affected in unhealthy ways.",
        "This topic is strong because it connects technology with real life."
      ],
      extra: "A balanced presentation should include both positive and negative effects."
    };
  }

  if (text === "The most useful app for students") {
    return {
      title: text,
      intro: "These ideas can help students speak about useful apps:",
      bullets: [
        "Many apps help students organize homework, study, translate, or take notes.",
        "A useful app saves time and helps students learn better.",
        "Students can talk about apps for reading, planning, or practicing skills.",
        "Different students may prefer different apps depending on their needs.",
        "This topic becomes stronger when the student gives a real example."
      ],
      extra: "A nice way to present this is to name one app, explain what it does, and say why it helps students."
    };
  }

  if (text === "A cool invention that changed our lives") {
    return {
      title: text,
      intro: "Use these points to talk about an invention that made a big difference:",
      bullets: [
        "Some inventions changed the way people live, work, and communicate.",
        "Examples include the phone, light bulb, internet, airplane, or computer.",
        "A great invention usually solves an important problem.",
        "It may save time, improve safety, or make life easier.",
        "This topic is good because the student can choose the invention they find most interesting."
      ],
      extra: "Choose one invention and explain life before it, what changed after it, and why it still matters."
    };
  }

  if (text === "How video games have changed over time") {
    return {
      title: text,
      intro: "These facts and ideas can help students talk about video games over time:",
      bullets: [
        "Early video games were simple in design, sound, and graphics.",
        "Modern games are more realistic, detailed, and complex.",
        "Video games changed because of better computers, consoles, and internet connections.",
        "Today games are not only for fun; they can also be social, competitive, and educational.",
        "This topic works well because students can compare the past and the present."
      ],
      extra: "A clear structure is: old games, modern games, and whether the change has been positive or negative."
    };
  }

  if (text === "If I could design a new app") {
    return {
      title: text,
      intro: "This topic lets students be creative while staying organized:",
      bullets: [
        "Start by explaining what problem your app would solve.",
        "Describe the main features and how people would use it.",
        "Explain who the app is for: students, teachers, parents, or everyone.",
        "Say how the app would make life easier or more enjoyable.",
        "The best presentations make the app sound realistic and useful."
      ],
      extra: "A strong speaking plan is: the problem, the idea, the features, and why people would want this app."
    };
  }

  if (text === "The future of smart homes") {
    return {
      title: text,
      intro: "These points can help explain smart homes in an easy way:",
      bullets: [
        "Smart homes use technology to control lights, doors, air conditioning, and other devices.",
        "They can make life easier, safer, and more comfortable.",
        "People may use phones or voice commands to control things at home.",
        "In the future, smart homes may become even more automatic and intelligent.",
        "This topic is interesting because it shows how technology may change daily life."
      ],
      extra: "A good plan is: what a smart home is, how it helps people, and what homes may be like in the future."
    };
  }

  // =========================
  // INTERESTING TOPICS
  // =========================
  if (text === "The most mysterious place in the world") {
    return {
      title: text,
      intro: "Use these ideas to make this mysterious topic exciting:",
      bullets: [
        "Some places are called mysterious because people do not fully understand them.",
        "They may have strange stories, unusual history, or unexplained events.",
        "Examples could include ancient sites, deep forests, or isolated islands.",
        "Mystery makes people curious and interested in learning more.",
        "This topic is strong when students describe both facts and questions that remain unanswered."
      ],
      extra: "A good structure is: where the place is, why it is mysterious, and why people still talk about it."
    };
  }

  if (text === "A strange fact that sounds fake but is true") {
    return {
      title: text,
      intro: "This topic is fun because it surprises the audience:",
      bullets: [
        "Some true facts sound impossible at first.",
        "The topic becomes stronger when the student explains why the fact seems fake.",
        "Good examples often come from science, animals, space, or history.",
        "After sharing the fact, explain the truth behind it.",
        "The surprise element makes this a very engaging presentation."
      ],
      extra: "Begin with the strange fact first, then explain why it is actually true."
    };
  }

  if (text === "The most interesting animal in the world") {
    return {
      title: text,
      intro: "These ideas can help students speak well about a fascinating animal:",
      bullets: [
        "Choose one animal with unusual features, behavior, or abilities.",
        "Describe where it lives and how it survives.",
        "Talk about what makes it different from other animals.",
        "You can explain why people find it amazing, cute, dangerous, or intelligent.",
        "This topic becomes better when the student gives specific examples."
      ],
      extra: "A good speaking order is: introduce the animal, describe its special features, and explain why it is the most interesting."
    };
  }

  if (text === "The world 100 years from now") {
    return {
      title: text,
      intro: "This topic allows students to mix logic and imagination:",
      bullets: [
        "In 100 years, technology may be much more advanced than today.",
        "Transportation, communication, and medicine may look very different.",
        "Cities, schools, and homes could become smarter and more automated.",
        "Some problems may improve, but new challenges may appear too.",
        "This topic is interesting because everyone imagines the future differently."
      ],
      extra: "A strong presentation can cover daily life, school, travel, and one big future change you expect."
    };
  }

  if (text === "If humans lived on Mars") {
    return {
      title: text,
      intro: "These ideas can help students imagine life on Mars in a smart way:",
      bullets: [
        "Mars is a planet that scientists study as a possible place for future humans.",
        "Life there would be difficult because of the cold weather and harsh conditions.",
        "Humans would need special homes, oxygen, food systems, and technology.",
        "Living on Mars would change daily life completely.",
        "This topic is great because it mixes real science with creative thinking."
      ],
      extra: "A good structure is: why Mars interests scientists, what problems humans would face, and what life there might look like."
    };
  }

  if (text === "A job that might disappear in the future") {
    return {
      title: text,
      intro: "Use these ideas to discuss jobs and the future:",
      bullets: [
        "Some jobs may disappear because of machines, robots, or artificial intelligence.",
        "Technology often changes the kinds of jobs people do.",
        "Simple or repetitive jobs are more likely to be replaced.",
        "At the same time, new jobs may appear because of these changes.",
        "This topic is interesting because it connects the future, work, and technology."
      ],
      extra: "Choose one job and explain why it might disappear and what could replace it."
    };
  }

  if (text === "The most surprising invention ever") {
    return {
      title: text,
      intro: "These points can help students talk about an invention that feels amazing or unexpected:",
      bullets: [
        "Some inventions are surprising because they seem simple but changed the world.",
        "Others are surprising because they sound impossible at first.",
        "A strong presentation explains what the invention is and why it matters.",
        "The invention may have changed communication, travel, health, or daily life.",
        "This topic becomes more powerful when the student explains why it surprised them personally."
      ],
      extra: "Start by naming the invention, then explain what it changed and why it is so surprising."
    };
  }

  if (text === "A famous unsolved mystery") {
    return {
      title: text,
      intro: "This is a very engaging topic because people love mysteries:",
      bullets: [
        "An unsolved mystery is something people still do not fully understand or explain.",
        "It may involve history, crime, lost places, or unusual events.",
        "Many mysteries remain famous because there is no final answer.",
        "People enjoy discussing different theories about what happened.",
        "This topic works best when the student explains both the mystery and the possible ideas about it."
      ],
      extra: "A nice speaking plan is: explain the mystery, give two possible theories, and say which one you believe more."
    };
  }

  if (text === "A place in nature I would love to visit") {
    return {
      title: text,
      intro: "These ideas can help students make this topic descriptive and beautiful:",
      bullets: [
        "Choose a natural place like mountains, forests, beaches, waterfalls, or deserts.",
        "Describe what the place looks like and why it is special.",
        "Explain what you would do there and how you would feel.",
        "Talk about why nature is important and relaxing for people.",
        "This topic becomes stronger when the student uses clear description and emotion."
      ],
      extra: "A good structure is: the place, why you chose it, and what experience you hope to have there."
    };
  }

  if (text === "If I could travel to the future") {
    return {
      title: text,
      intro: "This topic is creative and gives students a lot to say:",
      bullets: [
        "Traveling to the future means imagining what life may become.",
        "The student can talk about technology, cities, schools, jobs, or even fashion.",
        "They can also explain what they would want to discover there.",
        "The most interesting part is comparing today with the future.",
        "This topic is strong because it mixes imagination with prediction."
      ],
      extra: "A clear way to present this is: where you would go in the future, what you expect to see, and what might surprise you most."
    };
  }

    // =========================
  // OPINION TOPICS
  // =========================
  if (text === "Should homework be banned?") {
    return {
      title: text,
      intro: "These ideas can help students discuss homework in a balanced way:",
      bullets: [
        "Some people think homework helps students revise, practice, and become more responsible.",
        "Others think too much homework causes stress and leaves little time for rest or hobbies.",
        "Homework can be useful when it is short, clear, and meaningful.",
        "The real question may not be whether homework should disappear, but whether it should be improved.",
        "This topic is strong because students can argue both sides before giving their opinion."
      ],
      extra: "A good structure is: reasons to keep homework, reasons to reduce it, and your own final opinion."
    };
  }

  if (text === "Social media: helpful or harmful?") {
    return {
      title: text,
      intro: "Use these points to talk about social media in a fair and interesting way:",
      bullets: [
        "Social media helps people communicate, learn news, and share ideas quickly.",
        "It can also waste time, spread false information, and affect mental health.",
        "For some people, social media is useful and positive when used wisely.",
        "For others, too much use becomes distracting or unhealthy.",
        "This topic works best when students explain both benefits and risks."
      ],
      extra: "A strong presentation can end with this idea: social media is not fully good or bad, but depends on how people use it."
    };
  }

  if (text === "Fast food: good or bad?") {
    return {
      title: text,
      intro: "These ideas can help students discuss fast food clearly:",
      bullets: [
        "Fast food is popular because it is quick, easy, and often tasty.",
        "However, eating too much fast food may be unhealthy.",
        "Some fast food meals have too much salt, sugar, or fat.",
        "Fast food can be convenient, but it should not replace healthy meals all the time.",
        "This topic is easy to understand because it connects to daily life."
      ],
      extra: "A nice way to present this is: why people like fast food, what its problems are, and how to eat more wisely."
    };
  }

  if (text === "Should students wear school uniforms?") {
    return {
      title: text,
      intro: "Use these ideas to talk about school uniforms in a balanced way:",
      bullets: [
        "Some people believe uniforms create equality and reduce distraction.",
        "Others think students should have more freedom to choose what they wear.",
        "Uniforms may help schools look organized and professional.",
        "At the same time, some students feel uniforms do not show personality.",
        "This topic is strong because both sides have reasonable arguments."
      ],
      extra: "A good structure is: reasons for uniforms, reasons against them, and what you personally think is best."
    };
  }

  if (text === "Should school start later in the morning?") {
    return {
      title: text,
      intro: "These points can help students discuss school timing in an organized way:",
      bullets: [
        "Some students feel tired in the early morning and find it hard to focus.",
        "Starting later may improve energy, mood, and attention in class.",
        "On the other hand, a later start may affect transportation, family schedules, or after-school activities.",
        "This topic connects health, learning, and daily routine.",
        "It becomes stronger when the student explains how timing affects real school life."
      ],
      extra: "A nice presentation can compare the benefits of more sleep with the practical problems of changing the schedule."
    };
  }

  if (text === "Are exams the best way to measure students?") {
    return {
      title: text,
      intro: "These ideas can help students speak thoughtfully about exams:",
      bullets: [
        "Exams can show what students remember and understand at a certain time.",
        "However, exams may not show creativity, effort, or speaking skills very well.",
        "Some students perform well in class but feel nervous in exams.",
        "Projects, presentations, and participation can also show learning.",
        "This topic is important because it asks what success in school really means."
      ],
      extra: "A strong structure is: what exams do well, what they miss, and what other ways can measure students fairly."
    };
  }

  if (text === "Should children have phones at school?") {
    return {
      title: text,
      intro: "Use these points to talk about phones at school in a balanced way:",
      bullets: [
        "Phones can help students contact parents in emergencies.",
        "They may also be useful for learning, research, or educational apps.",
        "At the same time, phones can distract students during lessons.",
        "Some students may misuse phones for games, cheating, or social media.",
        "This topic is strong because it includes both safety and discipline."
      ],
      extra: "A good final opinion could be that phones should be controlled, not always fully allowed or fully banned."
    };
  }

  if (text === "Is online learning better than classroom learning?") {
    return {
      title: text,
      intro: "These ideas can help compare online learning and classroom learning:",
      bullets: [
        "Online learning can be flexible and convenient for many students.",
        "It allows students to learn from different places and sometimes at their own speed.",
        "Classroom learning gives direct interaction with teachers and classmates.",
        "Many students focus better in a real classroom than at home.",
        "This topic works well because both systems have clear strengths and weaknesses."
      ],
      extra: "A strong presentation can compare flexibility, attention, communication, and which method works better for you."
    };
  }

  if (text === "Should video games be limited?") {
    return {
      title: text,
      intro: "These points can help students discuss video games fairly:",
      bullets: [
        "Video games can be fun, relaxing, and sometimes educational.",
        "However, too much gaming may affect sleep, study time, and physical activity.",
        "The problem may not be video games themselves, but how much time people spend on them.",
        "Some games improve thinking, teamwork, or problem-solving.",
        "This topic is strong when students explain the difference between healthy use and too much use."
      ],
      extra: "A good structure is: benefits of gaming, problems of overuse, and what a healthy limit might be."
    };
  }

  if (text === "Is technology making us lazy?") {
    return {
      title: text,
      intro: "Use these ideas to discuss the effect of technology on daily life:",
      bullets: [
        "Technology makes many tasks easier and faster.",
        "Because of this, some people feel it reduces effort and makes life less active.",
        "At the same time, technology can also help people work, learn, and create more efficiently.",
        "The real issue may be how people use technology, not technology itself.",
        "This topic is interesting because it asks whether convenience always has a negative effect."
      ],
      extra: "A strong presentation can compare useful technology with examples where people depend on it too much."
    };
  }

  // =========================
  // PEOPLE TOPICS
  // =========================
  if (text === "What makes a good friend") {
    return {
      title: text,
      intro: "These ideas can help students speak warmly and clearly about friendship:",
      bullets: [
        "A good friend is honest, kind, and supportive.",
        "Good friends listen, help, and stay respectful.",
        "Trust is one of the most important parts of friendship.",
        "A true friend is there during both happy and difficult times.",
        "This topic becomes stronger when students give a real-life example."
      ],
      extra: "A good structure is: qualities of a good friend, why trust matters, and an example from your own life."
    };
  }

  if (text === "Why teamwork is important") {
    return {
      title: text,
      intro: "Use these ideas to explain why teamwork matters in school and life:",
      bullets: [
        "Teamwork helps people share ideas and responsibilities.",
        "Working together can make a task easier and more successful.",
        "Good teamwork needs communication, respect, and trust.",
        "In many situations, a group can do more than one person alone.",
        "This topic is strong because students can connect it to school, sports, and real life."
      ],
      extra: "A nice presentation can include one example of teamwork in class, in sports, or in a project."
    };
  }

  if (text === "A person from history I would like to meet") {
    return {
      title: text,
      intro: "These ideas can help students make this topic interesting and personal:",
      bullets: [
        "Choose a historical person who did something important, brave, or inspiring.",
        "Explain who the person was and why they are remembered.",
        "Say what questions you would ask if you could meet them.",
        "Talk about what you might learn from that meeting.",
        "This topic works well because it mixes history with personal opinion."
      ],
      extra: "A strong structure is: who the person is, why you chose them, and what conversation you would want to have."
    };
  }

  if (text === "A scientist I admire") {
    return {
      title: text,
      intro: "Use these points to talk about a scientist in an organized and inspiring way:",
      bullets: [
        "Choose a scientist who made an important discovery or helped the world.",
        "Explain what field they worked in, such as medicine, physics, or space.",
        "Talk about their achievements and why they matter.",
        "Say what makes this scientist inspiring to you personally.",
        "This topic becomes stronger when students connect science with character and hard work."
      ],
      extra: "A good speaking order is: who the scientist is, what they achieved, and why you admire them."
    };
  }

  if (text === "A leader who changed the world") {
    return {
      title: text,
      intro: "These ideas can help students speak about leadership in a meaningful way:",
      bullets: [
        "A great leader influences people and creates change.",
        "Leaders may change the world through politics, peace, science, or social action.",
        "A leader is often remembered for courage, vision, and strong decisions.",
        "Not all leadership is the same, so students can explain what kind of change they mean.",
        "This topic is strong when students connect leadership with real impact."
      ],
      extra: "A clear structure is: who the leader is, what change they made, and what qualities made them effective."
    };
  }

  if (text === "A time when I helped someone") {
    return {
      title: text,
      intro: "This topic is personal, so students should focus on clear storytelling:",
      bullets: [
        "Start by explaining who needed help and what the situation was.",
        "Describe what you did to help.",
        "Talk about how the other person felt and how you felt.",
        "Explain what you learned from that experience.",
        "This topic becomes more powerful when the student is honest and specific."
      ],
      extra: "A good structure is: the situation, your action, the result, and the lesson you learned."
    };
  }

  if (text === "A famous person who inspires me") {
    return {
      title: text,
      intro: "These points can help students talk about inspiration in a personal way:",
      bullets: [
        "Choose a famous person who has talent, courage, discipline, or a strong message.",
        "Explain what this person achieved.",
        "Talk about the qualities that make them inspiring.",
        "Say how they affect your thinking or goals.",
        "This topic works best when the student explains both facts and personal feelings."
      ],
      extra: "A nice speaking plan is: introduce the person, explain what they did, and say why they inspire you."
    };
  }

  if (text === "The kindest person in my life") {
    return {
      title: text,
      intro: "Use these ideas to make this topic heartfelt and clear:",
      bullets: [
        "Start by saying who this person is.",
        "Describe the kind actions or habits that make them special.",
        "Explain how this person treats you and others.",
        "Talk about a memory that shows their kindness clearly.",
        "This topic becomes strongest when the student uses real examples."
      ],
      extra: "A good presentation can focus on the person’s character, one memorable action, and why their kindness matters to you."
    };
  }

  if (text === "If I could meet any famous person") {
    return {
      title: text,
      intro: "These ideas can help students turn this into a strong speaking topic:",
      bullets: [
        "Choose a famous person from sports, history, science, art, or entertainment.",
        "Explain why this person interests you.",
        "Say what questions you would ask them.",
        "Talk about what you hope to learn from meeting them.",
        "This topic is interesting because it mixes facts, opinion, and imagination."
      ],
      extra: "A strong structure is: who you would meet, why you chose them, and what conversation you would have."
    };
  }

  if (text === "What makes someone a hero?") {
    return {
      title: text,
      intro: "These points can help students think deeply about heroes:",
      bullets: [
        "A hero is not only someone famous or powerful.",
        "Heroes often show courage, kindness, sacrifice, or honesty.",
        "Some heroes help others in big ways, while others do small but meaningful things.",
        "A hero can be someone from history, a public figure, or a person in daily life.",
        "This topic is strong because students can define heroism in their own way."
      ],
      extra: "A good presentation can begin by defining a hero, then give one or two examples, and end with your own opinion."
    };
  }

  // =========================
  // SCHOOL TOPICS
  // =========================
  if (text === "One rule I would add to our school") {
    return {
      title: text,
      intro: "These ideas can help students speak clearly about improving school rules:",
      bullets: [
        "Start by explaining the rule you would like to add.",
        "Say what problem this rule would solve.",
        "Describe how it would help students, teachers, or the school environment.",
        "A good new rule should be fair, realistic, and useful.",
        "This topic becomes stronger when students explain the reason behind the rule."
      ],
      extra: "A strong structure is: the new rule, why it is needed, and how it would improve school life."
    };
  }

  if (text === "One small change that could improve our classroom") {
    return {
      title: text,
      intro: "Use these ideas to talk about classroom improvement in a practical way:",
      bullets: [
        "Choose one change that is simple but meaningful.",
        "It could be related to seating, decoration, behavior, technology, or class routine.",
        "Explain how this change would help students learn better or feel more comfortable.",
        "Small changes can have a big effect on focus and classroom mood.",
        "This topic works well when students give clear, realistic suggestions."
      ],
      extra: "A nice way to present this is: what the classroom needs, your small change, and why it would make a difference."
    };
  }

  if (text === "What makes a great teacher") {
    return {
      title: text,
      intro: "These points can help students talk respectfully and thoughtfully about teachers:",
      bullets: [
        "A great teacher explains clearly and helps students understand.",
        "Patience, kindness, and fairness are also important qualities.",
        "Great teachers motivate students and make learning interesting.",
        "They care about students not only academically but also personally.",
        "This topic is strong because students can mix general qualities with real examples."
      ],
      extra: "A good structure is: teaching skills, personal qualities, and why great teachers leave a lasting effect."
    };
  }

  if (text === "The perfect school trip") {
    return {
      title: text,
      intro: "These ideas can help students describe an ideal school trip in an exciting way:",
      bullets: [
        "Start by saying where the trip would go.",
        "Explain why this place is educational, fun, or memorable.",
        "Describe what students would do there.",
        "Talk about how the trip would help learning and teamwork.",
        "This topic becomes better when the student includes both fun and educational value."
      ],
      extra: "A strong speaking order is: destination, activities, benefits, and why it would be the perfect trip."
    };
  }

  if (text === "My ideal classroom") {
    return {
      title: text,
      intro: "Use these ideas to help students describe their dream classroom:",
      bullets: [
        "Talk about how the classroom would look and feel.",
        "Describe the furniture, space, decorations, or technology you would include.",
        "Explain how your ideal classroom would help students learn better.",
        "A great classroom should feel comfortable, organized, and motivating.",
        "This topic is strong because students can combine imagination with practical ideas."
      ],
      extra: "A good structure is: physical design, learning tools, and how the classroom atmosphere would support students."
    };
  }

  if (text === "How to make school more fun") {
    return {
      title: text,
      intro: "These ideas can help students talk about improving school life positively:",
      bullets: [
        "School becomes more fun when students are active, interested, and included.",
        "Fun does not mean less learning; it can mean better activities and more engagement.",
        "Ideas may include projects, games, clubs, trips, or creative lessons.",
        "A fun school environment can improve motivation and participation.",
        "This topic works best when students give realistic and useful suggestions."
      ],
      extra: "A strong presentation can explain what makes school boring sometimes and what changes could make it more enjoyable."
    };
  }

  if (text === "Why school presentations are important") {
    return {
      title: text,
      intro: "These points can help students explain the value of presentations:",
      bullets: [
        "Presentations help students practice speaking in front of others.",
        "They build confidence, communication skills, and organization.",
        "Students learn how to explain ideas clearly and respectfully.",
        "Presentations also prepare students for future study and work.",
        "This topic is especially strong because students can connect it to their own experience."
      ],
      extra: "A good structure is: skills presentations build, why those skills matter, and how presentations help in the future."
    };
  }

  if (text === "A subject that should be added to school") {
    return {
      title: text,
      intro: "Use these ideas to discuss a new subject in a smart and organized way:",
      bullets: [
        "Choose a subject you think students need but do not study enough.",
        "It could be life skills, coding, public speaking, mental health, or financial education.",
        "Explain why this subject would be useful in real life.",
        "Talk about what students would learn from it.",
        "This topic becomes stronger when the student explains both the need and the benefits."
      ],
      extra: "A good speaking plan is: the subject, why students need it, and what positive effect it would have."
    };
  }

  if (text === "Should students choose some of their subjects?") {
    return {
      title: text,
      intro: "These ideas can help students discuss choice in education fairly:",
      bullets: [
        "Allowing students to choose some subjects may increase interest and motivation.",
        "Students often learn better when they study topics they enjoy.",
        "On the other hand, schools must make sure students still learn the basics.",
        "Too much choice may be difficult for younger students.",
        "This topic is strong because it balances freedom with responsibility."
      ],
      extra: "A strong presentation can compare the benefits of choice with the need for a complete education."
    };
  }

  if (text === "The best way to learn English") {
    return {
      title: text,
      intro: "These points can help students explain how English can be learned effectively:",
      bullets: [
        "Learning English improves with regular practice, not only memorization.",
        "Students can learn through reading, listening, speaking, and writing.",
        "Watching videos, reading stories, and speaking with others can all help.",
        "Confidence is important because mistakes are part of learning.",
        "This topic is useful because students can share advice from real experience."
      ],
      extra: "A good structure is: the main skills in English, the best ways to practice them, and the method that works best for you."
    };
  }

  // =========================
  // DEFAULT
  // =========================
  return {
    title: text,
    intro: "Here are some ideas to help you speak well about this topic:",
    bullets: [
      "Start by explaining what the topic means.",
      "Give two or three important facts or ideas about it.",
      "Add one example from real life, history, or your own opinion.",
      "Say why this topic matters.",
      "Finish with a clear final sentence."
    ],
    extra: "Try to speak in an organized way: introduction, main ideas, example, and conclusion."
  };
}

  // ========= 5. RENDER EVERYTHING IN THE CARD =========
  function renderTopicGuide(topic) {
    if (!topicIdeas) return;

    const guide = getPresentationGuide(topic);
    const content = getTopicContentIdeas(topic);

    const hookList = guide.hook.map((h) => "<li>" + h + "</li>").join("");
    const structureList = guide.structure
      .map((s) => "<li>" + s + "</li>")
      .join("");
    const ideasList = guide.ideas.map((i) => "<li>" + i + "</li>").join("");
    const contentList = content.bullets
      .map((b) => "<li>" + b + "</li>")
      .join("");
    const phrases = guide.phrases.join(" · ");

    topicIdeas.innerHTML =
      '<div class="topic-ideas-card">' +
      '<h2>Let’s plan your talk 🎤</h2>' +
      "<h3>" +
      topic +
      "</h3>" +
      '<p class="topic-ideas-category">' +
      guide.category +
      "</p>" +
      '<div class="topic-ideas-grid">' +
      "<section>" +
      '<p class="topic-ideas-section-title">1. How to start (hook)</p>' +
      "<ul>" +
      hookList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">2. Clear structure</p>' +
      "<ul>" +
      structureList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">3. What you can talk about</p>' +
      "<ul>" +
      ideasList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">4. Useful phrases</p>' +
      '<p class="topic-ideas-phrases">' +
      phrases +
      "</p>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">5. Topic facts & ideas</p>' +
      '<p class="topic-ideas-content-intro">' +
      content.intro +
      "</p>" +
      "<ul>" +
      contentList +
      "</ul>" +
      (content.extra
        ? '<p class="topic-ideas-content-extra">' + content.extra + "</p>"
        : "") +
      "</section>" +
      "</div>" +
      "</div>";

    topicIdeas.classList.add("topic-ideas--visible");
  }

  // ========= 6. BUTTONS =========
  topicButton.addEventListener("click", pickRandomTopic);

  if (topicLikeButton) {
    topicLikeButton.addEventListener("click", function () {
      if (!currentTopic) {
        pickRandomTopic();
      }
      renderTopicGuide(currentTopic);
    });
  }
}

function initPresentacyWallPage() {
  const wallTabButtons = document.querySelectorAll(".wall-tab-button");
  const wallPanels = document.querySelectorAll(".wall-tab-panel");

  if (!wallTabButtons.length || !wallPanels.length) return;

  wallTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.wallTab;

      wallTabButtons.forEach((b) =>
        b.classList.remove("wall-tab-button--active")
      );
      btn.classList.add("wall-tab-button--active");

      wallPanels.forEach((panel) => {
        const isActive = panel.dataset.wallPanel === target;
        panel.classList.toggle("wall-tab-panel--active", isActive);
      });
    });
  });
}

/* ========================
   GREETING BANNER
   ======================== */

function renderUserGreeting() {
  const banner = document.getElementById("greeting-banner");
  if (!banner) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  // No user = no greeting
  if (!user) {
    banner.classList.remove("greeting-banner--visible");
    banner.innerHTML = "";
    return;
  }

  const fullName = user.name || "";
  const firstName = fullName.split(" ")[0] || fullName;

  const mainLines = [
    `Hey ${firstName}, ready to show your voice again?`,
    `${firstName}, your next great presentation is loading…`,
    `Welcome back, ${firstName}. Let’s make this week 1% better.`,
    `${firstName}, your audience is waiting for you 👀`,
    `Hi ${firstName}! Presentacy is happy you’re here.`
  ];

  const subLines = [
    "Every presentation is practice, not a performance.",
    "Your ideas matter more than perfect grammar.",
    "Nervous is normal. Brave is talking anyway.",
    "Tiny improvements every week become big changes.",
    "You don’t have to be perfect, just a bit clearer than last time."
  ];

  const main =
    mainLines[Math.floor(Math.random() * mainLines.length)];
  const sub =
    subLines[Math.floor(Math.random() * subLines.length)];

  const initial = firstName.charAt(0).toUpperCase();

  banner.innerHTML = `
    <div class="greeting-avatar">${initial}</div>
    <div>
      <div class="greeting-text-main">${main}</div>
      <div class="greeting-text-sub">${sub}</div>
    </div>
  `;

  requestAnimationFrame(() => {
    banner.classList.add("greeting-banner--visible");
  });
}

/* ========================
   STUDENT STORY HELPERS
   ======================== */

function getMotivationText(week1Score) {
  if (week1Score === 0) {
    return "You haven’t presented yet. Your score will appear after your first presentation.";
  }
  if (week1Score >= 24) {
    return "Amazing work. Keep challenging yourself with tougher topics and stronger stories.";
  }
  if (week1Score >= 16) {
    return "Strong start. Choose one skill to push higher next time – eye contact, body language, or voice.";
  }
  if (week1Score >= 8) {
    return "Nice first steps. Focus on one small change next presentation and your score will grow quickly.";
  }
  return "You were brave enough to stand and speak. That’s the hardest part – keep going.";
}

function getStudentProgressStory(student) {
  const scores = student.scores || {};
  const entries = Object.entries(scores).filter(
    ([, value]) => typeof value === "number"
  );

  if (entries.length === 0) {
    return "Your first score will appear here after your first presentation. Get ready.";
  }

  if (entries.length === 1) {
    const weekKey = entries[0][0];
    const weekNumber = weekKey.replace("week", "");
    const score = entries[0][1];
    return `You’ve completed your first Presentacy in week ${weekNumber} with ${score} points. Great start — the next step is even more important.`;
  }

  entries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  const firstScore = entries[0][1];
  const lastScore = entries[entries.length - 1][1];

  if (lastScore > firstScore) {
    return `You’ve presented ${entries.length} times so far, and your score went up from ${firstScore} to ${lastScore}. That’s called progress — keep going.`;
  } else if (lastScore < firstScore) {
    return `You’ve presented ${entries.length} times. This week was a bit lower (${lastScore} vs ${firstScore}), but one score doesn’t define you. Learn and try again.`;
  } else {
    return `You’ve presented ${entries.length} times so far. Your score stayed steady at ${lastScore}; now try one new thing (like stronger eye contact or clearer voice).`;
  }
}

// ===============================
//  STUDENT RESULT CARD
// ===============================
function renderStudentResultCard(student, targetEl) {
  if (!targetEl) return;

  if (!student) {
    targetEl.innerHTML = `
      <p class="student-message">
        No matching student was found. Please check the name and class.
      </p>
    `;
    return;
  }

  const scores = student.scores || {};
  const weekEntries = Object.entries(scores);

  // Sort by week number (week1, week2, ...)
  weekEntries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  let weeksHtml = "";

  if (weekEntries.length === 0) {
    weeksHtml = `<p>No scores recorded yet.</p>`;
  } else {
    weeksHtml = weekEntries
      .map(([weekKey, score]) => {
        const weekNumber = weekKey.replace("week", "");
        return `<p>Week ${weekNumber}: <strong>${score}</strong> points</p>`;
      })
      .join("");
  }

  // Week 1 score for the motivation line
  const week1Score =
    typeof scores.week1 === "number" ? scores.week1 : 0;
  const motivation = getMotivationText(week1Score);

  targetEl.innerHTML = `
    <div class="student-result-card">
      <div class="student-result-header">
        <div class="student-result-name">${student.name}</div>
        <div class="student-result-class">${student.class}</div>
      </div>

      <div class="student-weeks">
        ${weeksHtml}
      </div>

      <p class="motivation">${motivation}</p>
    </div>
  `;
}

/* ========================
   STUDENT VIEW ON LEADERBOARD
   ======================== */

function setupStudentViewOnLeaderboard(currentUser) {
  const searchSection = document.getElementById("student-search");
  const resultEl = document.getElementById("student-result");

  if (!searchSection || !resultEl) return;

  const titleEl = searchSection.querySelector("h1");
  const infoPara = searchSection.querySelector("p");
  const searchRow = searchSection.querySelector(".search-row");

  // Hide the search (class + name + button) for students
  if (searchRow) {
    searchRow.style.display = "none";
  }

  if (titleEl) {
    titleEl.textContent = "Your Presentacy Score";
  }

  if (infoPara) {
    infoPara.textContent = `This card shows your score for each week, ${currentUser.name}.`;
  }

  const me = STUDENTS.find(
    (s) =>
      (s.username || "").trim().toLowerCase() ===
      (currentUser.username || "").trim().toLowerCase()
  );

  if (!me) {
    resultEl.innerHTML = `
      <p class="student-message">
        You are logged in as <strong>${currentUser.name}</strong>,
        but we couldn’t find your data. Please tell your teacher.
      </p>
    `;
    return;
  }

  resultEl.innerHTML = `
    <p class="student-message">
      Hi <strong>${me.name}</strong> (${me.class}) 👋  
      Here is your Presentacy score for each week:
    </p>
  `;
  renderStudentResultCard(me, resultEl);
}

/* ========================
   WORDLE REACTION
   ======================== */

function presentacyShowWordleReaction(isWin, solutionWord) {
  const banner = document.getElementById("wordle-reaction");
  if (!banner) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  const fullName = user?.name || "";
  const firstName = fullName.split(" ")[0] || "presenter";

  let emoji;
  let text;
  let extraClass;

  if (isWin) {
    emoji = "🎉";
    extraClass = "reaction-banner--success";
    text = `Nice one, ${firstName}! You cracked today’s word: ${solutionWord.toUpperCase()}. One small win for your brain, one big win for your Presentacy.`;
  } else {
    emoji = "💪";
    extraClass = "reaction-banner--fail";
    text = `Almost there, ${firstName}. You didn’t get today’s word (${solutionWord.toUpperCase()}), but showing up again tomorrow is what really trains your speaking brain.`;
  }

  banner.className = "reaction-banner reaction-banner--visible " + extraClass;
  banner.innerHTML = `
    <span class="reaction-emoji">${emoji}</span>
    <span>${text}</span>
  `;
}

function showWordleWinMessage(secretWord) {
  const msgEl = document.getElementById("wordle-message");
  if (!msgEl) return;

  const user = getPresentacyCurrentUser();
  const first = user ? getFirstName(user.name || user.username) : "Presentacy star";

  msgEl.textContent = `Great job, ${first}! You found today’s word: ${secretWord}.`;
  msgEl.classList.add("wordle-message-success");
}

/* ========================
   VIDEO REACTIONS
   ======================== */

function initVideoReactions() {
  const cards = document.querySelectorAll(".video-card");
  if (!cards.length) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  const fullName = user?.name || "";
  const firstName = fullName.split(" ")[0] || "presenter";

  cards.forEach((card) => {
    const label = card.getAttribute("data-video-label") || "this video";
    const button = card.querySelector(".video-watch-btn");
    const reactionEl = card.querySelector(".video-reaction");
    if (!button || !reactionEl) return;

    button.addEventListener("click", () => {
      reactionEl.innerHTML = `
        ✅ Nice choice, <strong>${firstName}</strong>. 
        Try one idea from <em>${label}</em> in your next presentation.
      `;
    });
  });
}

/* ========================
   DOMContentLoaded – FINAL
   ======================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page") || "";

  // Common for all pages
  if (typeof setupNavHighlight === "function") setupNavHighlight();
  if (typeof setupMobileNav === "function") setupMobileNav();
  if (typeof setupLogoutButton === "function") setupLogoutButton();

  // Home hero stuff
  if (typeof updateHomeHeroCard === "function") updateHomeHeroCard();
  if (typeof updateHomeHeroCard === "function") {
  updateHomeHeroCard();
}

  // Page-specific inits
  if (typeof initHomePage === "function") initHomePage();
  if (typeof initGeneratorPage === "function") initGeneratorPage();
  if (typeof initPresentacyWallPage === "function") initPresentacyWallPage();

  if (page === "login" && typeof initPresentacyLoginPage === "function") {
    initPresentacyLoginPage();
    return;
  }

  if (page === "leaderboard" && typeof initLeaderboardPage === "function") {
    initLeaderboardPage();
  }

  if (page === "videos" && typeof initVideoReactions === "function") {
    initVideoReactions();
  }
});

// ============================
// 7. ONE CLEAN DOMContentLoaded
// ============================
function getFirstName(fullName) {
  if (!fullName) return "";
  return fullName.trim().split(/\s+/)[0];
}

// Returns "First Last" (first two names) for the badge
function getFirstTwoNames(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[1];
}

// Updates the big hero rectangle text
function updateHomeHeroCard() {
  const mainLine = document.getElementById("home-hero-main");
  const subLine  = document.getElementById("home-hero-sub");
  if (!mainLine || !subLine) return;

  const currentUser =
    (typeof presentacyGetCurrentUser === "function"
      ? presentacyGetCurrentUser()
      : null);

  // Nobody logged in → generic text
  if (!currentUser) {
    mainLine.textContent = "Welcome to Presentacy";
    subLine.textContent  = "Track your presentations and see your progress.";
    return;
  }

  const hour = new Date().getHours();
  let prefix = "Welcome";
  if (hour < 12) prefix = "Good morning";
  else if (hour < 18) prefix = "Good afternoon";
  else prefix = "Good evening";

  const fullName = currentUser.name || currentUser.username || "";
  const first = getFirstName(fullName);

  // Main greeting line
  mainLine.textContent = `${prefix}, ${first}!`;

  // Second line – slightly different for teacher vs student
  if (currentUser.role === "teacher") {
    subLine.textContent =
      "Check your scores, see the leaderboard, and get ready for the next Presentacy.";
  } else {
    subLine.textContent =
      "Check your scores, see the leaderboard, and get ready for your next Presentacy.";
  }
}

// Updates the circle avatar + name badge on the left
function updateHomeHeroUserBadge() {
  const avatarEl = document.getElementById("home-hero-avatar");
  const nameEl   = document.getElementById("home-hero-name");
  if (!avatarEl || !nameEl) return;

  const user =
    (typeof presentacyGetCurrentUser === "function"
      ? presentacyGetCurrentUser()
      : null);
  if (!user) return;

  const fullName = (user.name || user.username || "").trim();
  if (!fullName) return;

  // Text under the circle → "First Last"
  nameEl.textContent = getFirstTwoNames(fullName);

  // First letter inside the circle
  const firstLetter = fullName[0];
  if (firstLetter) {
    avatarEl.textContent = firstLetter.toUpperCase();
  }
}

// ---------- My Scores helpers ----------

// Find a student in the STUDENTS array by username (case-insensitive)
function findStudentByUsername(username) {
  if (!username) return null;
  const target = username.trim().toLowerCase();
  return STUDENTS.find((s) => (s.username || "").trim().toLowerCase() === target) || null;
}

// Build a small table with week1, week2, ... scores
function buildWeeksTable(student) {
  const scores = (student && student.scores) || {};
  const entries = Object.entries(scores).filter(([key]) => /^week\d+$/i.test(key));

  if (!entries.length) {
    return `
      <p class="myscores-muted">
        No presentation scores yet. Once you start presenting, your points will appear here.
      </p>
    `;
  }

  const rows = entries
    .map(([key, value]) => {
      const weekLabel = key.replace(/week/i, "Week ");
      const safeValue = typeof value === "number" ? value : "–";
      return `<tr><td>${weekLabel}</td><td>${safeValue}</td></tr>`;
    })
    .join("");

  return `
    <table class="myscores-table">
      <thead>
        <tr>
          <th>Week</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Get unique class list for the teacher dropdown
async function getAllClasses() {
  const allStudents = await getMergedStudentsData();
  const set = new Set();

  (allStudents || []).forEach((s) => {
    const cls = String(s.class || "").trim();
    if (cls && s.role !== "teacher") {
      set.add(cls);
    }
  });

  return Array.from(set).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
}

function convertSupabaseRubricRow(row) {
  const safeNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const rubricsNumbers = {
    "Body Language": safeNumber(row.bodyLanguageFacial),
    "Eye Contact": safeNumber(row.eyeContact),
    "Intonation": safeNumber(row.intonation),
    "Preparation": safeNumber(row.preparation),
    "Visual Aids": safeNumber(row.visualAids),
    "Time Management": safeNumber(row.timeManagement),
      "Fluency": safeNumber(row.fluency),
      "Language Accuracy": safeNumber(row.languageAccuracy),
      "Pronunciation": safeNumber(row.pronunciation),
      "Listening": safeNumber(row.listening)
    };

    function toLetterForRegularSkill(num) {
      if (num >= 4) return "A";
      if (num >= 3) return "B";
      if (num >= 2) return "C";
      if (num >= 1) return "D";
      return "E";
    }

    function toLetterForListening(num) {
      if (num >= 2) return "A";
      if (num === 1) return "B";
      if (num === 0) return "";
      if (num === -1) return "D";
      return "f";
    }

    const rubricsLetters = {
      "Body Language": toLetterForRegularSkill(rubricsNumbers["Body Language"]),
      "Eye Contact": toLetterForRegularSkill(rubricsNumbers["Eye Contact"]),
      "Intonation": toLetterForRegularSkill(rubricsNumbers["Intonation"]),
      "Preparation": toLetterForRegularSkill(rubricsNumbers["Preparation"]),
      "Visual Aids": toLetterForRegularSkill(rubricsNumbers["Visual Aids"]),
      "Time Management": toLetterForRegularSkill(rubricsNumbers["Time Management"]),
      "Fluency": toLetterForRegularSkill(rubricsNumbers["Fluency"]),
      "Language Accuracy": toLetterForRegularSkill(rubricsNumbers["Language Accuracy"]),
      "Pronunciation": toLetterForRegularSkill(rubricsNumbers["Pronunciation"]),
      "Listening": toLetterForListening(rubricsNumbers["Listening"])
    };

    return {
      week: row.week || "",
      topic: row.topic || "",
      teacher: row.teacher || "",
      totalPoints: safeNumber(row.total),
      rubricsNumbers,
      rubricsLetters
    };
  }

  async function setupStudentMyScoresView(currentUser) {
    const statusEl = document.getElementById("myscores-status");
    const totalEl = document.getElementById("myscores-total");
    const badgeEl = document.getElementById("myscores-badge");
    const weeksContainer = document.getElementById("myscores-weeks");
    const rubricsEl = document.getElementById("myscores-rubrics");

    if (!statusEl || !totalEl || !badgeEl || !weeksContainer || !rubricsEl) return;

    if (!currentUser || !currentUser.username) {
      statusEl.textContent = "Please log in first to see your Presentacy score.";
      totalEl.textContent = "–";
      badgeEl.textContent = "–";
      weeksContainer.innerHTML = "";
      rubricsEl.innerHTML = "";
      return;
    }

    statusEl.textContent = "Loading your scores...";
    totalEl.textContent = "–";
    badgeEl.textContent = "–";
    weeksContainer.innerHTML = "";
    rubricsEl.innerHTML = "";

    try {
      const supabase = getSupabaseClient();
      const studentId = String(currentUser.password || currentUser.studentId || "").trim();

      if (!studentId) {
        statusEl.textContent = "We could not read your student ID. Please log in again.";
        return;
      }

      const { data, error } = await supabase
    .from("Rubrics")
    .select("*")
    .eq("Student ID", studentId)
    .order("week", { ascending: true });

      if (error) {
        console.error(error);
        statusEl.textContent = error.message || "Could not load your scores.";
        return;
      }

      const rubricRows = (data || []).map(convertSupabaseRubricRow);

      if (!rubricRows.length) {
        statusEl.textContent = "No presentation scores yet.";
        totalEl.textContent = "–";
        badgeEl.textContent = "–";
        weeksContainer.innerHTML = `
          <div id="myscores-selected-table">
            <p class="myscores-muted">
              No presentation scores yet. Once you start presenting, your points will appear here.
            </p>
          </div>
        `;
        rubricsEl.innerHTML = `
          <p class="myscores-muted">
            Your teacher has not added detailed rubric scores yet.
          </p>
        `;
        return;
      }

      const latestRow = rubricRows[rubricRows.length - 1];
      const latestTotal =
        typeof latestRow.totalPoints === "number"
          ? latestRow.totalPoints
          : Number(latestRow.totalPoints || 0);

      totalEl.textContent = latestTotal > 0 ? latestTotal : "–";
      const latestBadge = calculateBadge(latestTotal);
      badgeEl.textContent = latestBadge.label || latestBadge.text || "Presentacy Speaker";

      const weekOptions = rubricRows
        .map((row, index) => {
          const selected = index === rubricRows.length - 1 ? "selected" : "";
          return `<option value="${index}" ${selected}>Week ${row.week || index + 1}</option>`;
        })
        .join("");

      weeksContainer.innerHTML = `
        <label class="form-field">
          <span class="form-label">Choose week</span>
          <select id="myscores-week-select" class="input">
            ${weekOptions}
          </select>
        </label>
        <div id="myscores-selected-table" style="margin-top: 1rem;"></div>
      `;

      function renderRubricRow(row) {
        const total =
          typeof row.totalPoints === "number"
            ? row.totalPoints
            : Number(row.totalPoints || 0);

        totalEl.textContent = total > 0 ? total : "–";
        const badgeInfo = calculateBadge(total);
        badgeEl.textContent = badgeInfo.label || badgeInfo.text || "Presentacy Speaker";

        const selectedTable = document.getElementById("myscores-selected-table");
        if (selectedTable) {
          selectedTable.innerHTML = `
            <table class="myscores-table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Topic</th>
                  <th>Total points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${row.week || "–"}</td>
                  <td>${row.topic || "–"}</td>
                  <td>${Number.isFinite(total) ? total : 0}</td>
                </tr>
              </tbody>
            </table>
          `;
        }

        const rubricNumbers = row.rubricsNumbers || {};
        const rubricLetters = row.rubricsLetters || {};
        const rubricKeys = Object.keys(rubricNumbers).length
          ? Object.keys(rubricNumbers)
          : Object.keys(rubricLetters);

        if (!rubricKeys.length) {
          rubricsEl.innerHTML = `
            <p class="myscores-muted">
              Your teacher has not added detailed rubric scores yet. Once they are added, they will appear here.
            </p>
          `;
          return;
        }

        const rowsHtml = rubricKeys
  .map((key) => {
    const safeLabel = String(key)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const letterValue = rubricLetters[key] || "–";

    return `
      <tr>
        <td>${safeLabel}</td>
        <td>${letterValue}</td>
      </tr>
    `;
  })
  .join("");

rubricsEl.innerHTML = `
  <table class="myscores-table rubrics-table">
    <thead>
      <tr>
        <th>Skill</th>
        <th>Grade</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
`;
      }

      renderRubricRow(latestRow);

      const weekSelect = document.getElementById("myscores-week-select");
      if (weekSelect) {
        weekSelect.addEventListener("change", () => {
          const idx = Number(weekSelect.value);
          const row = rubricRows[idx] || latestRow;
          renderRubricRow(row);
        });
      }

      statusEl.textContent = "Your scores are ready.";
    } catch (err) {
      console.error(err);
      statusEl.textContent = err.message || "Could not load your scores.";
    }
  }
  async function setupTeacherMyScoresView() {
    const classSelect = document.getElementById("teacher-myscores-class");
    const nameInput = document.getElementById("teacher-myscores-name");
    const searchBtn = document.getElementById("teacher-myscores-search");
    const statusEl = document.getElementById("teacher-myscores-status");
    const resultEl = document.getElementById("teacher-myscores-result");

    if (!classSelect || !nameInput || !searchBtn || !statusEl || !resultEl) return;

    const allStudents = (await getMergedStudentsData()).filter(
      (student) => student && student.role !== "teacher"
    );
    const classes = await getAllClasses();

    classSelect.innerHTML =
      `<option value="">All classes</option>` +
      classes.map((c) => `<option value="${c}">${c}</option>`).join("");

    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function getPresentationCount(student) {
      if (!student || !student.scores || typeof student.scores !== "object") return 0;

      return Object.keys(student.scores).filter((key) => /^week\d+$/i.test(key)).length;
    }

    function sortStudentsByPresentationCount(list) {
      return [...list].sort((a, b) => {
        const countDiff = getPresentationCount(a) - getPresentationCount(b);
        if (countDiff !== 0) return countDiff;

        const classDiff = String(a.class || "").localeCompare(String(b.class || ""), undefined, {
          sensitivity: "base",
          numeric: true
        });
        if (classDiff !== 0) return classDiff;

        return String(a.name || "").localeCompare(String(b.name || ""), undefined, {
          sensitivity: "base",
          numeric: true
        });
      });
    }

    function getSortedWeekEntries(student) {
  const scores = student?.scores || {};

  return Object.entries(scores)
    .filter(([key]) => /^week\d+$/i.test(key))
    .sort((a, b) => {
      const numA = parseInt(String(a[0]).replace("week", ""), 10) || 0;
      const numB = parseInt(String(b[0]).replace("week", ""), 10) || 0;
      return numA - numB;
    });
}

function getLatestWeekEntry(student) {
  const entries = getSortedWeekEntries(student);
  return entries.length ? entries[entries.length - 1] : null;
}

function buildStudentListCard(student, index) {
  const presentationCount = getPresentationCount(student);
  const totalPoints = getTotalPoints(student);
  const latestEntry = getLatestWeekEntry(student);
  const weekEntries = getSortedWeekEntries(student);
  const detailsId = `teacher-student-details-${index}`;

  const statusMarkup =
    presentationCount === 0
      ? `<p class="myscores-muted" style="margin:0.4rem 0 0 0;"><strong>Not Presented Yet</strong></p>`
      : `<p class="myscores-muted" style="margin:0.4rem 0 0 0;">Latest presentation: <strong>Week ${String(latestEntry[0]).replace("week", "")}</strong> — <strong>${latestEntry[1]}</strong> points</p>`;

  const presentationsHtml = weekEntries.length
    ? weekEntries
        .map(([weekKey, score], presentationIndex) => {
          const weekNumber = weekKey.replace("week", "");
          const label =
            presentationIndex === 0
              ? "First presentation"
              : presentationIndex === 1
              ? "Second presentation"
              : presentationIndex === 2
              ? "Third presentation"
              : `Presentation ${presentationIndex + 1}`;

          return `
            <div class="student-presentation-item">
              <div><strong>${label}</strong></div>
              <div>Week ${weekNumber}: <strong>${score}</strong> points</div>
            </div>
          `;
        })
        .join("")
    : `<div class="student-presentations-empty"><strong>Not Presented Yet</strong></div>`;

  return `
    <article class="student-card student-result-card student-result-card--collapsible" style="padding:1rem; margin-bottom:0.9rem; border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
      <button
        type="button"
        class="student-card-toggle"
        data-details-id="${detailsId}"
        aria-expanded="false"
      >
        <div class="student-card-toggle-head">
          <div>
            <h3 style="margin:0 0 0.35rem 0;">${escapeHtml(student.name || "Unnamed Student")}</h3>
            <p class="myscores-muted" style="margin:0;">Class: ${escapeHtml(student.class || "-")}</p>
            ${statusMarkup}
          </div>

          <div style="min-width:190px; text-align:left;">
            <p style="margin:0 0 0.35rem 0;"><strong>Presentations:</strong> ${presentationCount}</p>
            <p style="margin:0 0 0.35rem 0;"><strong>Total points:</strong> ${totalPoints}</p>
            <span class="student-card-toggle-icon">▼</span>
          </div>
        </div>
      </button>

      <div class="student-card-details" id="${detailsId}">
        ${presentationsHtml}
      </div>
    </article>
  `;
}

function renderStudents(list, selectedClassLabel, searchTerm) {
  resultEl.innerHTML = "";

  if (!list.length) {
    if (searchTerm) {
      statusEl.textContent = `No students matched "${searchTerm}"${selectedClassLabel ? ` in ${selectedClassLabel}` : ""}.`;
    } else if (selectedClassLabel) {
      statusEl.textContent = `No students found in ${selectedClassLabel}.`;
    } else {
      statusEl.textContent = "No students found.";
    }
    return;
  }

  const sorted = sortStudentsByPresentationCount(list);
  const zeroCount = sorted.filter((student) => getPresentationCount(student) === 0).length;
  const classText = selectedClassLabel ? ` for ${selectedClassLabel}` : "";
  const searchText = searchTerm ? ` matching "${searchTerm}"` : "";

  statusEl.textContent = `${sorted.length} student${sorted.length === 1 ? "" : "s"} shown${classText}${searchText}. ${zeroCount} not presented yet. Click a card to see all presentations.`;
  resultEl.innerHTML = sorted.map((student, index) => buildStudentListCard(student, index)).join("");

  const toggleButtons = resultEl.querySelectorAll(".student-card-toggle");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const detailsId = btn.getAttribute("data-details-id");
      const detailsEl = detailsId ? resultEl.querySelector(`#${detailsId}`) : null;
      const iconEl = btn.querySelector(".student-card-toggle-icon");
      if (!detailsEl || !iconEl) return;

      const isOpen = detailsEl.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      iconEl.textContent = isOpen ? "▲" : "▼";
    });
  });
}

    function getFilteredStudents() {
      const selectedClass = classSelect.value.trim().toLowerCase();
      const searchTerm = nameInput.value.trim().toLowerCase();

      const filtered = allStudents.filter((student) => {
        const matchesClass =
          !selectedClass ||
          String(student.class || "").trim().toLowerCase() === selectedClass;

        const matchesSearch =
          !searchTerm ||
          String(student.name || "").trim().toLowerCase().includes(searchTerm) ||
          String(student.username || "").trim().toLowerCase().includes(searchTerm);

        return matchesClass && matchesSearch;
      });

      return {
        filtered,
        selectedClassLabel: classSelect.value.trim(),
        searchTerm: nameInput.value.trim()
      };
    }

    function refreshTeacherResults() {
      const { filtered, selectedClassLabel, searchTerm } = getFilteredStudents();
      renderStudents(filtered, selectedClassLabel, searchTerm);
    }

    classSelect.addEventListener("change", refreshTeacherResults);

    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      refreshTeacherResults();
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        refreshTeacherResults();
      }
    });

    nameInput.addEventListener("input", () => {
      if (!nameInput.value.trim()) {
        refreshTeacherResults();
      }
    });

    refreshTeacherResults();
  }

  async function initMyScoresPage() {
    const raw = localStorage.getItem("presentacy_current_user");
    let currentUser = null;

    try {
      currentUser = raw ? JSON.parse(raw) : null;
    } catch (e) {
      currentUser = null;
    }

    const studentSection = document.getElementById("myscores-student-section");
    const teacherSection = document.getElementById("myscores-teacher-section");

    if (!currentUser) {
      // Not logged in – hide both sections
      if (studentSection) studentSection.style.display = "none";
      if (teacherSection) teacherSection.style.display = "none";

      const statusEl = document.getElementById("myscores-status");
      if (statusEl) {
        statusEl.textContent = "Please log in first to see scores.";
      }
      return;
    }

    // Teacher vs student
    if (currentUser.role === "teacher") {
      if (studentSection) studentSection.style.display = "none";
      if (teacherSection) teacherSection.style.display = "block";
      await setupTeacherMyScoresView();
    } else {
      if (teacherSection) teacherSection.style.display = "none";
      if (studentSection) studentSection.style.display = "block";
      await setupStudentMyScoresView(currentUser);
    }
  }

  // ========================
  // DOMContentLoaded – FINAL
  // ========================
  addEventListener("DOMContentLoaded", () => {
    if (enforceMaintenanceMode()) return;

    const page = document.body.getAttribute("data-page") || "";

    // Common for all pages

    // Common for all pages
    if (typeof setupNavHighlight === "function") setupNavHighlight();
    if (typeof setupMobileNav === "function") setupMobileNav();
    if (typeof setupLogoutButton === "function") setupLogoutButton();
    if (typeof applyRoleBasedNav === "function") applyRoleBasedNav();

    // Home hero (greeting + badge)
    if (typeof updateHomeHeroCard === "function") updateHomeHeroCard();
    if (typeof updateHomeHeroUserBadge === "function") updateHomeHeroUserBadge();

    // If you still want the old navbar greeting, keep this line.
    // If you DON'T want it, just delete this next line:
    // if (typeof renderUserGreeting === "function") renderUserGreeting();

    // Page-specific inits
    if (typeof initHomePage === "function") initHomePage();
    if (typeof initGeneratorPage === "function") initGeneratorPage();
    if (typeof initPresentacyWallPage === "function") initPresentacyWallPage();

    if (page === "login" && typeof initPresentacyLoginPage === "function") {
      initPresentacyLoginPage();
      return;
    }

    if (page === "wordle" && typeof initWordlePage === "function") {
    initWordlePage();
  }

    if (page === "leaderboard" && typeof initLeaderboardPage === "function") {
      initLeaderboardPage();
    }

    if (page === "videos" && typeof initVideoReactions === "function") {
      initVideoReactions();
    }

      if (page === "myscores" && typeof initMyScoresPage === "function") {
      initMyScoresPage();
    }

      // ============================
    // TEACHER RUBRICS: stay on page + popup on save
    // ============================
    const rubricsForm = document.getElementById("rubrics-form");
    const rubricsFrame = document.getElementById("rubrics-saver-frame");

    if (rubricsForm && rubricsFrame) {
      let firstLoad = true; // ignore the first empty load of the iframe

      rubricsFrame.addEventListener("load", () => {
        if (firstLoad) {
          firstLoad = false;
          return;
        }

        // At this point Apps Script has replied → the row should be saved
        alert("Rubrics saved! You can enter the next student.");

        // Clear the form for the next student
        rubricsForm.reset();

        // Optional: put the cursor back on the student select / input
        const studentField =
          rubricsForm.querySelector('[name="student"]') ||
          rubricsForm.querySelector('[name="studentId"]');
        if (studentField) {
          studentField.focus();
        }
      });
    }
  });


  function trackVisitAuto() {
    try {
      // Page name (uses <body data-page="..."> if you have it)
      const page =
        document.body?.dataset?.page ||
        document.body?.getAttribute("data-page") ||
        location.pathname.split("/").pop() ||
        "unknown";

      // Who is visiting (adjust keys if yours are different)
      const userId =
        localStorage.getItem("studentId") ||
        localStorage.getItem("teacherId") ||
        localStorage.getItem("userId") ||
        "guest";

      const role = localStorage.getItem("role") || "unknown";

      // Send 1 tracking request (fire-and-forget)
      fetch(
        `${API_URL}?action=track` +
          `&userId=${encodeURIComponent(userId)}` +
          `&role=${encodeURIComponent(role)}` +
          `&page=${encodeURIComponent(page)}` +
          `&event=page_view` +
          `&ua=${encodeURIComponent(navigator.userAgent)}`
      ).catch(() => {});
    } catch (e) {
      // ignore
    }
  }

  // Run ONCE per page load
  document.addEventListener("DOMContentLoaded", trackVisitAuto);




