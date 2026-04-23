import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  eliminaEstudiante,
  obtenerEstudiantes,
} from "../services/studentService";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";
import Message from "../components/Message";

/*
  ============================================================
  StudentListPage.jsx
  ============================================================

  Página principal.
  Lista los estudiantes, permite buscar y eliminar.
  Navega a /editar/:id o /nuevo para el formulario.
*/

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadStudents = async (searchText = "") => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerEstudiantes(searchText);
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSearch = () => loadStudents(search);

  const handleClear = () => {
    setSearch("");
    loadStudents("");
  };

  const handleEdit = (student) => {
    navigate(`/editar/${student.id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Desea eliminar este estudiante?")) return;

    try {
      await eliminaEstudiante(id);
      await loadStudents(search);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>Listado de estudiantes</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/nuevo")}
        >
          + Agregar
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        onSearch={handleSearch}
        onClear={handleClear}
        placeholder="Buscar por nombre o apellido"
      />

      {loading && <Message type="loading">Cargando estudiantes...</Message>}
      {error && <Message type="error">{error}</Message>}

      {!loading && !error && (
        <StudentTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default StudentListPage;
