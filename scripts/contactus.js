// contactus.js - combined contact + login/signup UI logic (depends on main.js)

onReady(() => {
  // Determine if this page has auth elements or the contact form
  const isLoginPage = !!document.getElementById("loginForm");

  if (isLoginPage) {
    initializeLoginPage();
  } else {
    initializeContactPage();
  }

  updateIcons();
});

// --- Login / Signup UI (only UI switching & wiring; validation uses shared helpers) ---
function initializeContactPage() {
  const form = document.getElementById("contactForm");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const successMessage = document.getElementById("successMessage");

  if (!form) return;

  // Live validation
  firstName.addEventListener("input", () =>
    validateName(firstName, "First name")
  );
  lastName.addEventListener("input", () => validateName(lastName, "Last name"));
  email.addEventListener("input", () => validateEmail(email));

  message.addEventListener("input", () => {
    if (message.value.trim() === "") {
      showError(message, "Message is required");
    } else {
      showSuccess(message);
    }
  });

  // On submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let ok = true;

    if (!validateName(firstName, "First name")) ok = false;
    if (!validateName(lastName, "Last name")) ok = false;
    if (!validateEmail(email)) ok = false;

    if (message.value.trim() === "") {
      showError(message, "Message is required");
      ok = false;
    } else {
      showSuccess(message);
    }

    if (!ok) return;

    // Show success message
    successMessage.classList.remove("d-none");

    // Reset form
    form.reset();
    [firstName, lastName, email, message].forEach((el) =>
      el.classList.remove("is-valid")
    );
  });
}

