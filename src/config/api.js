// src/config/api.js
import EventSourcePkg from "event-source-polyfill";

const EventSourceImpl =
    EventSourcePkg?.EventSourcePolyfill ||
    EventSourcePkg?.default?.EventSourcePolyfill ||
    globalThis.EventSourcePolyfill ||
    globalThis.EventSource;

// URL CENTRAL DEL BACKEND
export const BASE_URL = "https://sandbar-finer-litter.ngrok-free.dev";

// En desarrollo pasa por el proxy de Vite para evitar bloqueos CORS
const API_ORIGIN = import.meta.env.DEV ? window.location.origin : BASE_URL;

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
    const url = new URL(endpoint, API_ORIGIN).toString();

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

    if (respuesta.status === 511) {
        throw new Error(
            "LocalTunnel rechazó la petición (511). Verifica que el túnel esté activo."
        );
    }

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
                    `Error HTTP ${respuesta.status}: el servidor o túnel no devolvió JSON.`
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
    const url = new URL(endpoint, API_ORIGIN).toString();

    const origen = new EventSourceImpl(url, {
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
