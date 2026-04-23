import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="section">
      <h2>Página no encontrada</h2>
      <p>La ruta solicitada no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al listado
      </Link>
    </div>
  );
}

export default NotFoundPage;
