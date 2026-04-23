/*
  ============================================================
  CourseList.jsx
  ============================================================

  Muestra la lista de cursos en una tabla.
*/

function CourseList({ courses, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="loading">Cargando cursos...</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Créditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td className="empty" colSpan="4">
                No hay cursos registrados
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.nombre}</td>
                <td>{course.codigo}</td>
                <td>{course.creditos}</td>
                <td className="actions">
                  <button
                    className="btn btn-sm"
                    onClick={() => onEdit(course)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(course.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CourseList;
