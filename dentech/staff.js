import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSaveStaff");
const btnSearch = document.getElementById("btnSearch");
const btnClearSearch = document.getElementById("btnClearSearch");
const txtSearch = document.getElementById("txtSearch");
const txtId = document.getElementById("txtStaffId");
const txtName = document.getElementById("txtName");
const selRole = document.getElementById("selRole");
const txtPhone = document.getElementById("txtPhone");
const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const tbody = document.getElementById("tbodyStaff");
const modalTitle = document.getElementById("modalStaffTitle");
const modalEl = document.getElementById("modalStaff");

window.onload = () => {
  consultarStaff();
};

btnSave.addEventListener("click", async () => guardarStaff());
btnSearch.addEventListener("click", async () => consultarStaff());
btnClearSearch.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarStaff();
});

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarStaff(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Staff").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading staff member" });
    return;
  }

  txtId.value = data.id;
  txtName.value = data.name;
  selRole.value = data.role;
  txtPhone.value = data.phone;
  txtEmail.value = data.email;
  txtPassword.value = data.password || "";
  modalTitle.textContent = "Edit Staff Member";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const consultarStaff = async () => {
  const search = txtSearch.value.trim();
  const query = supabase.from("Staff").select("id,name,role,phone,email");

  if (search.length > 0) {
    query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading staff" });
    return;
  }

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.name ?? ""}</td>
      <td>${r.role ?? ""}</td>
      <td>${r.phone ?? ""}</td>
      <td>${r.email ?? ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarStaff = async () => {
  const staff = {
    name: txtName.value.trim(),
    role: selRole.value,
    phone: txtPhone.value.trim(),
    email: txtEmail.value.trim(),
    password: txtPassword.value.trim(),
  };

  if (!staff.name) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Staff").update(staff).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating staff" });
      return;
    }
  } else {
    const { error } = await supabase.from("Staff").insert([staff]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving staff" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Staff saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarStaff();
};

const eliminarStaff = async (id) => {
  Swal.fire({
    title: "Delete this staff member?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Staff").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting staff" });
        return;
      }
      consultarStaff();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtName.value = "";
  selRole.value = "Dental Hygienist";
  txtPhone.value = "";
  txtEmail.value = "";
  txtPassword.value = "";
  modalTitle.textContent = "New Staff Member";
  btnSave.textContent = "Save Staff";
};