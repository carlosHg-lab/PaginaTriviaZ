
import { apiRequest } from "../config/api";

const RUTA = "/api/partidas";

// Crear partida
export const crearPartida = (datos) =>
    apiRequest(RUTA, {
        method: "POST",
        body: datos
    });

// Unirse a una partida
export const unirsePartida = (id, nombre) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/unirse`, {
        method: "POST",
        body: { nombre }
    });

// Obtener información de una partida
export const obtenerPartida = (id) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}`);

// Obtener pregunta actual
export const obtenerPreguntaActual = (id) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/pregunta`);

// Iniciar partida
export const iniciarPartida = (id, jugadorToken) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/iniciar`, {
        method: "POST",
        jugadorToken
    });

// Responder pregunta
export const responderPregunta = (id, opcion, jugadorToken) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/responder`, {
        method: "POST",
        body: { opcion },
        jugadorToken
    });

// Pasar a la siguiente pregunta
export const siguientePregunta = (id, jugadorToken) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/siguiente`, {
        method: "POST",
        jugadorToken
    });

// Obtener resultados de la partida
export const obtenerResultadosPartida = (id) =>
    apiRequest(`${RUTA}/${encodeURIComponent(id)}/resultados`);
