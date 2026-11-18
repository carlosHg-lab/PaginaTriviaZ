
import {
    crearPartida,
    unirsePartida,
    obtenerPartida,
    obtenerPreguntaActual,
    iniciarPartida,
    responderPregunta
} from "./partidaService";

import { escucharPartida } from "./eventService";

export const probarPartidaMultijugador = async () => {
    console.log("===== PRUEBA MULTIJUGADOR =====");

    let conexion = null;

    try {
        // 1. Crear partida como anfitrión
        const anfitrion = await crearPartida({
            nombre: "AnfitrionPrueba",
            tipo: "MULTIJUGADOR",
            modalidad: "TIEMPO_REAL",
            totalPreguntas: 3,
            segundosPorPregunta: 30
        });

        const id = anfitrion.partida.id;
        const tokenAnfitrion = anfitrion.token;

        if (!id || !tokenAnfitrion) {
            throw new Error("No se recibió el ID o token del anfitrión.");
        }

        console.log("1. CREAR SALA: CORRECTO");
        console.log("Código:", id);

        // 2. Unirse como segundo jugador
        const invitado = await unirsePartida(id, "InvitadoPrueba");
        const tokenInvitado = invitado.token;

        if (!tokenInvitado) {
            throw new Error("No se recibió el token del invitado.");
        }

        console.log("2. UNIR INVITADO: CORRECTO");
        console.log("Invitado:", invitado);

        // 3. Consultar partida
        const partida = await obtenerPartida(id);

        console.log("3. CONSULTAR SALA: CORRECTO");
        console.log("Partida:", partida);

        // 4. Conectar eventos SSE
        conexion = escucharPartida(id, (estado) => {
            console.log("EVENTO SSE RECIBIDO:", estado);
        });

        console.log("4. CONEXIÓN SSE: SOLICITADA");

        // 5. Iniciar partida como anfitrión
        const inicio = await iniciarPartida(id, tokenAnfitrion);

        console.log("5. INICIAR PARTIDA: CORRECTO");
        console.log("Respuesta:", inicio);

        // 6. Obtener pregunta actual
        const pregunta = await obtenerPreguntaActual(id);

        console.log("6. OBTENER PREGUNTA: CORRECTO");
        console.log("Pregunta:", pregunta);

        // 7. Responder como anfitrión
        const respuestaAnfitrion = await responderPregunta(
            id,
            0,
            tokenAnfitrion
        );

        console.log("7. RESPUESTA DEL ANFITRIÓN: CORRECTO");
        console.log(respuestaAnfitrion);

        // 8. Responder como invitado
        const respuestaInvitado = await responderPregunta(
            id,
            0,
            tokenInvitado
        );

        console.log("8. RESPUESTA DEL INVITADO: CORRECTO");
        console.log(respuestaInvitado);

        console.log("===== PRUEBA MULTIJUGADOR COMPLETADA =====");

        // Devolvemos la conexión para poder observar los eventos SSE.
        return {
            id,
            anfitrion,
            invitado,
            conexion
        };

    } catch (error) {
        console.error("ERROR EN MULTIJUGADOR:", error);

        if (conexion) {
            conexion.close();
        }

        throw error;
    }
};
