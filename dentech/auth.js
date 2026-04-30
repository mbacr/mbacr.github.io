document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const span = document.getElementById("userEmail");
  if (span) span.textContent = user.email || "";

  const btn = document.getElementById("btnLogout");
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.replace("login.html");
    });
  }
});
