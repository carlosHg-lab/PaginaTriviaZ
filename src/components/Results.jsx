// src/components/Results.jsx
import React, { useEffect, useState, useRef } from 'react';
import { obtenerResultadosPartida } from '../services/partidaService';

export default function Results({ partida, session, onBackToMenu, onError }) {
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(true);

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!partida?.id) {
      setLoading(false);
      return;
    }

    let active = true;

    const cargarResultados = async () => {
      try {
        const data = await obtenerResultadosPartida(partida.id);
        if (active) setResultados(data);
      } catch (error) {
        if (active && onErrorRef.current) onErrorRef.current(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    cargarResultados();

    // Efecto visual de confeti definido en App.css
    const colors = ['#0284c7', '#f59e0b', '#10b981', '#8b5cf6', '#f97316'];
    const particles = [];
    for (let i = 0; i < 45; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = '-10px';
      el.style.backgroundColor = colors[i % colors.length];
      el.style.setProperty('--tx', `${(Math.random() - 0.5) * 260}px`);
      el.style.setProperty('--ty', `${70 + Math.random() * 35}vh`);
      document.body.appendChild(el);
      particles.push(el);
    }

    const cleanupTimer = setTimeout(() => {
      particles.forEach((p) => p.remove());
    }, 1700);

    return () => {
      active = false;
      clearTimeout(cleanupTimer);
      particles.forEach((p) => p.remove());
    };
  }, [partida?.id]);

  // Extraer clasificación desde la respuesta de /resultados o desde el último estado de la partida
  const rawList =
    resultados?.clasificacion ||
    resultados?.puntuaciones ||
    resultados?.jugadores ||
    partida?.jugadores ||
    [];

  const standings = [...rawList].sort(
    (a, b) => (b.puntos ?? 0) - (a.puntos ?? 0)
  );

  const winnerName =
    typeof resultados?.ganador === 'string'
      ? resultados.ganador
      : resultados?.ganador?.nombre || standings[0]?.nombre || '---';

  const getMedal = (index) => {
    if (index === 0) return '🥇 1°';
    if (index === 1) return '🥈 2°';
    if (index === 2) return '🥉 3°';
    return `${index + 1}°`;
  };

  return (
    <section id="view-results" className="results" aria-labelledby="results-heading">
      <header className="results__header">
        <span className="results__trophy" aria-hidden="true">🏆</span>
        <h2 id="results-heading" className="results__title">¡Partida Finalizada!</h2>
        <p className="results__winner-banner">
          {partida?.tipo === 'INDIVIDUAL' ? 'Jugador:' : 'Ganador de la partida:'}{' '}
          <strong className="results__winner-name" id="results-winner">
            {loading ? 'Calculando...' : winnerName}
          </strong>
        </p>
      </header>

      <div className="results__table-wrapper">
        <table className="results__table">
          <caption className="results__caption">
            Clasificación Final de Jugadores {partida?.id ? `(Sala #${partida.id})` : ''}
          </caption>
          <thead className="results__thead">
            <tr className="results__row">
              <th scope="col" className="results__th">Posición</th>
              <th scope="col" className="results__th">Jugador</th>
              <th scope="col" className="results__th">Puntos Totales</th>
            </tr>
          </thead>
          <tbody className="results__tbody" id="results-standings-body">
            {standings.length === 0 ? (
              <tr className="results__row">
                <td className="results__td" colSpan="3">
                  {loading ? 'Cargando resultados...' : 'No hay puntuaciones disponibles.'}
                </td>
              </tr>
            ) : (
              standings.map((jugador, index) => {
                const playerId = jugador.id ?? jugador.jugadorId;
                const esYo = session?.jugadorId && playerId === session.jugadorId;
                return (
                  <tr
                    key={playerId || jugador.nombre || index}
                    className={`results__row ${index === 0 ? 'results__row--first' : ''}`}
                  >
                    <td className="results__td">{getMedal(index)}</td>
                    <td className="results__td">
                      {jugador.nombre} {esYo ? '(Tú)' : ''}
                    </td>
                    <td className="results__td">
                      <strong>{jugador.puntos ?? 0} pts</strong>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <footer className="results__footer">
        <button
          type="button"
          id="btn-back-to-menu"
          className="results__button results__button--primary"
          onClick={onBackToMenu}
        >
          Volver al Menú Principal
        </button>
      </footer>
    </section>
  );
}