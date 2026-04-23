import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  actualizaEstudiante,
  obtenerEstudiantePorId,
} from "../services/studentService";
import StudentForm from "../components/StudentForm";
import Message from "../components/Message";

/*
  ============================================================
  StudentEditPage.jsx
  ============================================================

  Página para editar un estudiante existente.
  Toma el id desde la URL con useParams.
*/

const emptyForm = {
  name: "",
  lastName: "",
  email: "",
  career: "",
  dob: "",
};

function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await obtenerEstudiantePorId(id);
        setForm({
          name: data.name || "",
          lastName: data.lastName || "",
          email: data.email || "",
          career: data.career || "",
          dob: data.dob || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.name.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.career.trim()
    ) {
      setError("Debe completar nombre, apellido, correo y carrera");
      return;
    }

    setSaving(true);
    try {
      await actualizaEstudiante(id, form);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <Message type="loading">Cargando estudiante...</Message>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Editar estudiante</h2>

      {error && <Message type="error">{error}</Message>}
      {saving && <Message type="loading">Guardando...</Message>}

      <StudentForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        submitLabel="Actualizar"
      />
    </div>
  );
}

export default StudentEditPage;
