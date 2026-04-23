/*
  ============================================================
  SearchBar.jsx
  ============================================================

  Barra de búsqueda reutilizable.
*/

function SearchBar({ value, onChange, onSearch, onClear, placeholder }) {
  return (
    <div className="toolbar">
      <input
        className="input"
        type="text"
        placeholder={placeholder || "Buscar"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
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

export default SearchBar;
