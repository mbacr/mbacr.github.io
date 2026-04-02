import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSaveDentist");
const btnSearch = document.getElementById("btnSearch");
const btnClearSearch = document.getElementById("btnClearSearch");
const txtSearch = document.getElementById("txtSearch");
const txtId = document.getElementById("txtDentistId");
const txtFirstName = document.getElementById("txtFirstName");
const txtLastName = document.getElementById("txtLastName");
const txtLicense = document.getElementById("txtLicense");
const selSpecialty = document.getElementById("selSpecialty");
const txtPhone = document.getElementById("txtPhone");
const txtEmail = document.getElementById("txtEmail");
const tbody = document.getElementById("tbodyDentists");
const modalTitle = document.getElementById("modalDentistTitle");
const modalEl = document.getElementById("modalDentist");

window.onload = () => {
  consultarDentists();
};

btnSave.addEventListener("click", async () => guardarDentist());
btnSearch.addEventListener("click", async () => consultarDentists());
btnClearSearch.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarDentists();
});

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarDentist(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Dentists").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading dentist" });
    return;
  }

  txtId.value = data.id;
  txtFirstName.value = data.firstName;
  txtLastName.value = data.lastName;
  txtLicense.value = data.licenseNumber;
  selSpecialty.value = data.specialty;
  txtPhone.value = data.phone;
  txtEmail.value = data.email;
  modalTitle.textContent = "Edit Dentist";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const consultarDentists = async () => {
  const search = txtSearch.value.trim();
  const query = supabase.from("Dentists").select("id,firstName,lastName,licenseNumber,specialty,phone,email");

  if (search.length > 0) {
    query.or(`firstName.ilike.%${search}%,lastName.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading dentists" });
    return;
  }

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.firstName ?? ""} ${r.lastName ?? ""}</td>
      <td>${r.licenseNumber ?? ""}</td>
      <td>${r.specialty ?? ""}</td>
      <td>${r.phone ?? ""}</td>
      <td>${r.email ?? ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarDentist = async () => {
  const dentist = {
    firstName: txtFirstName.value.trim(),
    lastName: txtLastName.value.trim(),
    licenseNumber: txtLicense.value.trim(),
    specialty: selSpecialty.value,
    phone: txtPhone.value.trim(),
    email: txtEmail.value.trim(),
  };

  if (!dentist.firstName || !dentist.lastName) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Dentists").update(dentist).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating dentist" });
      return;
    }
  } else {
    const { error } = await supabase.from("Dentists").insert([dentist]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving dentist" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Dentist saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarDentists();
};

const eliminarDentist = async (id) => {
  Swal.fire({
    title: "Delete this dentist?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Dentists").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting dentist" });
        return;
      }
      consultarDentists();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtFirstName.value = "";
  txtLastName.value = "";
  txtLicense.value = "";
  selSpecialty.value = "Orthodontics";
  txtPhone.value = "";
  txtEmail.value = "";
  modalTitle.textContent = "New Dentist";
  btnSave.textContent = "Save Dentist";
};