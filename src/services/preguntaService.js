
import { apiRequest } from "../config/api";

const RUTA = "/api/preguntas";

// Obtener categorías
export const obtenerCategorias = () =>
    apiRequest("/api/categorias");

// Obtener preguntas aleatorias
export const obtenerPreguntasAleatorias = (
    cantidad = 10,
    categoria = "",
    dificultad = ""
) => {
    const params = new URLSearchParams();

    params.append("cantidad", cantidad);

    if (categoria) params.append("categoria", categoria);
    if (dificultad) params.append("dificultad", dificultad);

    return apiRequest(`${RUTA}/aleatorias?${params.toString()}`);
};

// Verificar respuesta
export const verificarRespuesta = (preguntaId, respuesta) =>
    apiRequest(`${RUTA}/verificar`, {
        method: "POST",
        body: {
            preguntaId,
            respuesta
        }
    });

// Obtener preguntas para administración
export const obtenerPreguntasAdmin = (
    categoria = "",
    dificultad = "",
    adminKey
) => {
    const params = new URLSearchParams();

    if (categoria) params.append("categoria", categoria);
    if (dificultad) params.append("dificultad", dificultad);

    const query = params.toString();
    const endpoint = query ? `${RUTA}?${query}` : RUTA;

    return apiRequest(endpoint, { adminKey });
};

// Crear pregunta
export const crearPregunta = (pregunta, adminKey) =>
    apiRequest(RUTA, {
        method: "POST",
        body: pregunta,
        adminKey
    });

// Eliminar pregunta
export const eliminarPregunta = (id, adminKey) =>
    apiRequest(`${RUTA}/${id}`, {
        method: "DELETE",
        adminKey
    });
