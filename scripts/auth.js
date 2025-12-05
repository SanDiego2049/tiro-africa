document.addEventListener("DOMContentLoaded", () => {
  // Phone validation
  const phone = document.getElementById("phone");
  if (phone) {
    const feedback = phone.parentElement.nextElementSibling;
    phone.addEventListener("input", function () {
      const val = this.value;
      if (!val.length) {
        this.classList.remove("is-invalid");
        this.setCustomValidity("");
        if (feedback) feedback.style.display = "none";
        return;
      }
      const invalid = /[a-zA-Z]/.test(val) || this.validity.patternMismatch;
      this.classList.toggle("is-invalid", invalid);
      this.setCustomValidity(invalid ? "Invalid" : "");
    });
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const successMsg = document.getElementById("successMessage");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!loginForm.checkValidity()) {
        loginForm.classList.add("was-validated");
        return;
      }
      loginForm.classList.remove("was-validated");
      if (successMsg) {
        successMsg.classList.remove("d-none");
        setTimeout(() => successMsg.classList.add("d-none"), 4000);
      }
    });
  }

  // Register form
  const registerForm = document.getElementById("registrationForm");
  if (registerForm) {
    const successMsg = document.getElementById("successMessage");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!registerForm.checkValidity()) {
        registerForm.classList.add("was-validated");
        return;
      }

      // Password match check
      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.classList.add("is-invalid");
        const feedback = confirmPassword.parentElement.querySelector(".invalid-feedback");
        if (feedback) feedback.textContent = "Passwords do not match.";
        registerForm.classList.add("was-validated");
        return;
      }

      registerForm.classList.remove("was-validated");
      if (successMsg) {
        successMsg.classList.remove("d-none");
        setTimeout(() => successMsg.classList.add("d-none"), 4000);
      }
      registerForm.reset();
      registerForm.querySelectorAll(".is-valid, .is-invalid").forEach((el) =>
        el.classList.remove("is-valid", "is-invalid")
      );
    });
  }
});