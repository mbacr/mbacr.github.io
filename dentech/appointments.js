import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSaveAppointment");
const txtId = document.getElementById("txtAppointmentId");
const selPatient = document.getElementById("selPatient");
const selDentist = document.getElementById("selDentist");
const selAssistant = document.getElementById("selAssistant");
const txtStart = document.getElementById("txtStart");
const txtEnd = document.getElementById("txtEnd");
const selStatus = document.getElementById("selStatus");
const txtNotes = document.getElementById("txtNotes");
const tbody = document.getElementById("tbodyAppointments");
const modalTitle = document.getElementById("modalAppointmentTitle");
const modalEl = document.getElementById("modalAppointment");

window.onload = () => {
  consultarAppointments();
};

btnSave.addEventListener("click", async () => guardarAppointment());

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

modalEl.addEventListener("show.bs.modal", async () => {
  await cargarDropdowns();
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;
  const id = target.getAttribute("data-id");
  await eliminarAppointment(id);
});

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;
  const id = target.getAttribute("data-id");

  const { data, error } = await supabase.from("Appointments").select("*").eq("id", id).single();
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading appointment" });
    return;
  }

  await cargarDropdowns();
  txtId.value = data.id;
  selPatient.value = data.patientId;
  selDentist.value = data.dentistId;
  selAssistant.value = data.staffId || "";
  txtStart.value = data.startTime;
  txtEnd.value = data.endTime;
  selStatus.value = data.status;
  txtNotes.value = data.notes || "";
  modalTitle.textContent = "Edit Appointment";

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
});

const cargarDropdowns = async () => {
  const [patients, dentists, staff] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
    supabase.from("Staff").select("id,name"),
  ]);

  selPatient.innerHTML = '<option value="">Select patient</option>';
  (patients.data || []).forEach((p) => {
    selPatient.innerHTML += `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`;
  });

  selDentist.innerHTML = '<option value="">Select dentist</option>';
  (dentists.data || []).forEach((d) => {
    selDentist.innerHTML += `<option value="${d.id}">Dr. ${d.firstName} ${d.lastName}</option>`;
  });

  selAssistant.innerHTML = '<option value="">None</option>';
  (staff.data || []).forEach((s) => {
    selAssistant.innerHTML += `<option value="${s.id}">${s.name}</option>`;
  });
};

const consultarAppointments = async () => {
  const { data, error } = await supabase.from("Appointments").select("*");
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading appointments" });
    return;
  }

  const [patients, dentists, staff] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
    supabase.from("Staff").select("id,name"),
  ]);

  const patientMap = {};
  (patients.data || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));
  const dentistMap = {};
  (dentists.data || []).forEach((d) => (dentistMap[d.id] = `Dr. ${d.firstName} ${d.lastName}`));
  const staffMap = {};
  (staff.data || []).forEach((s) => (staffMap[s.id] = s.name));

  const statusBadge = (s) => {
    const colors = { Confirmed: "bg-success", Pending: "bg-warning text-dark", Cancelled: "bg-danger", Completed: "bg-info" };
    return `<span class="badge ${colors[s] || "bg-secondary"}">${s}</span>`;
  };

  tbody.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${patientMap[r.patientId] ?? ""}</td>
      <td>${dentistMap[r.dentistId] ?? ""}</td>
      <td>${staffMap[r.staffId] ?? "—"}</td>
      <td>${r.startTime ?? ""}</td>
      <td>${r.endTime ?? ""}</td>
      <td>${statusBadge(r.status)}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i></button>
        <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
      </td>`;
    tbody.appendChild(tr);
  });
};

const guardarAppointment = async () => {
  const appointment = {
    patientId: parseInt(selPatient.value),
    dentistId: parseInt(selDentist.value),
    staffId: selAssistant.value ? parseInt(selAssistant.value) : null,
    startTime: txtStart.value,
    endTime: txtEnd.value,
    status: selStatus.value,
    notes: txtNotes.value.trim(),
  };

  if (!appointment.patientId || !appointment.dentistId || !appointment.startTime) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in required fields" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Appointments").update(appointment).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating appointment" });
      return;
    }
  } else {
    const { error } = await supabase.from("Appointments").insert([appointment]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving appointment" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Appointment saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarAppointments();
};

const eliminarAppointment = async (id) => {
  Swal.fire({
    title: "Delete this appointment?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Appointments").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting appointment" });
        return;
      }
      consultarAppointments();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  selPatient.value = "";
  selDentist.value = "";
  selAssistant.value = "";
  txtStart.value = "";
  txtEnd.value = "";
  selStatus.value = "Pending";
  txtNotes.value = "";
  modalTitle.textContent = "New Appointment";
  btnSave.textContent = "Save Appointment";
};