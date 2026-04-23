/*
  ============================================================
  StudentForm.jsx
  ============================================================

  Formulario controlado reutilizable para crear y editar
  estudiantes. No conoce rutas ni el service — sólo recibe
  datos por props y dispara callbacks.
*/

function StudentForm({ form, onChange, onSubmit, onCancel, submitLabel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={onChange}
        />

        <input
          className="input"
          type="text"
          name="lastName"
          placeholder="Apellido"
          value={form.lastName}
          onChange={onChange}
        />

        <input
          className="input"
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={onChange}
        />

        <input
          className="input"
          type="text"
          name="career"
          placeholder="Carrera"
          value={form.career}
          onChange={onChange}
        />

        <input
          className="input full"
          type="date"
          name="dob"
          value={form.dob}
          onChange={onChange}
        />
      </div>

      <div className="button-row">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default StudentForm;
