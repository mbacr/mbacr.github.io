import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentListPage from "./pages/StudentListPage";
import StudentCreatePage from "./pages/StudentCreatePage";
import StudentEditPage from "./pages/StudentEditPage";
import NotFoundPage from "./pages/NotFoundPage";

/*
  ============================================================
  App.jsx
  ============================================================

  Define las rutas principales de la aplicación.
  - /             → listado de estudiantes
  - /nuevo        → formulario para agregar
  - /editar/:id   → formulario para editar
*/

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<StudentListPage />} />
          <Route path="/nuevo" element={<StudentCreatePage />} />
          <Route path="/editar/:id" element={<StudentEditPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
