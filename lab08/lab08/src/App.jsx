import { useEffect, useState } from "react";
import {
  eliminaEstudiante,
  guardarEstudiante,
  obtenerEstudiantes,
} from "./estudianteService";

/*
  ============================================================
  App.jsx
  ============================================================

  Este componente muestra una versión básica de un CRUD
  de estudiantes usando React + un service separado.

  Aquí React se encarga de:
  - manejar estado
  - capturar eventos
  - renderizar la interfaz

  El service se encarga de:
  - consultar la base de datos
  - insertar
  - actualizar
  - eliminar
*/

const initialForm = {
  id: "",
  nombre: "",
  apellido: "",
  correo: "",
  carrera: "",
  fechaNac: "",
};

function App() {
  // Estado del formulario
  const [form, setForm] = useState(initialForm);

  // Estado de la lista de estudiantes
  const [students, setStudents] = useState([]);

  // Estado del texto de búsqueda
  const [search, setSearch] = useState("");

  // Estado para mostrar carga
  const [loading, setLoading] = useState(false);

  /*
    ------------------------------------------------------------
    Cargar estudiantes
    ------------------------------------------------------------
    Esta función consulta los datos usando el service
    y actualiza el estado students.
  */
  const loadStudents = async (searchText = "") => {
    try {
      setLoading(true);
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
    ------------------------------------------------------------
    useEffect
    ------------------------------------------------------------
    Se ejecuta una vez al cargar el componente.
    Lo usamos para traer los estudiantes al inicio.
  */
  useEffect(() => {
    loadStudents();
  }, []);

  /*
    ------------------------------------------------------------
    Manejar cambios del formulario
    ------------------------------------------------------------
    Esta función sirve para todos los inputs.
    Toma el name del control y actualiza esa propiedad.
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
    ------------------------------------------------------------
    Guardar estudiante
    ------------------------------------------------------------
    Si el formulario tiene id, actualiza.
    Si no tiene id, crea un nuevo registro.

    La decisión la toma saveStudent() en el service.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !form.name.trim() ||
        !form.lastName.trim() ||
        !form.email.trim() ||
        !form.career.trim()
      ) {
        alert("Debe completar nombre, apellido, correo y carrera");
        return;
      }

      await guardarEstudiante(form);
      setForm(initialForm);
      await obtenerEstudiantes(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /*
    ------------------------------------------------------------
    Editar estudiante
    ------------------------------------------------------------
    Carga los datos de la fila seleccionada en el formulario.
  */
  const handleEdit = (student) => {
    setForm({
      id: student.id || "",
      name: student.name || "",
      lastName: student.lastName || "",
      email: student.email || "",
      career: student.career || "",
      dob: student.dob || "",
    });
  };

  /*
    ------------------------------------------------------------
    Eliminar estudiante
    ------------------------------------------------------------
    Elimina por id y vuelve a cargar la tabla.
  */
  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este estudiante?");
    if (!ok) return;

    try {
      await eliminaEstudiante(id);
      await obtenerEstudiantes(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /*
    ------------------------------------------------------------
    Limpiar formulario
    ------------------------------------------------------------
    Restablece el formulario a su estado inicial.
  */
  const handleCancel = () => {
    setForm(initialForm);
  };

  /*
    ------------------------------------------------------------
    Buscar estudiantes
    ------------------------------------------------------------
    Ejecuta la consulta usando el texto actual de búsqueda.
  */
  const handleSearch = async () => {
    await obtenerEstudiantes(search);
  };

  /*
    ------------------------------------------------------------
    Limpiar búsqueda
    ------------------------------------------------------------
    Borra el texto y recarga todos los registros.
  */
  const handleClearSearch = async () => {
    setSearch("");
    await obtenerEstudiantes("");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <h1>Laboratorio 7 - React Estudiantes</h1>
      <p>Introducción a React con separación de responsabilidades.</p>

      <hr />

      <h2>{form.id ? "Editar estudiante" : "Agregar estudiante"}</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.lastName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="carrera"
            placeholder="Carrera"
            value={form.career}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fechaNac"
            value={form.dob}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button type="submit">
            {form.id ? "Actualizar" : "Agregar"}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>

      <hr />

      <h2>Consulta de estudiantes</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>Buscar</button>
        <button onClick={handleClearSearch}>Limpiar</button>
      </div>

      {loading ? (
        <p>Cargando estudiantes...</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Carrera</th>
              <th>Fecha Nacimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="6">No hay estudiantes registrados</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.lastName}</td>
                  <td>{student.email}</td>
                  <td>{student.career}</td>
                  <td>{student.dob || ""}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Editar</button>{" "}
                    <button onClick={() => handleDelete(student.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;