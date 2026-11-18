// src/components/UserLogin.jsx
import React, { useState } from 'react';

export default function UserLogin({ playerName, onLoginSuccess }) {
  const [nameInput, setNameInput] = useState(playerName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onLoginSuccess(nameInput.trim());
  };

  return (
    <section id="view-login" className="login" aria-labelledby="login-heading">
      <article className="login__card">
        <header className="login__header">
          <span className="login__icon" aria-hidden="true">👤</span>
          <h2 id="login-heading" className="login__title">Ingreso a Trivia Z</h2>
          <p className="login__subtitle">
            Ingresa tu nombre de jugador para identificarte y vincular tu token de sesión.
          </p>
        </header>

        <form className="login__form" id="form-user-login" onSubmit={handleSubmit}>
          <div className="login__field">
            <label htmlFor="player-username" className="login__label">
              Tu Nombre de Jugador
            </label>
            <input
              type="text"
              id="player-username"
              name="nombre"
              className="login__input"
              placeholder="Ej. Carloz"
              maxLength={25}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login__button login__button--primary">
            Continuar a las Salas &rarr;
          </button>
        </form>

        <footer className="login__session-info" aria-live="polite">
          <div className="login__badge-group">
            <span className="login__badge-label">Estado de Sesión:</span>
            <output id="login-session-status" className="login__badge login__badge--pending">
              {playerName ? `Activo como ${playerName}` : 'Sin sala activa'}
            </output>
          </div>

          <dl className="login__token-details">
            <div className="login__token-row">
              <dt className="login__token-term">ID Público (jugadorId):</dt>
              <dd className="login__token-value">
                <code id="display-player-id">---</code>
              </dd>
            </div>
            <div className="login__token-row">
              <dt className="login__token-term">Token Secreto (X-Jugador-Token):</dt>
              <dd className="login__token-value">
                <code id="display-player-token">Se generará al crear o unirte a una partida</code>
              </dd>
            </div>
          </dl>
        </footer>
      </article>
    </section>
  );
}