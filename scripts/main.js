// main.js - Shared helpers (load this BEFORE page scripts)

// ---------- Small DOM helpers ----------
window.$ = (sel, root = document) => root.querySelector(sel);
window.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ---------- Icon helper ----------
window.updateIcons = function () {
  if (window.lucide && typeof lucide.createIcons === "function") {
    lucide.createIcons();
  }
};

// ---------- Password toggle (shared) ----------
window.setupPasswordToggle = function (inputId, buttonId, opts = {}) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  if (!input || !button) return;

  button.addEventListener("click", function (e) {
    e.preventDefault();
    const type = input.type === "password" ? "text" : "password";
    input.type = type;

    // Icon handling: try <i data-lucide="..."> or text fallback
    const icon = this.querySelector("i");
    if (icon) {
      // prefer 'eye' / 'eye-closed' or 'eye' / 'eye-off' depending on your markup
      const eyeOn = opts.eyeOn || "eye";
      const eyeOff = opts.eyeOff || "eye-closed";
      icon.setAttribute("data-lucide", type === "password" ? eyeOn : eyeOff);
      updateIcons();
    } else {
      // fallback: toggle text
      this.textContent =
        type === "password" ? opts.showText || "Show" : opts.hideText || "Hide";
    }
  });
};

// ---------- Validation (string-level) ----------
window.validateNameString = function (name) {
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};

window.validateEmailString = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ---------- Validation (element-level) ----------
window.showError = function (input, message) {
  if (!input) return;
  removeError(input);
  input.classList.add("is-invalid");
  const errorDiv = document.createElement("div");
  errorDiv.className = "invalid-feedback";
  errorDiv.textContent = message;
  // if input is inside an input-group, append after the group
  const parent = input.parentElement;
  parent.appendChild(errorDiv);
};

window.removeError = function (input) {
  if (!input) return;
  input.classList.remove("is-invalid");
  const errorDiv = input.parentElement.querySelector(".invalid-feedback");
  if (errorDiv) errorDiv.remove();
};

window.showSuccess = function (input) {
  if (!input) return;
  removeError(input);
  input.classList.add("is-valid");
};

// Higher-level validators that pages can call
window.validateName = function (input, fieldName = "This field") {
  const value = input.value.trim();
  if (value === "") {
    showError(input, `${fieldName} is required`);
    return false;
  }
  if (!validateNameString(value)) {
    showError(input, `${fieldName} must contain only letters`);
    return false;
  }
  showSuccess(input);
  return true;
};

window.validateEmail = function (input) {
  const value = input.value.trim();
  if (value === "") {
    showError(input, "Email address is required");
    return false;
  }
  if (!validateEmailString(value)) {
    showError(input, "Please enter a valid email address");
    return false;
  }
  showSuccess(input);
  return true;
};

window.validatePassword = function (input, minLength = 6) {
  const value = input.value;
  if (value === "") {
    showError(input, "Password is required");
    return false;
  }
  if (value.length < minLength) {
    showError(input, `Password must be at least ${minLength} characters long`);
    return false;
  }
  showSuccess(input);
  return true;
};

window.validateConfirmPassword = function (input, originalPassword) {
  const value = input.value;
  if (value === "") {
    showError(input, "Please confirm your password");
    return false;
  }
  if (value !== originalPassword) {
    showError(input, "Passwords do not match");
    return false;
  }
  showSuccess(input);
  return true;
};

// ---------- Shared fetch for jobs (cached) ----------
window._jobsCache = null;
window.fetchJobs = async function (path = "../data/jobs-posting.json") {
  if (window._jobsCache) return window._jobsCache;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Network response not ok");
    const json = await res.json();
    window._jobsCache = json;
    return json;
  } catch (err) {
    console.error("fetchJobs error:", err);
    throw err;
  }
};

// ---------- Simple storage helpers (optional) ----------
window.saveJSON = function (key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("saveJSON failed", e);
  }
};

window.loadJSON = function (key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    return null;
  }
};

// ---------- Placeholders for UI actions pages can override ----------
window.toggleBookmark = function (jobId) {
  // default placeholder: pages can override or call this to extend
  console.log("Bookmark toggled (default):", jobId);
};

window.viewJobDetails = function (jobId) {
  // default navigation helper
  window.location.href = `job-details.html?id=${jobId}`;
};

// ---------- Utility to safely attach DOMContentLoaded handlers from other scripts ----------
window.onReady = function (fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 0);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};
