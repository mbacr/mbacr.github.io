import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSaveProcedure");
const txtId = document.getElementById("txtProcedureId");
const selAppointment = document.getElementById("selAppointment");
const selTreatment = document.getElementById("selTreatment");
const selDentist = document.getElementById("selDentist");
const txtDate = document.getElementById("txtDatePerformed");
const txtPrice = document.getElementById("txtPrice");
const txtNotes = document.getElementById("txtNotes");
const tbody = document.getElementById("tbodyProcedures");
const modalTitle = document.getElementById("modalProcedureTitle");
const modalEl = document.getElementById("modalProcedure");

window.onload = () => {
  consultarProcedures();
};

btnSave.addEventListener("click", async () => guardarProcedure());

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

modalEl.addEventListener("show.bs.modal", async () => {
  await cargarDropdowns();
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarProcedure(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Procedures").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading procedure" });
    return;
  }

  await cargarDropdowns();
  txtId.value = data.id;
  selAppointment.value = data.appointmentId;
  selTreatment.value = data.treatmentId;
  selDentist.value = data.dentistId;
  txtDate.value = data.datePerformed;
  txtPrice.value = data.price;
  txtNotes.value = data.notes || "";
  modalTitle.textContent = "Edit Procedure Record";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const cargarDropdowns = async () => {
  const [appointments, treatments, dentists, patients] = await Promise.all([
    supabase.from("Appointments").select("id,patientId"),
    supabase.from("Treatments").select("id,name"),
    supabase.from("Dentists").select("id,firstName,lastName"),
    supabase.from("Patients").select("id,firstName,lastName"),
  ]);

  const patientMap = {};
  (patients.data || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));

  selAppointment.innerHTML = '<option value="">Select appointment</option>';
  (appointments.data || []).forEach((a) => {
    selAppointment.innerHTML += `<option value="${a.id}">#${a.id} - ${patientMap[a.patientId] ?? "Unknown"}</option>`;
  });

  selTreatment.innerHTML = '<option value="">Select treatment</option>';
  (treatments.data || []).forEach((t) => {
    selTreatment.innerHTML += `<option value="${t.id}">${t.name}</option>`;
  });

  selDentist.innerHTML = '<option value="">Select dentist</option>';
  (dentists.data || []).forEach((d) => {
    selDentist.innerHTML += `<option value="${d.id}">Dr. ${d.firstName} ${d.lastName}</option>`;
  });
};

const consultarProcedures = async () => {
  const { data, error } = await supabase.from("Procedures").select("*");
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading procedures" });
    return;
  }

  const [patients, dentists, treatments, appointments] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
    supabase.from("Treatments").select("id,name"),
    supabase.from("Appointments").select("id,patientId"),
  ]);

  const patientMap = {};
  (patients.data || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));
  const dentistMap = {};
  (dentists.data || []).forEach((d) => (dentistMap[d.id] = `Dr. ${d.firstName} ${d.lastName}`));
  const treatmentMap = {};
  (treatments.data || []).forEach((t) => (treatmentMap[t.id] = t.name));
  const appointmentPatientMap = {};
  (appointments.data || []).forEach((a) => (appointmentPatientMap[a.id] = patientMap[a.patientId]));

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.datePerformed ?? ""}</td>
      <td>${appointmentPatientMap[r.appointmentId] ?? ""}</td>
      <td>${dentistMap[r.dentistId] ?? ""}</td>
      <td>${treatmentMap[r.treatmentId] ?? ""}</td>
      <td>$${Number(r.price || 0).toFixed(2)}</td>
      <td>${r.notes ?? ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarProcedure = async () => {
  const procedure = {
    appointmentId: parseInt(selAppointment.value),
    treatmentId: parseInt(selTreatment.value),
    dentistId: parseInt(selDentist.value),
    datePerformed: txtDate.value,
    price: parseFloat(txtPrice.value),
    notes: txtNotes.value.trim(),
  };

  if (!procedure.appointmentId || !procedure.treatmentId || !procedure.dentistId || !procedure.datePerformed) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Procedures").update(procedure).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating procedure" });
      return;
    }
  } else {
    const { error } = await supabase.from("Procedures").insert([procedure]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving procedure" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Procedure saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarProcedures();
};

const eliminarProcedure = async (id) => {
  Swal.fire({
    title: "Delete this procedure record?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Procedures").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting procedure" });
        return;
      }
      consultarProcedures();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  selAppointment.value = "";
  selTreatment.value = "";
  selDentist.value = "";
  txtDate.value = "";
  txtPrice.value = "";
  txtNotes.value = "";
  modalTitle.textContent = "New Procedure Record";
  btnSave.textContent = "Save Record";
};