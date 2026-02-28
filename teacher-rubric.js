const API_URL =
  "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

function ensureStatusEl(form) {
  let status = document.getElementById("status");
  if (status) return status;

  status = document.createElement("div");
  status.id = "status";
  status.className = "hint";
  status.style.marginTop = "10px";

  // Put it right above the submit button area if possible
  const actions = form.querySelector(".form-actions");
  if (actions && actions.parentElement) {
    actions.parentElement.insertBefore(status, actions);
  } else {
    form.appendChild(status);
  }
  return status;
}

function setStatus(statusEl, msg) {
  if (!statusEl) return;
  statusEl.textContent = msg || "";
}

async function submitRubricsWithKeyCheck(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const status = ensureStatusEl(form);

  setStatus(status, "Saving...");

  try {
    // Send as form-urlencoded so Apps Script can read e.parameter
    const formData = new FormData(form);
    const body = new URLSearchParams();
    for (const [k, v] of formData.entries()) body.append(k, String(v));

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: body.toString(),
    });

    const text = await res.text();

    // ✅ Backend MUST return JSON:
    // { ok:false, error:"Wrong teacher code" } OR { ok:true }
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      setStatus(status, "Server response is not JSON. Fix Apps Script to return JSON.");
      console.error("Non-JSON response:", text);
      return;
    }

    if (!data.ok) {
      setStatus(status, data.error || "Wrong teacher code");
      return;
    }

    setStatus(status, "Saved ✅");
  } catch (err) {
    setStatus(status, "Error: " + err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rubrics-form");
  if (!form) return;

  // Stop iframe-submit behavior and use fetch instead
  form.addEventListener("submit", submitRubricsWithKeyCheck);
});