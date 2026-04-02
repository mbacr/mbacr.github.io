import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSavePatient");
const btnSearch = document.getElementById("btnSearch");
const btnClearSearch = document.getElementById("btnClearSearch");
const txtSearch = document.getElementById("txtSearch");
const txtId = document.getElementById("txtPatientId");
const txtFirstName = document.getElementById("txtFirstName");
const txtLastName = document.getElementById("txtLastName");
const txtDob = document.getElementById("txtDob");
const txtPhone = document.getElementById("txtPhone");
const txtEmail = document.getElementById("txtEmail");
const txtAddress = document.getElementById("txtAddress");
const selBloodType = document.getElementById("selBloodType");
const txtAllergies = document.getElementById("txtAllergies");
const tbody = document.getElementById("tbodyPatients");
const modalTitle = document.getElementById("modalPatientTitle");
const modalEl = document.getElementById("modalPatient");

window.onload = () => {
  consultarPatients();
};

btnSave.addEventListener("click", async () => guardarPatient());
btnSearch.addEventListener("click", async () => consultarPatients());
btnClearSearch.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarPatients();
});

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarPatient(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Patients").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading patient" });
    return;
  }

  txtId.value = data.id;
  txtFirstName.value = data.firstName;
  txtLastName.value = data.lastName;
  txtDob.value = data.dob;
  txtPhone.value = data.phone;
  txtEmail.value = data.email;
  txtAddress.value = data.address || "";
  selBloodType.value = data.bloodType;
  txtAllergies.value = data.allergies || "";
  modalTitle.textContent = "Edit Patient";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const consultarPatients = async () => {
  const search = txtSearch.value.trim();
  const query = supabase.from("Patients").select("id,firstName,lastName,dob,phone,email,bloodType");

  if (search.length > 0) {
    query.or(`firstName.ilike.%${search}%,lastName.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading patients" });
    return;
  }

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.firstName ?? ""} ${r.lastName ?? ""}</td>
      <td>${r.dob ?? ""}</td>
      <td>${r.phone ?? ""}</td>
      <td>${r.email ?? ""}</td>
      <td>${r.bloodType ?? ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarPatient = async () => {
  const patient = {
    firstName: txtFirstName.value.trim(),
    lastName: txtLastName.value.trim(),
    dob: txtDob.value,
    phone: txtPhone.value.trim(),
    email: txtEmail.value.trim(),
    address: txtAddress.value.trim(),
    bloodType: selBloodType.value,
    allergies: txtAllergies.value.trim(),
  };

  if (!patient.firstName || !patient.lastName) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Patients").update(patient).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating patient" });
      return;
    }
  } else {
    const { error } = await supabase.from("Patients").insert([patient]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving patient" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Patient saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarPatients();
};

const eliminarPatient = async (id) => {
  Swal.fire({
    title: "Delete this patient?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Patients").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting patient" });
        return;
      }
      consultarPatients();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtFirstName.value = "";
  txtLastName.value = "";
  txtDob.value = "";
  txtPhone.value = "";
  txtEmail.value = "";
  txtAddress.value = "";
  selBloodType.value = "O+";
  txtAllergies.value = "";
  modalTitle.textContent = "New Patient";
  btnSave.textContent = "Save Patient";
};