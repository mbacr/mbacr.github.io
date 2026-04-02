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

  // Debug: fetch all staff to see what's stored
  const { data: allStaff, error: debugError } = await supabase.from("Staff").select("*");
  console.log("All staff records:", allStaff);
  console.log("Trying email:", email, "password:", password);

  if (debugError) {
    Swal.fire({ icon: "error", title: "Error", text: debugError.message });
    return;
  }

  const match = allStaff.find((s) => s.email === email && s.password === password);

  if (!match) {
    const emails = (allStaff || []).map((s) => `${s.email} (pwd: ${s.password ? "set" : "empty"})`).join(", ");
    Swal.fire({ icon: "error", title: "No match", text: `Staff in DB: ${emails || "none"}. You typed: ${email}` });
    return;
  }

  localStorage.setItem("user", JSON.stringify({ id: match.id, name: match.name, email: match.email }));
  window.location.href = "index.html";
});