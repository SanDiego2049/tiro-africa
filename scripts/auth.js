document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registrationForm");

  if (loginForm) {
    initLoginForm(loginForm);
  }

  if (registerForm) {
    initRegisterForm(registerForm);
  }
});

// ----- Login form -----

function initLoginForm(form) {
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Let browser + Bootstrap handle required, type="email", etc.
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    form.classList.remove("was-validated");

    if (successMessage) {
      successMessage.classList.remove("d-none");
      setTimeout(() => {
        successMessage.classList.add("d-none");
      }, 4000);
    }

    // Placeholder: this is where you'd send data to your backend
    console.log("Login form is valid. Submit to server here.");
  });
}

// ----- Register form -----

function initRegisterForm(form) {
  const successMessage = document.getElementById("successMessage");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    // First, let native validation run (required, email, etc.)
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Extra check: passwords must match (if both fields exist)
    if (passwordInput && confirmPasswordInput) {
      const password = passwordInput.value;
      const confirm = confirmPasswordInput.value;

      // Reset previous invalid state
      confirmPasswordInput.classList.remove("is-invalid");

      if (password !== confirm) {
        form.classList.add("was-validated");
        confirmPasswordInput.classList.add("is-invalid");

        const feedback =
          confirmPasswordInput.parentElement.querySelector(".invalid-feedback");
        if (feedback) {
          feedback.textContent = "Passwords do not match.";
        }
        return;
      }
    }

    // All good
    form.classList.remove("was-validated");

    if (successMessage) {
      successMessage.classList.remove("d-none");
      setTimeout(() => {
        successMessage.classList.add("d-none");
      }, 4000);
    }

    form.reset();

    // Clear any visual validation classes
    Array.from(form.querySelectorAll(".is-valid, .is-invalid")).forEach((el) =>
      el.classList.remove("is-valid", "is-invalid")
    );
  });
}
