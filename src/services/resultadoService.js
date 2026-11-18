
import { apiRequest } from "../config/api";

// Obtener historial global de partidas
export const obtenerHistorial = () =>
    apiRequest("/api/resultados");
