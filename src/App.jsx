// src/App.jsx
import React, { useState, useEffect } from 'react';
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
  // Estado que controla qué componente se ve en pantalla
  const [currentView, setCurrentView] = useState('login');
  
  // Estado global del jugador
  const [playerName, setPlayerName] = useState('');

  // Estado para Modo Claro / Oscuro
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('trivia-theme') === 'dark'
  );

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (isDarkMode) {
      htmlEl.setAttribute('data-theme', 'dark');
      localStorage.setItem('trivia-theme', 'dark');
    } else {
      htmlEl.removeAttribute('data-theme');
      localStorage.setItem('trivia-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="app">
      {/* Overlay global para efecto de tensión inmersiva */}
      <div id="screen-fx" className="screen-fx"></div>

      {/* CABECERA PRINCIPAL Y NAVEGACIÓN DE VISTAS */}
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
              <button
                type="button"
                className={`navbar__link ${currentView === 'login' ? 'navbar__link--active' : ''}`}
                onClick={() => setCurrentView('login')}
              >
                👤 {playerName ? playerName : 'Ingreso'}
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                className={`navbar__link ${
                  ['menu', 'lobby', 'gameboard', 'results'].includes(currentView)
                    ? 'navbar__link--active'
                    : ''
                }`}
                onClick={() => setCurrentView('menu')}
              >
                Inicio / Salas
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                className={`navbar__link ${currentView === 'practice' ? 'navbar__link--active' : ''}`}
                onClick={() => setCurrentView('practice')}
              >
                Práctica Libre
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                className={`navbar__link ${currentView === 'history' ? 'navbar__link--active' : ''}`}
                onClick={() => setCurrentView('history')}
              >
                Historial Global
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                className={`navbar__link navbar__link--admin ${
                  currentView === 'admin' ? 'navbar__link--active' : ''
                }`}
                onClick={() => setCurrentView('admin')}
              >
                Panel Admin
              </button>
            </li>
            <li className="navbar__item">
              <button
                type="button"
                id="btn-theme-toggle"
                className="navbar__link"
                onClick={toggleTheme}
                aria-label="Cambiar entre modo claro y oscuro"
              >
                {isDarkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENEDOR PRINCIPAL DE VISTAS */}
      <main className="app__main">
        {/* Notificación global para errores de API */}
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

        {/* Renderizado condicional según currentView */}
        {currentView === 'login' && (
          <UserLogin
            playerName={playerName}
            onLoginSuccess={(name) => {
              setPlayerName(name);
              setCurrentView('menu');
            }}
          />
        )}

        {currentView === 'menu' && (
          <Menu
            playerName={playerName}
            onCreateMatch={(tipo) => {
              // Si es individual va directo al tablero, si es multijugador pasa por la sala de espera
              setCurrentView(tipo === 'INDIVIDUAL' ? 'gameboard' : 'lobby');
            }}
            onJoinMatch={() => setCurrentView('lobby')}
          />
        )}

        {currentView === 'lobby' && (
          <Lobby
            onStartMatch={() => setCurrentView('gameboard')}
            onLeaveLobby={() => setCurrentView('menu')}
          />
        )}

        {currentView === 'gameboard' && (
          <GameBoard onFinishMatch={() => setCurrentView('results')} />
        )}

        {currentView === 'results' && (
          <Results onBackToMenu={() => setCurrentView('menu')} />
        )}

        {currentView === 'practice' && <Practice />}

        {currentView === 'history' && <History />}

        {currentView === 'admin' && <AdminPanel />}
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