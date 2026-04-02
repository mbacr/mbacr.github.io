import { supabase } from "./supabase.js";

const btnSave = document.getElementById("btnSaveTreatment");
const txtId = document.getElementById("txtTreatmentId");
const txtName = document.getElementById("txtTreatmentName");
const txtDescription = document.getElementById("txtDescription");
const cardsContainer = document.getElementById("treatmentCards");
const modalTitle = document.getElementById("modalTreatmentTitle");
const modalEl = document.getElementById("modalTreatment");

window.onload = () => {
  consultarTreatments();
};

btnSave.addEventListener("click", async () => guardarTreatment());

modalEl.addEventListener("hidden.bs.modal", () => limpiarFormulario());

cardsContainer.addEventListener("click", async (event) => {
  const target = event.target;
  if (target.classList.contains("btnEliminar")) {
    const id = target.getAttribute("data-id");
    await eliminarTreatment(id);
  }
  if (target.classList.contains("btnEditar")) {
    const id = target.getAttribute("data-id");

    const { data, error } = await supabase.from("Treatments").select("*").eq("id", id).single();
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error loading treatment" });
      return;
    }

    txtId.value = data.id;
    txtName.value = data.name;
    txtDescription.value = data.description || "";
    modalTitle.textContent = "Edit Treatment";

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
});

const consultarTreatments = async () => {
  const { data, error } = await supabase.from("Treatments").select("id,name,description");
  if (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Error loading treatments" });
    return;
  }

  cardsContainer.innerHTML = "";
  data.forEach((r) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h6 class="card-title">${r.name ?? ""}</h6>
          <p class="card-text text-muted small">${r.description ?? ""}</p>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-secondary btnEditar" data-id="${r.id}"><i class="bi bi-pencil" style="pointer-events:none"></i> Edit</button>
            <button class="btn btn-sm btn-outline-danger btnEliminar" data-id="${r.id}"><i class="bi bi-trash" style="pointer-events:none"></i></button>
          </div>
        </div>
      </div>`;
    cardsContainer.appendChild(col);
  });
};

const guardarTreatment = async () => {
  const treatment = {
    name: txtName.value.trim(),
    description: txtDescription.value.trim(),
  };

  if (!treatment.name) {
    Swal.fire({ icon: "error", title: "Error", text: "Please fill in the treatment name" });
    return;
  }

  if (txtId.value) {
    const { error } = await supabase.from("Treatments").update(treatment).eq("id", txtId.value);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error updating treatment" });
      return;
    }
  } else {
    const { error } = await supabase.from("Treatments").insert([treatment]);
    if (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error saving treatment" });
      return;
    }
  }

  Swal.fire({ icon: "success", title: "Success", text: "Treatment saved successfully" });
  bootstrap.Modal.getInstance(modalEl)?.hide();
  limpiarFormulario();
  consultarTreatments();
};

const eliminarTreatment = async (id) => {
  Swal.fire({
    title: "Delete this treatment?",
    text: "This action cannot be undone",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { error } = await supabase.from("Treatments").delete().eq("id", id);
      if (error) {
        Swal.fire({ icon: "error", title: "Error", text: "Error deleting treatment" });
        return;
      }
      consultarTreatments();
      Swal.fire("Deleted", "", "success");
    }
  });
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtName.value = "";
  txtDescription.value = "";
  modalTitle.textContent = "New Treatment";
  btnSave.textContent = "Save Treatment";
};