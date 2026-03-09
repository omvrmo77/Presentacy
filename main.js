
// ============================
// 2. AUTH HELPERS (LOGIN DATA)
// ============================

const PRESENTACY_USER_KEY = "presentacy_current_user";

const MAINTENANCE_MODE = true;
const MAINTENANCE_ACCESS_KEY = "presentacy_maintenance_access";

function hasMaintenanceAccess() {
  try {
    return localStorage.getItem(MAINTENANCE_ACCESS_KEY) === "granted";
  } catch (e) {
    return false;
  }
}

function grantMaintenanceAccess() {
  try {
    localStorage.setItem(MAINTENANCE_ACCESS_KEY, "granted");
  } catch (e) {
    console.error("Could not save maintenance access", e);
  }
}

function clearMaintenanceAccess() {
  try {
    localStorage.removeItem(MAINTENANCE_ACCESS_KEY);
  } catch (e) {
    console.error("Could not clear maintenance access", e);
  }
}

function enforceMaintenanceMode() {
  const path = (window.location.pathname.split("/").pop() || "").toLowerCase();
  const isMaintenancePage = path === "maintenance.html";

  if (MAINTENANCE_MODE) {
    if (!isMaintenancePage && !hasMaintenanceAccess()) {
      window.location.href = "maintenance.html";
      return true;
    }
  } else {
    if (isMaintenancePage) {
      window.location.href = "login.html";
      return true;
    }
  }

  return false;
}

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
    localStorage.removeItem(MAINTENANCE_ACCESS_KEY);
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

function getTotalPoints(student) {
  if (!student || !student.scores) return 0;

  // ✅ If spreadsheet provided a total, use it
  const apiTotal = Number(student.scores.totalPoints);
  if (Number.isFinite(apiTotal) && apiTotal > 0) return apiTotal;

  // Otherwise fall back to summing week1/week2/... in local JS
  let total = 0;
  for (const [k, v] of Object.entries(student.scores)) {
    if (/^week\d+$/i.test(k)) {
      const n = Number(v);
      if (Number.isFinite(n)) total += n;
    }
  }
  return total;
}
function getTotalPoints(student) {
  return getTotalScoreFromStudent(student);
}


// ============================
// 4. LEADERBOARD HELPERS
// ============================

// Sum of all weeks for leaderboard
function getTotalPoints(student) {
  if (!student || !student.scores) return 0;

  // ✅ If spreadsheet provided a total, use it
  const apiTotal = Number(student.scores.totalPoints);
  if (Number.isFinite(apiTotal) && apiTotal > 0) return apiTotal;

  // Otherwise fall back to summing week1/week2/... in local JS
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

  weekEntries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  let weeksHtml = "";

  if (weekEntries.length === 0) {
    weeksHtml = "<p>No scores recorded yet.</p>";
  } else {
    weeksHtml = weekEntries
      .map(([weekKey, score]) => {
        const weekNumber = weekKey.replace("week", "");
        return `<p>Week ${weekNumber}: <strong>${score}</strong> points</p>`;
      })
      .join("");
  }

  const week1Score = scores.week1 || 0;
  const motivation = getMotivationText(week1Score);

  targetEl.innerHTML = `
    <div class="student-result-card">
      <h3>${student.name}</h3>
      <div class="student-meta">
        Class: ${student.class}
      </div>
      <div class="student-weeks">
        ${weeksHtml}
      </div>
      <p class="motivation">${motivation}</p>
    </div>
  `;
}

function renderMultipleResults(list, term, selectedClassLabel, targetEl) {
  if (!targetEl) return;

  const cards = list
    .map(
      (student) => `
      <div class="student-result-card">
        <h3>${student.name}</h3>
        <div class="student-meta">
          Class: ${student.class}
        </div>
        <div class="student-weeks">
          ${
            student.scores && typeof student.scores.week1 === "number"
              ? `<p>Week 1: <strong>${student.scores.week1}</strong> points</p>`
              : "<p>No scores recorded yet.</p>"
          }
        </div>
      </div>
    `
    )
    .join("");

  const classInfo =
    selectedClassLabel && selectedClassLabel !== ""
      ? ` in class <strong>${selectedClassLabel}</strong>`
      : "";

  targetEl.innerHTML = `
    <div style="margin-bottom:0.4rem; font-size:0.85rem; color:var(--text-muted);">
      We found ${list.length} students matching "<strong>${term}</strong>"${classInfo}. 
      Add more letters (for example last name) if this is not you.
    </div>
    <div class="student-multi-results">
      ${cards}
    </div>
  `;
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
  const topics = [
    // Cars & tech
    "My dream car",
    "Electric cars vs petrol cars",
    "A cool invention that changed our lives",
    "If I could design a new app",

    // Games & media
    "My favourite video game",
    "A movie or series I can't forget",
    "My favourite YouTuber or content creator",
    "The power of music in my life",

    // Sports
    "My favourite football team",
    "A sports player I admire",
    "Team sports vs individual sports",

    // Daily life & opinions
    "Fast food: good or bad?",
    "Should homework be banned?",
    "Social media: helpful or harmful?",
    "Being kind online",

    // People & relationships
    "What makes a good friend",
    "A time when I helped someone",
    "Why teamwork is important",

    // Animals & nature
    "Pets vs wild animals",
    "The most interesting animal in the world",
    "A place in nature I would love to visit",

    // Future & imagination
    "Living on Mars in the future",
    "Robots in our lives",
    "If I could meet any famous person",
    "If I could travel to the future",

    // School & self
    "One rule I would add to our school",
    "A hobby that makes me feel calm",
    "Something I learned from a mistake",
    "One small change that could improve our classroom"
  ];

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
const topicsUpper = topics; // use your existing topics array as the upper pool

// Active pool state
let topicLevel = "upper"; // "young" | "upper"

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

function setLevel(level) {
  topicLevel = level;

  if (topicLevel === "young") {
    youngBtn.classList.remove("secondary-button");
    upperBtn.classList.add("secondary-button");
    levelLabel.textContent = "Current: Grades 1–3";
  } else {
    upperBtn.classList.remove("secondary-button");
    youngBtn.classList.add("secondary-button");
    levelLabel.textContent = "Current: Grades 4–9";
  }

  // Optional: immediately give a topic when switching
  pickRandomTopic();
}

youngBtn.addEventListener("click", () => setLevel("young"));
upperBtn.addEventListener("click", () => setLevel("upper"));

function getActiveTopics() {
  return topicLevel === "young" ? topicsYoung : topicsUpper;
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

  // ========= 4. TOPIC CONTENT (facts & sub-ideas) =========
  // ========= 4. TOPIC CONTENT (facts & sub-ideas) =========
function getTopicContentIdeas(topic) {
  const TOPIC_EXACT_DETAILS = window.TOPIC_EXACT_DETAILS || {};

  const key = String(topic || "").trim().toLowerCase();
  const exact = TOPIC_EXACT_DETAILS[key];
  if (exact) return exact; // in case you add custom objects later

  const text = String(topic || "").trim();
  const lower = text.toLowerCase();

  // 🌟 SPECIAL: Younger topics (Grades 1–3) – fully personalised

  if (text === "My weekend") {
    return {
      title: text,
      intro: "Use these ideas to talk about your weekend in a clear, simple way:",
      bullets: [
        "Say which days are your weekend and why you like them.",
        "Talk about one relaxing thing you usually do (sleep late, watch cartoons, play games, etc.).",
        "Describe one place you often go on the weekend (club, park, mall, grandparents’ house).",
        "Tell a story about a special weekend you remember and what happened.",
        "Explain how the weekend helps you feel ready for the new school week."
      ],
      extra:
        "Choose one normal weekend and one special weekend to talk about. That gives you a nice mix of routine and story."
    };
  }

  if (text === "My family") {
    return {
      title: text,
      intro: "Here are ideas to help you talk about your family:",
      bullets: [
        "Say who is in your family (parents, brothers/sisters, maybe grandparents or cousins).",
        "Give one or two nice things about each person (kind, funny, helpful, strict but caring, etc.).",
        "Describe something you all do together (eating, travelling, watching a show, playing a game).",
        "Tell a happy family memory like a trip, birthday, or funny moment at home.",
        "Explain why your family is important to you and how they support you."
      ],
      extra:
        "You don’t need to talk about every single person. Choose 3–4 people and give nice details about each one."
    };
  }

  if (text === "My best friend") {
    return {
      title: text,
      intro: "These ideas will help you give a sweet talk about your best friend:",
      bullets: [
        "Say your friend’s name and how old they are or which class they are in.",
        "Tell how you met and when you became friends.",
        "Describe what your friend looks like or what kind of person they are (kind, funny, shy, loud, etc.).",
        "Explain what you like to do together (games, sports, studying, talking, online games).",
        "Tell one short story that shows why this person is your best friend."
      ],
      extra:
        "End with a sentence about why you are thankful for this friend or why you hope to stay friends for a long time."
    };
  }

  if (text === "My favourite food") {
    return {
      title: text,
      intro: "Make your audience hungry with these ideas about your favourite food:",
      bullets: [
        "Say the name of your favourite food and if it is sweet, salty, or spicy.",
        "Talk about the main ingredients (rice, pasta, chicken, vegetables, cheese, etc.).",
        "Explain how it is cooked or served (fried, baked, grilled, hot/cold, with bread or rice).",
        "Say where you usually eat it (at home, in a restaurant, street food, at family visits).",
        "Explain why you love this food (taste, smell, memories with family or friends)."
      ],
      extra:
        "You can add one funny or cute story about a time you ate too much or tried to cook it yourself!"
    };
  }

  if (text === "My favourite animal") {
    return {
      title: text,
      intro: "Here are ideas to make your favourite animal sound exciting:",
      bullets: [
        "Say the animal’s name and if it is a pet, farm animal, zoo animal, or wild animal.",
        "Describe what it looks like (size, colour, fur/feathers, tail, special body parts).",
        "Explain where it lives (home, desert, forest, sea, jungle, farm, etc.).",
        "Say what it eats and how it moves (runs, jumps, flies, swims, climbs).",
        "Explain why you like this animal and how it makes you feel (safe, happy, excited, brave)."
      ],
      extra:
        "You can add a short story about a time you saw this animal in real life or on TV/online."
    };
  }

  if (text === "My favourite toy or game") {
    return {
      title: text,
      intro: "Make your favourite toy or game come alive with these ideas:",
      bullets: [
        "Say the name of the toy or game (board game, doll, football, Lego, etc.).",
        "Explain who gave it to you or how you got it.",
        "Describe how you play with it and if you play alone or with other people.",
        "Tell one favourite memory when you played with this toy or game.",
        "Explain why this toy or game is special for you (fun, relaxing, makes you think, reminds you of someone)."
      ],
      extra:
        "You could finish by saying what you would do if you lost this toy/game or couldn’t play it anymore."
    };
  }

  if (text === "My favourite cartoon") {
    return {
      title: text,
      intro: "Use these ideas to talk about your favourite cartoon:",
      bullets: [
        "Say the name of the cartoon and where you watch it (TV, YouTube, streaming app).",
        "Describe the main character and what they are like.",
        "Explain where the story happens (school, city, another world, space, under the sea, etc.).",
        "Say what usually happens in one episode (problem, funny parts, how it ends).",
        "Explain what you feel or learn when you watch it (happy, relaxed, brave, kinder, etc.)."
      ],
      extra:
        "You can compare this cartoon with another one you used to like when you were younger."
    };
  }

  if (text === "A place I like to go") {
    return {
      title: text,
      intro: "These ideas will help you take your audience to your special place:",
      bullets: [
        "Say the name of the place (park, club, beach, mall, grandparent’s house, etc.).",
        "Explain where it is (near your home, in another city, far away, etc.).",
        "Describe what it looks and feels like (quiet/noisy, colourful, big/small, nature or buildings).",
        "Talk about what you usually do there and who you go with.",
        "Explain why this place is special or important for you."
      ],
      extra:
        "You can add one special memory that happened in this place to make your talk more like a story."
    };
  }

  if (text === "What makes me happy") {
    return {
      title: text,
      intro: "Here are ideas to help you talk about what makes you happy:",
      bullets: [
        "Talk about people who make you happy (family, friends, teachers, pets).",
        "Mention things that make you happy (hobbies, games, music, books, food).",
        "Tell a short story about a time when you felt really happy and what happened.",
        "Describe places where you feel happy and relaxed (home, park, club, your room).",
        "Explain how you can make other people happy too (kind words, helping, sharing)."
      ],
      extra:
        "You can connect happiness to your daily life: what small things make your normal day better?"
    };
  }

  if (text === "My favourite school day") {
    return {
      title: text,
      intro: "Use these ideas to talk about your favourite school day:",
      bullets: [
        "Say which day of the week it is and why it is your favourite.",
        "List the subjects you have that day and which one you enjoy the most.",
        "Describe something nice that usually happens (club, activity, game, project, break with friends).",
        "Tell a special memory from that day (a funny moment, a good mark, a teacher’s comment).",
        "Explain how you feel at the end of that school day and why."
      ],
      extra:
        "You can compare this day with another day that you don’t like so much to show the difference."
    };
  }

  // ✨ Older / general topics – keep them more general but still structured

  // Cars
  if (lower.includes("car")) {
    return {
      title: "Ideas about cars",
      intro:
        "Here are some concrete things you can talk about if your topic is cars:",
      bullets: [
        "Different types of cars: small city cars, family cars, sports cars, electric cars, SUVs.",
        "What engines do: they turn fuel (or electricity) into movement. You can mention petrol, diesel, hybrid and electric engines.",
        "Basic parts: engine, wheels, brakes, seats, seat belts, air bags, lights – choose 2–3 to describe.",
        "Safety and rules: wearing a seat belt, speed limits, traffic lights, driving tests.",
        "Famous brands or models you like and why (fast, safe, comfortable, cheap, electric, etc.)."
      ],
      extra:
        "You can pick ONE car you like and describe its look, speed, colour, and why it is your dream car."
    };
  }

  // Video games
  if (lower.includes("video game") || lower.includes("game")) {
    return {
      title: "Ideas about video games",
      intro:
        "If you talk about video games, try to choose one game or one type of game:",
      bullets: [
        "Name of the game, the company (if you know it) and what kind of game it is (adventure, sport, racing, puzzle, etc.).",
        "Basic story or goal: what do you have to do to win?",
        "What skills the game uses: strategy, quick reactions, teamwork, creativity.",
        "Positive sides: fun, relaxing, learning English, meeting friends online.",
        "Negative sides: too much screen time, addiction, violent content, not enough sleep."
      ],
      extra:
        "You can finish with your opinion about how many hours per day are healthy for gaming."
    };
  }

  // Social media / phones / apps / tech
  if (
    lower.includes("social media") ||
    lower.includes("instagram") ||
    lower.includes("tiktok") ||
    lower.includes("phone") ||
    lower.includes("mobile") ||
    lower.includes("app")
  ) {
    return {
      title: "Ideas about phones & social media",
      intro:
        "Here are some angles you can use if your topic is about phones, apps or social media:",
      bullets: [
        "What you mainly use your phone or social media for (chatting, school, games, videos).",
        "Good sides: quick communication, learning, entertainment, staying in touch with family.",
        "Bad sides: addiction, wasting time, cyberbullying, fake news.",
        "How to use phones and social media safely and in a healthy way.",
        "Your own rules for yourself: when you use it, when you stop, and how you balance it with study and sleep."
      ],
      extra:
        "You can add a short story about a time when using your phone helped you – and a time when it caused a problem."
    };
  }

  // Food / health
  if (
    lower.includes("food") ||
    lower.includes("fast food") ||
    lower.includes("healthy") ||
    lower.includes("diet")
  ) {
    return {
      title: "Ideas about food & health",
      intro:
        "If your topic is food, health or fast food, try to cover both sides:",
      bullets: [
        "Give examples of healthy foods and why they are good (vegetables, fruit, water, home-cooked meals).",
        "Give examples of unhealthy foods or habits (too much sugar, fried food, soft drinks).",
        "Explain how food affects your energy, sleep and mood.",
        "Talk about your own eating habits and what you would like to change.",
        "Give one or two tips for students who want to eat more healthily."
      ],
      extra:
        "You can compare a healthy day of eating with an unhealthy day to make your point clear."
    };
  }

  // Sports
  if (
    lower.includes("football") ||
    lower.includes("player") ||
    lower.includes("sport") ||
    lower.includes("team")
  ) {
    return {
      title: "Ideas about sports",
      intro:
        "Here are some ideas if your topic is about a sport, a team or a player:",
      bullets: [
        "Explain the basic rules of the sport in a simple way.",
        "Talk about why people like this sport (fun, fitness, teamwork, competition).",
        "If you talk about a team, say where it is from, its colours and some famous players.",
        "If you talk about a player, describe their skills, hard work and personality.",
        "Mention both the fun side of sport and the discipline needed (training, diet, sleep)."
      ],
      extra:
        "You can add a story about an important match you watched or played in."
    };
  }

  // School / homework / exams
  if (
    lower.includes("school") ||
    lower.includes("teacher") ||
    lower.includes("homework") ||
    lower.includes("exam") ||
    lower.includes("test")
  ) {
    return {
      title: "Ideas about school",
      intro:
        "These ideas work for topics about school life, homework or exams:",
      bullets: [
        "Describe one normal school day or one part of the day (morning, break, last period).",
        "Talk about subjects you like and dislike, and why.",
        "Explain how homework or exams make you feel and how you prepare.",
        "Give one good thing about your school and one thing you would like to improve.",
        "Share one funny or memorable moment that happened at school."
      ],
      extra:
        "You can end with advice for younger students about how to enjoy school more."
    };
  }

  // Environment / our planet
  if (
    lower.includes("environment") ||
    lower.includes("planet") ||
    lower.includes("pollution") ||
    lower.includes("plastic") ||
    lower.includes("climate")
  ) {
    return {
      title: "Ideas about the environment",
      intro:
        "If your topic is about the planet, pollution or climate, you can use these ideas:",
      bullets: [
        "Explain the problem in simple words (air pollution, plastic in the sea, global warming).",
        "Give one or two real examples from your country or from the news.",
        "Talk about how this problem affects people, animals or plants.",
        "Tell what governments or big companies can do to help.",
        "Say what children and teenagers can do in their daily life (use less plastic, save water, recycle)."
      ],
      extra:
        "Try to finish with a hopeful message, not just problems – show that people can change things."
    };
  }

  // Travel / places / countries
  if (
    lower.includes("travel") ||
    lower.includes("trip") ||
    lower.includes("country") ||
    lower.includes("city") ||
    lower.includes("tourism")
  ) {
    return {
      title: "Ideas about travel",
      intro:
        "For topics about travel or places, try to make your audience feel they are there with you:",
      bullets: [
        "Say where the place is and how you travelled there (car, bus, train, plane).",
        "Describe what you saw, heard and ate there.",
        "Explain something you learned about the people, culture or history.",
        "Tell a short story about something that happened on the trip.",
        "Say whether you would like to go back and why."
      ],
      extra:
        "You can compare this place with your hometown to show the differences."
    };
  }

  // Future / dreams / technology
  if (
    lower.includes("future") ||
    lower.includes("robot") ||
    lower.includes("invention") ||
    lower.includes("technology") ||
    lower.includes("job") ||
    lower.includes("dream")
  ) {
    return {
      title: "Ideas about the future",
      intro:
        "Here are ideas for topics about the future, your dreams or new technology:",
      bullets: [
        "Describe your dream job, dream invention or dream life in the future.",
        "Explain why this dream is interesting or important for you.",
        "Talk about what skills or steps you need to reach this dream.",
        "Say how technology might change school, work or home life.",
        "Mention one positive and one negative thing about this future."
      ],
      extra:
        "You can finish with a sentence starting with “In my opinion, the future will be…”"
    };
  }

  // Default: works for any topic
  return {
    title: "Ideas for your topic",
    intro:
      "If your topic doesn’t match any of the special categories, you can still build a strong presentation:",
    bullets: [
      "Start by saying what your topic is and give a simple definition in your own words.",
      "Explain why you chose this topic and why it is important or interesting.",
      "Give 2–3 real examples or short stories connected to the topic.",
      "Add at least one advantage and one disadvantage or one problem and one solution.",
      "Finish with your own opinion or message for the audience."
    ],
    extra:
      "When you feel stuck, imagine you are explaining this topic to a younger student: keep it clear, simple and friendly."
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

            const numericValue = rubricNumbers[key];
            const letterValue = rubricLetters[key] || "";
            const safeNumeric =
              typeof numericValue === "number"
                ? numericValue
                : numericValue !== undefined && numericValue !== null && numericValue !== ""
                ? numericValue
                : "–";

            return `
              <tr>
                <td>${safeLabel}</td>
                <td>${safeNumeric}</td>
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
                <th>Score</th>
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

    function buildStudentListCard(student) {
      const presentationCount = getPresentationCount(student);
      const totalPoints = getTotalPoints(student);
      const notPresented = presentationCount === 0;
      const badgeLabel = notPresented ? "Not Presented Yet" : getBadgeForPoints(totalPoints);
      const statusMarkup = notPresented
        ? `<span style="display:inline-block; margin-top:0.45rem; padding:0.3rem 0.7rem; border-radius:999px; background:rgba(255,255,255,0.08); font-size:0.82rem; font-weight:700;">Not Presented Yet</span>`
        : `<span style="display:inline-block; margin-top:0.45rem; padding:0.3rem 0.7rem; border-radius:999px; background:rgba(255,255,255,0.08); font-size:0.82rem; font-weight:700;">${escapeHtml(badgeLabel)}</span>`;

      return `
        <article class="student-card" style="padding:1rem; margin-bottom:0.9rem; border:1px solid rgba(255,255,255,0.08); border-radius:16px;">
          <div style="display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; flex-wrap:wrap;">
            <div>
              <h3 style="margin:0 0 0.35rem 0;">${escapeHtml(student.name || "Unnamed Student")}</h3>
              <p class="myscores-muted" style="margin:0;">Class: ${escapeHtml(student.class || "-")}</p>
              ${statusMarkup}
            </div>
            <div style="min-width:190px;">
              <p style="margin:0 0 0.35rem 0;"><strong>Presentations:</strong> ${presentationCount}</p>
              <p style="margin:0;"><strong>Total points:</strong> ${totalPoints}</p>
            </div>
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

      statusEl.textContent = `${sorted.length} student${sorted.length === 1 ? "" : "s"} shown${classText}${searchText}. ${zeroCount} not presented yet.`;
      resultEl.innerHTML = sorted.map(buildStudentListCard).join("");
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




