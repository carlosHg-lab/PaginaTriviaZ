
import { obtenerCategorias, obtenerPreguntasAleatorias } from "./preguntaService";
import { obtenerHistorial } from "./resultadoService";

export const probarServicios = async () => {
    console.log(" INICIANDO PRUEBAS DE LA API");
    // PRUEBA 1: Categorías
    try {
        const categorias = await obtenerCategorias();

        console.log(" PRUEBA 1: CATEGORÍAS");
        console.log("Estado: CORRECTO");
        console.log("Datos recibidos:", categorias);
    } catch (error) {
        console.error(" PRUEBA 1: ERROR", error.message);
    }

    // PRUEBA 2: Preguntas aleatorias
    try {
        const preguntas = await obtenerPreguntasAleatorias(3);

        console.log(" PRUEBA 2: PREGUNTAS ALEATORIAS");
        console.log("Estado: CORRECTO");
        console.log("Datos recibidos:", preguntas);
    } catch (error) {
        console.error(" PRUEBA 2: ERROR", error.message);
    }

    // PRUEBA 3: Historial
    try {
        const historial = await obtenerHistorial();

        console.log(" PRUEBA 3: HISTORIAL");
        console.log("Estado: CORRECTO");
        console.log("Datos recibidos:", historial);
    } catch (error) {
        console.error(" PRUEBA 3: ERROR", error.message);
    }

    console.log(" PRUEBAS FINALIZADAS");
};
