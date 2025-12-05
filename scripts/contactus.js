document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    // Let the browser + Bootstrap handle validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // if valid: show success, reset state
    form.classList.remove("was-validated");

    if (successMessage) {
      successMessage.classList.remove("d-none");
      // Optional: auto-hide after a few seconds
      setTimeout(() => {
        successMessage.classList.add("d-none");
      }, 4000);
    }

    form.reset();
  });
});
