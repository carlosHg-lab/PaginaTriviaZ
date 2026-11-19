// src/components/History.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { obtenerHistorial } from '../services/resultadoService';

export default function History({ onError }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await obtenerHistorial();
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.resultados)
        ? data.resultados
        : [];
      setMatches(lista);
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <section id="view-history" className="history" aria-labelledby="history-heading">
      <header className="history__header">
        <h2 id="history-heading" className="history__title">
          Historial de Partidas Finalizadas
        </h2>
        <button
          type="button"
          id="btn-refresh-history"
          className="history__button"
          onClick={loadHistory}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar Historial'}
        </button>
      </header>

      <div className="history__list" id="history-matches-list">
        {loading && matches.length === 0 ? (
          <p className="practice__subtitle">Cargando historial de partidas...</p>
        ) : matches.length === 0 ? (
          <p className="practice__subtitle">
            Aún no hay partidas finalizadas registradas.
          </p>
        ) : (
          matches.map((item, idx) => {
            const roomId = item.partidaId ?? item.id ?? `PARTIDA-${idx + 1}`;
            const tipo = item.tipo || 'PARTIDA';
            const modalidad = item.modalidad ? ` - ${item.modalidad}` : '';

            const clasificacion =
              item.clasificacion || item.puntuaciones || item.jugadores || [];
            const topPlayer = [...clasificacion].sort(
              (a, b) => (b.puntos ?? 0) - (a.puntos ?? 0)
            )[0];

            const ganadorNombre =
              typeof item.ganador === 'string'
                ? item.ganador
                : item.ganador?.nombre || topPlayer?.nombre || 'Sin ganador';

            const ganadorPuntos =
              item.puntosGanador ??
              item.ganador?.puntos ??
              topPlayer?.puntos;

            return (
              <article key={`${roomId}-${idx}`} className="history__item">
                <header className="history__item-header">
                  <strong className="history__match-id">Sala #{roomId}</strong>
                  <span className="history__match-type">
                    {tipo}
                    {modalidad}
                  </span>
                </header>
                <p className="history__match-winner">
                  🏆 {tipo === 'INDIVIDUAL' ? 'Jugador' : 'Ganador'}:{' '}
                  <strong>{ganadorNombre}</strong>
                  {typeof ganadorPuntos === 'number' ? ` (${ganadorPuntos} pts)` : ''}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}