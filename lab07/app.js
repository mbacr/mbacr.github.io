// importamos el cliente de Supabase para interactuar con la base de datos
// este cliente ya está configurado con la URL y la clave de acceso a nuestra instancia de Supabase
import { supabase } from "./supabase.js";

//****************************************
// Referencias a elementos del DOM
//****************************************
// Botones
const btnClear = document.getElementById("btnClear");
const btnAdd = document.getElementById("btnAdd");
const btnCancel = document.getElementById("btnCancel");
const btnLoad = document.getElementById("btnLoad");
// Campo de búsqueda
const txtSearch = document.getElementById("txtSearch");
//Formulario
const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtApellido = document.getElementById("txtApellido");
const txtCorreo = document.getElementById("txtCorreo");
const txtCarrera = document.getElementById("txtCarrera");
const txtDob = document.getElementById("txtDob");
// Tabla
const tbody = document.getElementById("tbodyStudents");
const tituloForm = document.getElementById("tituloForm");

//Consultar estudiantes al cargar la página
window.onload = () => {
  consultarEstudiantes();
};
//****************************************
//Eventos
//****************************************
btnLoad.addEventListener("click", async () => consultarEstudiantes());
btnAdd.addEventListener("click", async () => guardarEstudiante());
btnClear.addEventListener("click", async () => {
  txtSearch.value = "";
  await consultarEstudiantes();
});
btnCancel.addEventListener("click", async () => limpiarFormulario());

tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEliminar")) return;

  const id = target.getAttribute("data-id");

  await eliminarEstudiante(id);
});

// Editar - consulto por el id -
// lleno el formulario con los datos del estudiante -
// cambio el botón de agregar a actualizar -
// al hacer click en actualizar, actualizo el estudiante en la base de datos
tbody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!target.classList.contains("btnEditar")) return;

  const id = target.getAttribute("data-id");

  // 1. Consultar el estudiante por su id
  const { data, error } = await supabase.from("Students").select("id,name,lastName,email,career,dob").eq("id", id).single();

  if (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al cargar estudiante',
    });
    
    return;
  }
  // 2. Llenar el formulario con los datos del estudiante
  txtId.value = data.id;
  txtNombre.value = data.name;
  txtApellido.value = data.lastName;
  txtCorreo.value = data.email;
  txtCarrera.value = data.carreer;
  txtDob.value = data.dob;
  // 3. Cambiar el botón de agregar a actualizar
  btnAdd.textContent = "Actualizar";
  tituloForm.textContent = "Editar Estudiante";
});

//****************************************
//Funciones
//****************************************
const consultarEstudiantes = async () => {
  // usamos el cliente de Supabase para hacer una consulta a la tabla "estudiantes"
  // json: { "data": [], "error": null }
  const search = txtSearch.value.trim() || ""; // si el valor es vacío, se asigna una cadena vacía
  const query = supabase.from("Students").select("id,name,lastName,email,career,dob");

  // filtros
  if (search.length > 0) {
    // query.ilike("name", `%${search}%`);
    query.or(`name.ilike.%${search}%,lastName.ilike.%${search}%`);
  }
  const { data, error } = await query;

  if (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error cargando estudiantes',
    });
  
    return;
  }

  // Limpiando y llenando la tabla con los datos obtenidos
  tbody.innerHTML = "";

  // data es un arreglo de objetos, cada objeto representa un estudiante
  data.forEach((r) => {
    const tr = document.createElement("tr"); //<tr></tr>
    tr.setAttribute("data-id", r.id);
    //<td>${r.id ?? ""}</td>
    tr.innerHTML = `
        <td>${r.name ?? ""}</td>
        <td>${r.lastName ?? ""}</td>
        <td>${r.email ?? ""}</td>
        <td>${r.career ?? ""}</td>
        <td>${r.dob ?? ""}</td>
        <td>
          <button class="btnEditar" data-id="${r.id}">Editar</button>
          <button class="btnEliminar" data-id="${r.id}">Eliminar</button>
        </td>
      `;

    tbody.appendChild(tr);
  });
};

const guardarEstudiante = async () => {
  const estudiante = {
    name: txtNombre.value.trim(),
    lastName: txtApellido.value.trim(),
    email: txtCorreo.value.trim(),
    career: txtCarrera.value.trim(),
    dob: txtDob.value.trim(),
  };

  if (!estudiante.name || !estudiante.lastName || !estudiante.email || !estudiante.career || !estudiante.dob) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, complete todos los campos',
    });
    return;
  }

  if (txtId.value) {
    // Actualizar estudiante existente
    const { error } = await supabase.from("Students").update([estudiante]).eq("id", txtId.value);

    if (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error actualizando estudiante',
      });
      return;
    }
  } else {
    // Agregar nuevo estudiante
    const { error } = await supabase.from("Students").insert([estudiante]);

    if (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error guardando estudiante',
      });
      
      return;
    }
  }

  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: 'Estudiante guardado exitosamente',
  });

  limpiarFormulario();
  consultarEstudiantes();
};

const eliminarEstudiante = async (id) => {

  Swal.fire({
  title: "¿Está seguro de eliminar este estudiante?",
  text: "Esta acción no se puede deshacer",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: 'Si, eliminar',
}).then(async (result) => {
  if (result.isConfirmed) {
    const { error } = await supabase.from("Students").delete().eq("id", id);
    consultarEstudiantes();
    Swal.fire('Eliminado', '', 'success');
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    
    Swal.fire('Cancelado', '', 'error');
  }
});
    
  
};

const limpiarFormulario = () => {
  txtId.value = "";
  txtNombre.value = "";
  txtApellido.value = "";
  txtCorreo.value = "";
  txtCarrera.value = "";
  txtDob.value = "";
  btnAdd.textContent = "Agregar";
  tituloForm.textContent = "Agregar Estudiantes";
};
 