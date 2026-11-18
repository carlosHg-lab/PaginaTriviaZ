// src/components/UserLogin.jsx
import React, { useState } from 'react';

export default function UserLogin({ initialName, onLoginSuccess }) {
  const [nameInput, setNameInput] = useState(initialName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onLoginSuccess(nameInput.trim());
  };

  return (
    <section
      id="view-login"
      className="lobby"
      style={{ maxWidth: '460px', marginTop: '2rem' }}
      aria-labelledby="login-heading"
    >
      <header className="lobby__header">
        <span style={{ fontSize: '2.75rem', display: 'block', marginBottom: '0.5rem' }} aria-hidden="true">
          🎯
        </span>
        <h2 id="login-heading" className="menu__title">
          ¡Bienvenido a Trivia Z!
        </h2>
        <p className="menu__subtitle">
          Elige tu apodo de jugador para entrar al juego.
        </p>
      </header>

      <form className="menu__form" id="form-user-login" onSubmit={handleSubmit}>
        <div className="menu__field">
          <label htmlFor="player-username" className="menu__label">
            Apodo / Nombre de Jugador
          </label>
          <input
            type="text"
            id="player-username"
            name="nombre"
            className="menu__input"
            placeholder="Ej. Carloz"
            maxLength={25}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            required
            autoFocus
          />
        </div>

        <button type="submit" className="menu__button menu__button--primary">
          Entrar &rarr;
        </button>
      </form>
    </section>
  );
}