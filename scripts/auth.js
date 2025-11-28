// auth.js - Page-specific auth logic (depends on main.js)

onReady(() => {
  // setup password toggles using shared helper(s)
  setupPasswordToggle("password", "togglePassword", {
    eyeOn: "eye",
    eyeOff: "eye-off",
    showText: "Show",
    hideText: "Hide",
  });
  setupPasswordToggle("confirmPassword", "toggleConfirmPassword", {
    eyeOn: "eye",
    eyeOff: "eye-off",
  });

  updateIcons();

  // Registration form
  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Use native constraint validation first
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      // Validate password / confirm match using shared validators
      const pwd = document.getElementById("password");
      const confirmPwd = document.getElementById("confirmPassword");

      // Use shared validators
      const okPwd = validatePassword(pwd, 6);
      const okConfirm = validateConfirmPassword(confirmPwd, pwd.value);

      if (!okPwd || !okConfirm) return;

      // success
      const success = document.getElementById("successMessage");
      if (success) success.classList.remove("d-none");

      this.reset();
      this.classList.remove("was-validated");
      // clear validation classes
      [pwd, confirmPwd].forEach(
        (i) => i && i.classList.remove("is-valid", "is-invalid")
      );
    });
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    // If login page uses toggle with same id
    setupPasswordToggle("password", "togglePassword", {
      eyeOn: "eye",
      eyeOff: "eye-off",
    });

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add("was-validated");
        return;
      }

      // Optionally validate using shared helpers if elements exist
      const pwd = document.getElementById("password");
      const email =
        document.getElementById("loginEmail") ||
        document.getElementById("email");

      if (email && !validateEmail(email)) return;
      if (pwd && !validatePassword(pwd, 6)) return;

      const success = document.getElementById("successMessage");
      if (success) success.classList.remove("d-none");

      // placeholder login success action
      setTimeout(() => {
        console.log("Login successful");
      }, 1500);
    });
  }
});
