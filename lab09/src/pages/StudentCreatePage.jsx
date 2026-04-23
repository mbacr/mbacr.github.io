import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { crearEstudiante } from "../services/studentService";
import StudentForm from "../components/StudentForm";
import Message from "../components/Message";

/*
  ============================================================
  StudentCreatePage.jsx
  ============================================================

  Página para agregar un nuevo estudiante.
  Al guardar, redirige al listado.
*/

const emptyForm = {
  name: "",
  lastName: "",
  email: "",
  career: "",
  dob: "",
};

function StudentCreatePage() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

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
      await crearEstudiante(form);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section">
      <h2>Agregar estudiante</h2>

      {error && <Message type="error">{error}</Message>}
      {saving && <Message type="loading">Guardando...</Message>}

      <StudentForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        submitLabel="Agregar"
      />
    </div>
  );
}

export default StudentCreatePage;
