
import {
    crearPartida,
    unirsePartida,
    obtenerPartida,
    obtenerPreguntaActual,
    iniciarPartida,
    responderPregunta
} from "./partidaService";

import { escucharPartida } from "./eventService";

export const probarPartidaPorTurnos = async () => {
    console.log("===== PRUEBA MULTIJUGADOR POR TURNOS =====");

    let conexion = null;

    try {
        // 1. Crear sala
        const anfitrion = await crearPartida({
            nombre: "AnfitrionTurnos",
            tipo: "MULTIJUGADOR",
            modalidad: "POR_TURNOS",
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

        // 2. Unirse como invitado
        const invitado = await unirsePartida(id, "InvitadoTurnos");
        const tokenInvitado = invitado.token;

        if (!tokenInvitado) {
            throw new Error("No se recibió el token del invitado.");
        }

        console.log("2. UNIR INVITADO: CORRECTO");

        // 3. Consultar sala
        const partidaAntes = await obtenerPartida(id);

        console.log("3. CONSULTAR SALA: CORRECTO");
        console.log("Estado inicial:", partidaAntes);

        // 4. Conectar SSE
        conexion = escucharPartida(id, (estado) => {
            console.log("EVENTO SSE POR TURNOS:", estado);
        });

        console.log("4. CONEXIÓN SSE: SOLICITADA");

        // 5. Iniciar partida
        const inicio = await iniciarPartida(id, tokenAnfitrion);

        console.log("5. INICIAR PARTIDA: CORRECTO");
        console.log(inicio);

        // 6. Consultar estado actualizado
        const partida = await obtenerPartida(id);

        console.log("6. ESTADO ACTUAL DE LA PARTIDA:");
        console.log(partida);

        // 7. Obtener pregunta
        const pregunta = await obtenerPreguntaActual(id);

        console.log("7. OBTENER PREGUNTA: CORRECTO");
        console.log(pregunta);

        console.log("===== CONFIGURACIÓN POR TURNOS COMPLETADA =====");
        console.log("Revisa el estado de la partida para identificar el turno actual.");

        // Función para probar la respuesta del jugador que tenga el turno.
        const responderTurno = async (jugador, opcion = 0) => {
            let token;

            if (jugador === "anfitrion") {
                token = tokenAnfitrion;
            } else if (jugador === "invitado") {
                token = tokenInvitado;
            } else {
                throw new Error("Indica 'anfitrion' o 'invitado'.");
            }

            const resultado = await responderPregunta(id, opcion, token);

            console.log(`RESPUESTA DE ${jugador.toUpperCase()}:`);
            console.log(resultado);

            return resultado;
        };

        return {
            id,
            anfitrion,
            invitado,
            partida,
            pregunta,
            conexion,
            responderTurno
        };

    } catch (error) {
        console.error("ERROR EN PRUEBA POR TURNOS:", error);

        if (conexion) {
            conexion.close();
        }

        throw error;
    }
};
