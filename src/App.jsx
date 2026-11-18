// src/App.jsx
import React from 'react';
import './App.css';
import UserLogin from './components/UserLogin';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Results from './components/Results';
import Practice from './components/Practice';
import History from './components/History';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <div className="app">
      {/* Overlay global para efecto de tensión inmersiva en pantalla completa cuando el tiempo expira */}
      <div id="screen-fx" className="screen-fx"></div>

      {/* CABECERA PRINCIPAL Y NAVEGACIÓN DE VISTAS (Bloque: navbar) */}
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">
            <img
              src="sources/lightlogo.jpeg"
              alt="Trivia Z Logo"
              className="navbar__logo-img logo-variant--light"
            />
            <img
              src="sources/nightlogo.jpeg"
              alt="Trivia Z Logo"
              className="navbar__logo-img logo-variant--dark"
            />
          </span>
          <h1 className="navbar__title">
            Trivia<span className="navbar__title--highlight">Z</span>
          </h1>
        </div>

        <nav className="navbar__nav" aria-label="Navegación de componentes">
          <ul className="navbar__list">
            <li className="navbar__item">
              <button type="button" className="navbar__link navbar__link--active" data-target="login">
                Ingreso
              </button>
            </li>
            <li className="navbar__item">
              <button type="button" className="navbar__link" data-target="menu">
                Inicio / Salas
              </button>
            </li>
            <li className="navbar__item">
              <button type="button" className="navbar__link" data-target="practice">
                Práctica Libre
              </button>
            </li>
            <li className="navbar__item">
              <button type="button" className="navbar__link" data-target="history">
                Historial Global
              </button>
            </li>
            <li className="navbar__item">
              <button type="button" className="navbar__link navbar__link--admin" data-target="admin">
                Panel Admin
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                id="btn-theme-toggle"
                className="navbar__link"
                aria-label="Cambiar entre modo claro y oscuro"
              >
                🌙 Modo Oscuro
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL DE VISTAS */}
      <main className="app__main">
        {/* Notificación global para errores de API: {"error": "mensaje"} (401, 403, 409) */}
        <aside
          className="alert alert--error alert--hidden"
          role="alert"
          aria-live="assertive"
          id="api-alert"
        >
          <strong className="alert__status">
            Error <span className="alert__code">409</span>:
          </strong>
          <p className="alert__message">Ya respondiste esta pregunta.</p>
          <button type="button" className="alert__close" aria-label="Cerrar alerta">
            &times;
          </button>
        </aside>

        {/* Renderizado de Componentes */}
        <UserLogin />
        <Menu />
        <Lobby />
        <GameBoard />
        <Results />
        <Practice />
        <History />
        <AdminPanel />
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">
        <p className="footer__text">
          Trivia Z &bull; Conectado a <code className="footer__code">http://localhost:8080</code>
        </p>
      </footer>
    </div>
  );
}