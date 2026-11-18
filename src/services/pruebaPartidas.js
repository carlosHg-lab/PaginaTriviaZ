
import {
    crearPartida,
    obtenerPartida,
    obtenerPreguntaActual,
    iniciarPartida,
    responderPregunta
} from "./partidaService";

export const probarPartidaIndividual = async () => {
    console.log("===== PRUEBA DE PARTIDA INDIVIDUAL =====");

    try {
        // 1. Crear partida
        const sesion = await crearPartida({
            nombre: "JugadorPrueba",
            tipo: "INDIVIDUAL",
            totalPreguntas: 5
        });

        console.log("1. CREAR PARTIDA: CORRECTO");
        console.log("Sesión recibida:", sesion);

        const id = sesion.partida.id;
        const token = sesion.token;

        if (!id || !token) {
            throw new Error("La API no devolvió el ID o token del jugador.");
        }

        // 2. Consultar partida
        const partida = await obtenerPartida(id);

        console.log("2. CONSULTAR PARTIDA: CORRECTO");
        console.log(partida);

        // 3. Iniciar partida
        console.log("3. INICIO AUTOMÁTICO: CORRECTO");
        console.log("Estado de la partida:", partida.estado);

        // 4. Consultar pregunta actual
        const pregunta = await obtenerPreguntaActual(id);

        console.log("4. OBTENER PREGUNTA: CORRECTO");
        console.log(pregunta);

        // 5. Responder con la primera opción
        const respuesta = await responderPregunta(id, 0, token);

        console.log("5. RESPONDER PREGUNTA: CORRECTO");
        console.log(respuesta);

        console.log("===== PRUEBA INDIVIDUAL FINALIZADA =====");

        return {
            sesion,
            partida,
            pregunta,
            respuesta
        };

    } catch (error) {
        console.error("ERROR EN PARTIDA INDIVIDUAL:", error);
        throw error;
    }
};
