
import { conectarSSE } from "../config/api";

// Escuchar actualizaciones de una partida
export const escucharPartida = (id, alRecibirEstado) => {
    const endpoint = `/api/partidas/${encodeURIComponent(id)}/eventos`;

    return conectarSSE(endpoint, alRecibirEstado);
};
