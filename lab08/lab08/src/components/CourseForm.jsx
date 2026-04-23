/*
  ============================================================
  CourseForm.jsx
  ============================================================

  Formulario controlado para crear y editar cursos.
*/

function CourseForm({ form, onChange, onSubmit, onCancel }) {
  return (
    <div className="section">
      <h2>{form.id ? "Editar curso" : "Agregar curso"}</h2>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <input
            className="input"
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={onChange}
          />

          <input
            className="input"
            type="text"
            name="codigo"
            placeholder="Código"
            value={form.codigo}
            onChange={onChange}
          />

          <input
            className="input full"
            type="number"
            name="creditos"
            placeholder="Créditos"
            min="0"
            value={form.creditos}
            onChange={onChange}
          />
        </div>

        <div className="button-row">
          <button type="submit" className="btn btn-primary">
            {form.id ? "Actualizar" : "Agregar"}
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm;
