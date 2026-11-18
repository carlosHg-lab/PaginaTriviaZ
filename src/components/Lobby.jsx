// src/components/Lobby.jsx
import React from 'react';

export default function Lobby() {
  return (
    <section id="view-lobby" className="lobby lobby--hidden" aria-labelledby="lobby-heading">
      <header className="lobby__header">
        <div className="lobby__room-badge">
          <span className="lobby__room-label">Código de Sala:</span>
          <output id="lobby-room-code" className="lobby__room-code">------</output>
        </div>

        <h2 id="lobby-heading" className="lobby__title">Sala de Espera</h2>

        <dl className="lobby__meta">
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Modalidad:</dt>
            <dd className="lobby__meta-desc" id="lobby-modality">TIEMPO_REAL</dd>
          </div>
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Preguntas:</dt>
            <dd className="lobby__meta-desc" id="lobby-total-questions">10</dd>
          </div>
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Tiempo por pregunta:</dt>
            <dd className="lobby__meta-desc"><span id="lobby-seconds">20</span>s</dd>
          </div>
        </dl>
      </header>

      <section className="lobby__players-section" aria-label="Jugadores conectados">
        <header className="lobby__players-header">
          <h3 className="lobby__subtitle">Jugadores Conectados</h3>
          <span className="lobby__counter">
            <output id="lobby-player-count">2</output> / 8 jugadores (Mínimo 2)
          </span>
        </header>

        <ul className="lobby__player-list" id="lobby-player-list">
          <li className="lobby__player-item lobby__player-item--host" data-player-id="usr-1">
            <span className="lobby__player-name">Carloz</span>
            <span className="lobby__player-badge">👑 Anfitrión</span>
          </li>
          <li className="lobby__player-item" data-player-id="usr-2">
            <span className="lobby__player-name">Ana</span>
            <span className="lobby__player-badge">Listo</span>
          </li>
        </ul>
      </section>

      <footer className="lobby__footer">
        <p className="lobby__status-msg" id="lobby-status-msg">
          <span className="lobby__spinner" aria-hidden="true">⏳</span> Escuchando eventos en tiempo real (SSE)...
        </p>

        <div className="lobby__actions">
          <button type="button" id="btn-start-match" className="lobby__button--start">
            Iniciar Partida Ahora
          </button>
          <button type="button" id="btn-leave-lobby" className="lobby__button--leave">
            Salir de la Sala
          </button>
        </div>
      </footer>
    </section>
  );
}