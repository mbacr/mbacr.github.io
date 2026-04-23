// src/services/studentService.js
import { supabase } from "../supaBaseClient";

/*
  ============================================================
  studentService.js
  ============================================================

  Centraliza todas las operaciones con la tabla "Students".
*/

const TABLA_NOMBRE = "Students";
const COLUMNAS_MOSTRAR = "id, name, lastName, email, career, dob";

const mapEstudiantePayload = (estudiante) => ({
  name: estudiante.name?.trim() || "",
  lastName: estudiante.lastName?.trim() || "",
  email: estudiante.email?.trim() || "",
  career: estudiante.career?.trim() || "",
  dob: estudiante.dob || null,
});

export const obtenerEstudiantes = async (search = "") => {
  let query = supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .order("id", { ascending: true });

  const term = search.trim();
  if (term) {
    query = query.or(`name.ilike.%${term}%,lastName.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar estudiantes:", error);
    throw new Error("No se pudieron cargar los estudiantes");
  }

  return data;
};

export const obtenerEstudiantePorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener estudiante:", error);
    throw new Error("No se pudo obtener el estudiante");
  }

  return data;
};

export const crearEstudiante = async (estudiante) => {
  const payload = mapEstudiantePayload(estudiante);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .insert([payload])
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al crear estudiante:", error);
    throw new Error("No se pudo crear el estudiante");
  }

  return data;
};

export const actualizaEstudiante = async (id, estudiante) => {
  const payload = mapEstudiantePayload(estudiante);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .update(payload)
    .eq("id", id)
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al actualizar estudiante:", error);
    throw new Error("No se pudo actualizar el estudiante");
  }

  return data;
};

export const eliminaEstudiante = async (id) => {
  const { error } = await supabase
    .from(TABLA_NOMBRE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar estudiante:", error);
    throw new Error("No se pudo eliminar el estudiante");
  }

  return true;
};

export const guardarEstudiante = async (estudiante) => {
  if (estudiante.id) {
    return await actualizaEstudiante(estudiante.id, estudiante);
  }
  return await crearEstudiante(estudiante);
};
