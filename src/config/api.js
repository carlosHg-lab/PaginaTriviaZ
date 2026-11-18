
import { EventSourcePolyfill } from "event-source-polyfill";

// URL CENTRAL DEL BACKEND
export const BASE_URL = "https://carlos-trivia-api.loca.lt";


// PETICIONES HTTP
export const apiRequest = async (
    endpoint,
    {
        method = "GET",
        body = null,
        jugadorToken = null,
        adminKey = null
    } = {}
) => {
    const url = new URL(endpoint, BASE_URL).toString();

    const headers = {
        Accept: "application/json",
        "bypass-tunnel-reminder": "true"
    };

    if (body !== null) {
        headers["Content-Type"] = "application/json";
    }

    if (jugadorToken) {
        headers["X-Jugador-Token"] = jugadorToken;
    }

    if (adminKey) {
        headers["X-Admin-Key"] = adminKey;
    }

    const respuesta = await fetch(url, {
        method,
        headers,
        body: body !== null ? JSON.stringify(body) : null
    });

    if (respuesta.status === 204) {
        return null;
    }

    const texto = await respuesta.text();

    let datos = null;

    if (texto) {
        try {
            datos = JSON.parse(texto);
        } catch {
            if (!respuesta.ok) {
                throw new Error(
                    `Error HTTP ${respuesta.status}: el servidor no devolvió JSON.`
                );
            }

            throw new Error("El servidor devolvió una respuesta inválida.");
        }
    }

    if (!respuesta.ok) {
        throw new Error(
            datos?.error ||
            datos?.mensaje ||
            `Error HTTP ${respuesta.status}`
        );
    }

    return datos;
};

// CONEXIÓN SSE GENÉRICA
export const conectarSSE = (endpoint, alRecibirEstado) => {
    const url = new URL(endpoint, BASE_URL).toString();

    const origen = new EventSourcePolyfill(url, {
        headers: {
            Accept: "text/event-stream",
            "bypass-tunnel-reminder": "true"
        },
        heartbeatTimeout: 120000
    });

    origen.addEventListener("estado", (evento) => {
        try {
            const datos = JSON.parse(evento.data);
            alRecibirEstado(datos);
        } catch (error) {
            console.error("Error procesando evento SSE:", error);
        }
    });

    origen.onerror = (error) => {
        console.error("Error en conexión SSE:", error);
    };

    return origen;
};
