// importamos el cliente de Supabase para interactuar con la base de datos
// este cliente ya está configurado con la URL y la clave de acceso a nuestra instancia de Supabase
import { supabase } from "./supabase.js";

// obtenemos referencias a los elementos del DOM que vamos a usar
const btnLoad = document.getElementById("btnLoad");
const tbody = document.getElementById("tbodyStudents");

btnLoad.addEventListener("click", async () => consultarEstudiantes());


const consultarEstudiantes = async () => {
  // usamos el cliente de Supabase para hacer una consulta a la tabla "estudiantes"
  // json: { "data": [], "error": null }
  const { data, error } = await supabase.from("Students").select("id,name,lastName,email,career");

  if (error) {
    console.error(error);
    alert("Error cargando estudiantes");
    return;
  }

  tbody.innerHTML = "";

  data.forEach((r) => {
    console.log(r.name);
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${r.id ?? ""}</td>
        <td>${r.name ?? ""}</td>
        <td>${r.lastName ?? ""}</td>
        <td>${r.email ?? ""}</td>
        <td>${r.career ?? ""}</td>
      `;

    tbody.appendChild(tr);
  });
}; 