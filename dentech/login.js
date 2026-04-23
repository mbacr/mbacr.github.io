import { supabase } from "./supabase.js";

const form = document.getElementById("loginForm");
const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = txtEmail.value.trim();
  const password = txtPassword.value.trim();

  if (!email || !password) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in all fields" });
    return;
  }

  const { data, error } = await supabase
    .from("Staff")
    .select("id, name, email")
    .eq("email", email)
    .eq("password", password)
    .limit(1);

  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: error.message });
    return;
  }

  const match = data && data[0];

  if (!match) {
    Swal.fire({
      icon: "error",
      title: "Invalid credentials",
      text: "The email or password you entered is incorrect. Please try again.",
    });
    return;
  }

  localStorage.setItem("user", JSON.stringify({ id: match.id, name: match.name, email: match.email }));
  window.location.href = "index.html";
});