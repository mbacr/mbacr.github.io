import { NavLink } from "react-router-dom";

/*
  ============================================================
  Navbar.jsx
  ============================================================

  Barra de navegación principal.
*/

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Laboratorio 9</div>
      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Estudiantes
        </NavLink>
        <NavLink
          to="/nuevo"
          className={({ isActive }) =>
            isActive ? "nav-link nav-link-active" : "nav-link"
          }
        >
          Agregar
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
