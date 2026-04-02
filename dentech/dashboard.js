import { supabase } from "./supabase.js";

const countPatients = document.getElementById("countPatients");
const countAppointments = document.getElementById("countAppointments");
const countDentists = document.getElementById("countDentists");
const countPrescriptions = document.getElementById("countPrescriptions");
const tbodyAppointments = document.getElementById("tbodyUpcoming");
const listPrescriptions = document.getElementById("listPrescriptions");

window.onload = async () => {
  await Promise.all([loadCounts(), loadUpcomingAppointments(), loadRecentPrescriptions()]);
};

const loadCounts = async () => {
  const [patients, appointments, dentists, prescriptions] = await Promise.all([
    supabase.from("Patients").select("id", { count: "exact", head: true }),
    supabase.from("Appointments").select("id", { count: "exact", head: true }),
    supabase.from("Dentists").select("id", { count: "exact", head: true }),
    supabase.from("Prescriptions").select("id", { count: "exact", head: true }),
  ]);

  countPatients.textContent = patients.count ?? 0;
  countAppointments.textContent = appointments.count ?? 0;
  countDentists.textContent = dentists.count ?? 0;
  countPrescriptions.textContent = prescriptions.count ?? 0;
};

const loadUpcomingAppointments = async () => {
  const { data, error } = await supabase.from("Appointments").select("*").order("startTime", { ascending: true }).limit(5);
  if (error || !data) return;

  const [patients, dentists] = await Promise.all([
    supabase.from("Patients").select("id,firstName,lastName"),
    supabase.from("Dentists").select("id,firstName,lastName"),
  ]);

  const patientMap = {};
  (patients.data || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));
  const dentistMap = {};
  (dentists.data || []).forEach((d) => (dentistMap[d.id] = `Dr. ${d.firstName} ${d.lastName}`));

  const statusBadge = (s) => {
    const colors = { Confirmed: "bg-success", Pending: "bg-warning text-dark", Cancelled: "bg-danger", Completed: "bg-info" };
    return `<span class="badge ${colors[s] || "bg-secondary"}">${s}</span>`;
  };

  tbodyAppointments.innerHTML = "";
  data.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${patientMap[r.patientId] ?? ""}</td>
      <td>${dentistMap[r.dentistId] ?? ""}</td>
      <td>${r.startTime ?? ""}</td>
      <td>${statusBadge(r.status)}</td>`;
    tbodyAppointments.appendChild(tr);
  });
};

const loadRecentPrescriptions = async () => {
  const { data, error } = await supabase.from("Prescriptions").select("*").order("dateIssued", { ascending: false }).limit(5);
  if (error || !data) return;

  const { data: patients } = await supabase.from("Patients").select("id,firstName,lastName");
  const patientMap = {};
  (patients || []).forEach((p) => (patientMap[p.id] = `${p.firstName} ${p.lastName}`));

  listPrescriptions.innerHTML = "";
  data.forEach((r) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `<span>${r.medication} - ${patientMap[r.patientId] ?? ""}</span><small class="text-muted">${r.dateIssued ?? ""}</small>`;
    listPrescriptions.appendChild(li);
  });
};