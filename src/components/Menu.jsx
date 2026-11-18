// src/components/Menu.jsx
import React, { useState } from 'react';

export default function Menu({ playerName, onCreateMatch, onJoinMatch }) {
  const [matchType, setMatchType] = useState('INDIVIDUAL');
  const [hostName, setHostName] = useState(playerName || '');
  const [guestName, setGuestName] = useState(playerName || '');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    onCreateMatch(matchType);
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    onJoinMatch();
  };

  return (
    <section id="view-menu" className="menu" aria-labelledby="menu-heading">
      <header className="menu__header">
        <h2 id="menu-heading" className="menu__title">Configuración de Partida</h2>
        <p className="menu__subtitle">
          Crea una sala nueva o ingresa el código de un amigo para competir.
        </p>
      </header>

      <div className="menu__grid">
        {/* Sub-componente: Crear Partida */}
        <article className="menu__card menu__card--create">
          <h3 className="menu__card-title">Crear Nueva Partida</h3>

          <form className="menu__form" id="form-create-match" onSubmit={handleCreateSubmit}>
            <div className="menu__field">
              <label htmlFor="host-name" className="menu__label">Tu Nombre (Anfitrión)</label>
              <input
                type="text"
                id="host-name"
                name="nombre"
                className="menu__input"
                placeholder="Ej. Carloz"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                required
              />
            </div>

            <fieldset className="menu__fieldset">
              <legend className="menu__legend">Tipo de Partida</legend>
              <div className="menu__radio-group">
                <label className="menu__radio-label">
                  <input
                    type="radio"
                    name="tipo"
                    value="INDIVIDUAL"
                    className="menu__radio"
                    checked={matchType === 'INDIVIDUAL'}
                    onChange={(e) => setMatchType(e.target.value)}
                  />
                  <span className="menu__radio-text">Individual</span>
                </label>
                <label className="menu__radio-label">
                  <input
                    type="radio"
                    name="tipo"
                    value="MULTIJUGADOR"
                    className="menu__radio"
                    checked={matchType === 'MULTIJUGADOR'}
                    onChange={(e) => setMatchType(e.target.value)}
                  />
                  <span className="menu__radio-text">Multijugador (2-8 jugadores)</span>
                </label>
              </div>
            </fieldset>

            <div className="menu__field">
              <label htmlFor="match-questions" className="menu__label">Total de Preguntas</label>
              <input
                type="number"
                id="match-questions"
                name="totalPreguntas"
                className="menu__input"
                min="1"
                max="50"
                defaultValue="10"
                required
              />
            </div>

            {/* Opciones exclusivas de Multijugador */}
            <fieldset
              className={`menu__fieldset menu__fieldset--multiplayer ${
                matchType === 'INDIVIDUAL' ? 'menu__multiplayer-options--disabled' : ''
              }`}
              id="multiplayer-options"
            >
              <legend className="menu__legend">Ajustes Multijugador</legend>

              <div className="menu__field">
                <label htmlFor="match-modality" className="menu__label">Modalidad de Juego</label>
                <select
                  id="match-modality"
                  name="modalidad"
                  className="menu__select"
                  defaultValue="TIEMPO_REAL"
                >
                  <option value="TIEMPO_REAL">Tiempo Real (Todos responden a la vez)</option>
                  <option value="POR_TURNOS">Por Turnos (Rotación por jugador)</option>
                </select>
              </div>

              <div className="menu__field">
                <label htmlFor="match-seconds" className="menu__label">
                  Segundos por Pregunta (5 - 120s)
                </label>
                <input
                  type="number"
                  id="match-seconds"
                  name="segundosPorPregunta"
                  className="menu__input"
                  min="5"
                  max="120"
                  defaultValue="20"
                />
              </div>
            </fieldset>

            <button type="submit" className="menu__button menu__button--primary">
              Crear Sala
            </button>
          </form>
        </article>

        {/* Sub-componente: Unirse a Partida */}
        <article className="menu__card menu__card--join">
          <h3 className="menu__card-title">Unirse a una Sala</h3>
          <p className="menu__description">
            Ingresa el código de la sala mientras esté en espera (máx. 8 jugadores).
          </p>

          <form className="menu__form" id="form-join-match" onSubmit={handleJoinSubmit}>
            <div className="menu__field">
              <label htmlFor="join-room-id" className="menu__label">
                Código de la Sala (ID Partida)
              </label>
              <input
                type="text"
                id="join-room-id"
                name="partidaId"
                className="menu__input menu__input--code"
                placeholder="Ej. A1B2C3"
                required
              />
            </div>

            <div className="menu__field">
              <label htmlFor="guest-name" className="menu__label">Tu Nombre de Jugador</label>
              <input
                type="text"
                id="guest-name"
                name="nombre"
                className="menu__input"
                placeholder="Ej. Ana"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="menu__button menu__button--secondary">
              Unirse a la Partida
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}