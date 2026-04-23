import { useEffect, useState } from "react";
import {
  eliminaCurso,
  guardarCurso,
  obtenerCursos,
} from "./courseService";
import CourseForm from "./components/CourseForm";
import CourseList from "./components/CourseList";
import CourseSearch from "./components/CourseSearch";

/*
  ============================================================
  Courses.jsx
  ============================================================

  Componente contenedor del CRUD de cursos.
  Mantiene el estado y coordina los componentes hijos:
  - CourseForm
  - CourseSearch
  - CourseList
*/

const initialForm = {
  id: "",
  nombre: "",
  codigo: "",
  creditos: "",
};

function Courses() {
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCourses = async (searchText = "") => {
    try {
      setLoading(true);
      const data = await obtenerCursos(searchText);
      setCourses(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.nombre.trim() || !form.codigo.trim()) {
        alert("Debe completar nombre y código");
        return;
      }

      await guardarCurso(form);
      setForm(initialForm);
      await loadCourses(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (course) => {
    setForm({
      id: course.id || "",
      nombre: course.nombre || "",
      codigo: course.codigo || "",
      creditos: course.creditos ?? "",
    });
  };

  const handleDelete = async (id) => {
    const ok = confirm("¿Desea eliminar este curso?");
    if (!ok) return;

    try {
      await eliminaCurso(id);
      await loadCourses(search);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
  };

  const handleSearch = async () => {
    await loadCourses(search);
  };

  const handleClearSearch = async () => {
    setSearch("");
    await loadCourses("");
  };

  return (
    <>
      <h1>Laboratorio 8 — React Cursos</h1>
      <p className="subtitle">CRUD de cursos con separación en componentes.</p>

      <CourseForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <div className="section">
        <h2>Consulta de cursos</h2>

        <CourseSearch
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        <CourseList
          courses={courses}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default Courses;
