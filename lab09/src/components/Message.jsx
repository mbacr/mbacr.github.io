/*
  ============================================================
  Message.jsx
  ============================================================

  Muestra mensajes de estado: cargando, error o vacío.
*/

function Message({ type = "info", children }) {
  const className =
    type === "error" ? "message message-error" :
    type === "loading" ? "message message-loading" :
    "message";

  return <p className={className}>{children}</p>;
}

export default Message;
