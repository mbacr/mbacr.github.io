/*
  ============================================================
  CourseSearch.jsx
  ============================================================

  Barra de búsqueda de cursos por nombre o código.
*/

function CourseSearch({ search, onSearchChange, onSearch, onClear }) {
  return (
    <div className="toolbar">
      <input
        className="input"
        type="text"
        placeholder="Buscar por nombre o código"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <button className="btn" onClick={onSearch}>
        Buscar
      </button>
      <button className="btn" onClick={onClear}>
        Limpiar
      </button>
    </div>
  );
}

export default CourseSearch;
