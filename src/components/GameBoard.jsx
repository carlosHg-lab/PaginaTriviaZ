// src/components/GameBoard.jsx
import React from 'react';

export default function GameBoard({ onFinishMatch }) {
  return (
    <section
      id="view-gameboard"
      className="gameboard"
      aria-labelledby="gameboard-question-text"
    >
      <header className="gameboard__hud">
        <div className="gameboard__progress">
          <span className="gameboard__progress-label">Pregunta</span>
          <strong className="gameboard__progress-count">
            <span id="game-current-q">1</span> / <span id="game-total-q">10</span>
          </strong>
        </div>

        <div className="gameboard__turn gameboard__turn--my-turn" id="game-turn-indicator">
          <span className="gameboard__turn-label">Turno actual:</span>
          <strong className="gameboard__turn-player" id="game-turn-player">Carloz (Tú)</strong>
        </div>

        <div className="gameboard__timer" id="game-timer" role="timer" aria-live="off">
          <span className="gameboard__timer-icon" aria-hidden="true">⏱️</span>
          <output id="game-seconds-left" className="gameboard__timer-value">20</output>
          <span className="gameboard__timer-unit">s</span>
        </div>
      </header>

      <div className="gameboard__time-bar-container">
        <div id="game-time-bar" className="gameboard__time-bar"></div>
      </div>

      <div className="gameboard__layout">
        <article className="gameboard__stage">
          <div className="gameboard__deck-container" aria-label="Progreso del mazo de cartas">
            <div className="gameboard__deck-slots" id="deck-slots-container"></div>
            <span className="gameboard__deck-label">
              Quedan <strong id="deck-remaining-count">9</strong> cartas
            </span>
          </div>

          <div className="gameboard__card-flipper" id="game-card-flipper">
            <header className="gameboard__question-header">
              <span className="gameboard__category" id="game-category">Historia</span>
              <span
                className="gameboard__state-badge gameboard__state-badge--open"
                id="game-question-state"
              >
                Pregunta Abierta
              </span>
            </header>

            <h2 id="gameboard-question-text" className="gameboard__question">
              ¿En qué año llegó Cristóbal Colón al continente americano?
            </h2>

            <div
              className="gameboard__options"
              role="group"
              aria-label="Opciones de respuesta"
              id="game-options-list"
            >
              <button type="button" className="gameboard__option" data-option-index="0">
                <span className="gameboard__option-prefix">A</span>
                <span className="gameboard__option-text">1492</span>
              </button>

              <button type="button" className="gameboard__option" data-option-index="1">
                <span className="gameboard__option-prefix">B</span>
                <span className="gameboard__option-text">1502</span>
              </button>

              <button type="button" className="gameboard__option" data-option-index="2">
                <span className="gameboard__option-prefix">C</span>
                <span className="gameboard__option-text">1488</span>
              </button>

              <button type="button" className="gameboard__option" data-option-index="3">
                <span className="gameboard__option-prefix">D</span>
                <span className="gameboard__option-text">1519</span>
              </button>
            </div>

            <footer className="gameboard__feedback" id="game-feedback" aria-live="polite">
              <div className="gameboard__feedback-info">
                <p className="gameboard__feedback-text">
                  ¡Respuesta correcta! Sumaste{' '}
                  <strong className="gameboard__points-earned">+10 puntos</strong>.
                </p>
                <p className="gameboard__auto-advance-note">
                  Presiona siguiente para robar la próxima carta...
                </p>
              </div>
              <button
                type="button"
                id="btn-next-question"
                className="gameboard__button gameboard__button--next"
                onClick={onFinishMatch}
              >
                Siguiente Pregunta / Ver Resultados &rarr;
              </button>
            </footer>
          </div>
        </article>

        <aside className="gameboard__sidebar" aria-label="Marcador en tiempo real">
          <h3 className="gameboard__sidebar-title">Puntuaciones en Vivo</h3>
          <ul className="gameboard__scoreboard" id="game-live-scoreboard">
            <li className="gameboard__score-item gameboard__score-item--answered">
              <span className="gameboard__score-name">Carloz</span>
              <span className="gameboard__score-status" title="Ya respondió">✔️</span>
              <strong className="gameboard__score-points">30 pts</strong>
            </li>
            <li className="gameboard__score-item">
              <span className="gameboard__score-name">Ana</span>
              <span className="gameboard__score-status" title="Pensando...">💭</span>
              <strong className="gameboard__score-points">20 pts</strong>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}