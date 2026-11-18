// src/components/History.jsx
import React from 'react';

export default function History() {
  return (
    <section id="view-history" className="history history--hidden" aria-labelledby="history-heading">
      <header className="history__header">
        <h2 id="history-heading" className="history__title">Historial de Partidas Finalizadas</h2>
        <button type="button" id="btn-refresh-history" className="history__button">
          Actualizar Historial
        </button>
      </header>

      <div className="history__list" id="history-matches-list">
        <article className="history__item">
          <header className="history__item-header">
            <strong className="history__match-id">Sala #A1B2C3</strong>
            <span className="history__match-type">MULTIJUGADOR - TIEMPO_REAL</span>
          </header>
          <p className="history__match-winner">
            🏆 Ganador: <strong>Carloz</strong> (80 pts)
          </p>
        </article>
      </div>
    </section>
  );
}