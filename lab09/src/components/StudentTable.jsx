/*
  ============================================================
  StudentTable.jsx
  ============================================================

  Tabla de estudiantes. Recibe la lista y dispara callbacks
  para editar y eliminar.
*/

function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return <p className="empty">No hay estudiantes registrados</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
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
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td>{student.career}</td>
              <td>{student.dob || ""}</td>
              <td className="actions">
                <button
                  className="btn btn-sm"
                  onClick={() => onEdit(student)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(student.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
