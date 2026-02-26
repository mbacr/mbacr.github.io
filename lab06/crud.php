<?php
include 'db.php';

$nombre = trim($_POST['nombre'] ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$correo = trim($_POST['correo'] ?? '');
$fechaNacimiento = trim($_POST['fechaNacimiento'] ?? '');
$accion = $_GET['accion'] ?? '';

// Acción insertar
if (isset($accion) && $accion === 'insertar') {
  $errores = [];
  if ($nombre === '')  $errores[] = 'El nombre es obligatorio.';
  if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) $errores[] = 'Correo inválido.';

  if (count($errores) > 0) {
    foreach ($errores as $err) {
      echo "<p style='color:red;'>$err</p>";
    }
    echo "<p><a href='index.php'>Volver</a></p>";
    exit;
  }

  $sql  = "INSERT INTO Alumnos (Nombre,Apellido, Correo, FechaNacimiento) VALUES (:nombre,:apellido, :correo,:fechaNacimiento)";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':nombre' => $nombre, ':apellido' => $apellido, ':correo' => $correo, ':fechaNacimiento' => $fechaNacimiento]);

  header('Location: index.php');
  exit;
}
// Acción actualizar
if (isset($accion) && $accion === 'actualizar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "UPDATE Alumnos SET Nombre=:nombre, Correo=:correo WHERE Id=:id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':nombre' => $nombre, ':correo' => $correo, ':id' => $id]);
  header("Location: index.php");
}

// Acción eliminar
if (isset($accion) && $accion === 'eliminar' && isset($_GET['id'])) {
  $id = $_GET['id'];
  $sql = "DELETE FROM Alumnos WHERE Id = :id";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([':id' => $id]);
  header('Location: index.php');
  exit;
}
?>