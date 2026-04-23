// src/courseService.js
import { supabase } from "./supaBaseClient";

/*
  ============================================================
  courseService.js
  ============================================================

  Centraliza todas las operaciones de base de datos
  relacionadas con la tabla "cursos".
*/

const TABLA_NOMBRE = "cursos";
const COLUMNAS_MOSTRAR = "id, nombre, codigo, creditos";

/*
  ------------------------------------------------------------
  mapCursoPayload
  ------------------------------------------------------------
  Limpia y normaliza los datos antes de enviarlos a la BD.
*/
const mapCursoPayload = (curso) => ({
  nombre: curso.nombre?.trim() || "",
  codigo: curso.codigo?.trim() || "",
  creditos: curso.creditos === "" || curso.creditos == null
    ? null
    : Number(curso.creditos),
});

/*
  ------------------------------------------------------------
  Obtener cursos
  ------------------------------------------------------------
  Parámetro opcional:
  - search: texto para filtrar por nombre o código
*/
export const obtenerCursos = async (search = "") => {
  let query = supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .order("id", { ascending: true });

  const term = search.trim();

  if (term) {
    query = query.or(`nombre.ilike.%${term}%,codigo.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al cargar cursos:", error);
    throw new Error("No se pudieron cargar los cursos");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Obtener curso por ID
  ------------------------------------------------------------
*/
export const obtenerCursoPorId = async (id) => {
  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .select(COLUMNAS_MOSTRAR)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener curso:", error);
    throw new Error("No se pudo obtener el curso");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Crear curso
  ------------------------------------------------------------
*/
export const crearCurso = async (curso) => {
  const payload = mapCursoPayload(curso);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .insert([payload])
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al crear curso:", error);
    throw new Error("No se pudo crear el curso");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Actualizar curso
  ------------------------------------------------------------
*/
export const actualizaCurso = async (id, curso) => {
  const payload = mapCursoPayload(curso);

  const { data, error } = await supabase
    .from(TABLA_NOMBRE)
    .update(payload)
    .eq("id", id)
    .select(COLUMNAS_MOSTRAR)
    .single();

  if (error) {
    console.error("Error al actualizar curso:", error);
    throw new Error("No se pudo actualizar el curso");
  }

  return data;
};

/*
  ------------------------------------------------------------
  Eliminar curso
  ------------------------------------------------------------
*/
export const eliminaCurso = async (id) => {
  const { error } = await supabase
    .from(TABLA_NOMBRE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar curso:", error);
    throw new Error("No se pudo eliminar el curso");
  }

  return true;
};

/*
  ------------------------------------------------------------
  Guardar curso (create o update)
  ------------------------------------------------------------
  Crea si no hay id, actualiza si ya existe.
*/
export const guardarCurso = async (curso) => {
  if (curso.id) {
    return await actualizaCurso(curso.id, curso);
  }

  return await crearCurso(curso);
};
