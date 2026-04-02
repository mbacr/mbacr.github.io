import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSavePrescription");
const txtId = document.getElementById("txtPrescriptionId");
const selPatient = document.getElementById("selPatient");
const selDentist = document.getElementById("selDentist");
const txtDate = document.getElementById("txtDateIssued");
const txtMedication = document.getElementById("txtMedication");
const txtDosage = document.getElementById("txtDosage");
const txtInstructions = document.getElementById("txtInstructions");
const tbody = document.getElementById("tbodyPrescriptions");
const modalTitle = document.getElementById("modalPrescriptionTitle");
const modalEl = document.getElementById("modalPrescription");

window.onload = () => {
  consultarPrescriptions();
};

btnSave.addEventListener("click", async () => guardarPrescription());

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

modalEl.addEventListener("show.bs.modal", async () => {
  await cargarDropdowns();
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarPrescription(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Prescriptions").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading prescription" });
    return;
  }

  await cargarDropdowns();
  txtId.value = data.id;
  selPatient.value = data.patientId;
  selDentist.value = data.dentistId;
  txtDate.value = data.dateIssued;
  txtMedication.value = data.medication;
  txtDosage.value = data.dosage;
  txtInstructions.value = data.instructions;
  modalTitle.textContent = "Edit Prescription";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const cargarDropdowns = async () => {
  const [patients, dentists] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
  ]);

  selPatient.innerHTML = '<option value="">Select patient</option>';
  (patients.data || []).forEach((p) => {
    selPatient.innerHTML += `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`;
  });

  selDentist.innerHTML = '<option value="">Select dentist</option>';
  (dentists.data || []).forEach((d) => {
    selDentist.innerHTML += `<option value="${d.id}">Dr. ${d.firstName} ${d.lastName}</option>`;
  });
};

const consultarPrescriptions = async () => {
  const { data, error } = await supabase.from("Prescriptions").select("*");
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading prescriptions" });
    return;
  }

  const [patients, dentists] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
  ]);

  const patientMap = {};
  (patients.data || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));
  const dentistMap = {};
  (dentists.data || []).forEach((d) => (dentistMap[d.id] = `Dr. ${d.firstName} ${d.lastName}`));

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.dateIssued ?? ""}</td>
      <td>${patientMap[r.patientId] ?? ""}</td>
      <td>${dentistMap[r.dentistId] ?? ""}</td>
      <td>${r.medication ?? ""}</td>
      <td>${r.dosage ?? ""}</td>
      <td>${r.instructions ?? ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarPrescription = async () => {
  const prescription = {
    patientId: parseInt(selPatient.value),
    dentistId: parseInt(selDentist.value),
    dateIssued: txtDate.value,
    medication: txtMedication.value.trim(),
    dosage: txtDosage.value.trim(),
    instructions: txtInstructions.value.trim(),
  };

  if (!prescription.patientId || !prescription.dentistId || !prescription.dateIssued || !prescription.medication) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Prescriptions").update(prescription).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating prescription" });
      return;
    }
  } else {
    const { error } = await supabase.from("Prescriptions").insert([prescription]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving prescription" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Prescription saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarPrescriptions();
};

const eliminarPrescription = async (id) => {
  Swal.fire({
    title: "Delete this prescription?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Prescriptions").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting prescription" });
        return;
      }
      consultarPrescriptions();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  selPatient.value = "";
  selDentist.value = "";
  txtDate.value = "";
  txtMedication.value = "";
  txtDosage.value = "";
  txtInstructions.value = "";
  modalTitle.textContent = "New Prescription";
  btnSave.textContent = "Save Prescription";
};