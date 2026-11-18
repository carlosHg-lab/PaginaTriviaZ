// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BASE_URL } from './config/api';
import UserLogin from './components/UserLogin';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import Results from './components/Results';
import Practice from './components/Practice';
import History from './components/History';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem('trivia-player-name') || ''
  );
  // Controla si ya ingresó su nombre al entrar (estilo Haxball: una sola vez al inicio)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('menu');

  // Sesión activa de partida: { jugadorId, token, partidaId }
  const [session, setSession] = useState(null);
  const [partida, setPartida] = useState(null);
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem('trivia-admin-key') || ''
  );

  const [apiError, setApiError] = useState(null);

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

  const showError = useCallback((error, fallbackCode = 'API') => {
    const message =
      typeof error === 'string'
        ? error
        : error?.message || 'Ocurrió un error inesperado con el servidor.';
    const matchCode = message.match(/\b(400|401|403|404|409|500|511)\b/);
    setApiError({
      code: matchCode ? matchCode[1] : fallbackCode,
      message
    });
  }, []);

  const clearError = useCallback(() => setApiError(null), []);

  useEffect(() => {
    if (currentView !== 'gameboard') {
      const screenFx = document.getElementById('screen-fx');
      if (screenFx) screenFx.classList.remove('screen-fx-urgent');
    }
  }, [currentView]);

  const handleLoginSuccess = (name) => {
    clearError();
    setPlayerName(name);
    localStorage.setItem('trivia-player-name', name);
    setIsLoggedIn(true);
    setCurrentView('menu');
  };

  const handleSessionStart = ({ jugadorId, token, partida: nuevaPartida }, nombreUsado) => {
    clearError();
    if (nombreUsado) {
      setPlayerName(nombreUsado);
      localStorage.setItem('trivia-player-name', nombreUsado);
    }
    setSession({
      jugadorId,
      token,
      partidaId: nuevaPartida.id
    });
    setPartida(nuevaPartida);

    if (nuevaPartida.tipo === 'INDIVIDUAL' || nuevaPartida.estado === 'EN_CURSO') {
      setCurrentView('gameboard');
    } else {
      setCurrentView('lobby');
    }
  };

  const handleResetMatch = () => {
    clearError();
    setSession(null);
    setPartida(null);
    setCurrentView('menu');
  };

  const handleGoToSalas = () => {
    clearError();
    if (partida && session) {
      if (partida.estado === 'FINALIZADA') setCurrentView('results');
      else if (partida.estado === 'EN_CURSO') setCurrentView('gameboard');
      else setCurrentView('lobby');
    } else {
      setCurrentView('menu');
    }
  };

  return (
    <div className="app">
      <div id="screen-fx" className="screen-fx"></div>

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
            {isLoggedIn && (
              <>
                <li className="navbar__item">
                  {/* Etiqueta fija del jugador: no regresa al login */}
                  <span
                    className="navbar__link navbar__link--active"
                    style={{ cursor: 'default' }}
                    title="Jugador conectado"
                  >
                    👤 {playerName}
                  </span>
                </li>
                <li className="navbar__item">
                  <button
                    type="button"
                    className={`navbar__link ${
                      ['menu', 'lobby', 'gameboard', 'results'].includes(currentView)
                        ? 'navbar__link--active'
                        : ''
                    }`}
                    onClick={handleGoToSalas}
                  >
                    Jugar / Salas
                  </button>
                </li>
                <li className="navbar__item">
                  <button
                    type="button"
                    className={`navbar__link ${currentView === 'practice' ? 'navbar__link--active' : ''}`}
                    onClick={() => {
                      clearError();
                      setCurrentView('practice');
                    }}
                  >
                    Práctica Libre
                  </button>
                </li>
                <li className="navbar__item">
                  <button
                    type="button"
                    className={`navbar__link ${currentView === 'history' ? 'navbar__link--active' : ''}`}
                    onClick={() => {
                      clearError();
                      setCurrentView('history');
                    }}
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
                    onClick={() => {
                      clearError();
                      setCurrentView('admin');
                    }}
                  >
                    Panel Admin
                  </button>
                </li>
              </>
            )}

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

      <main className="app__main">
        <aside
          className={`alert alert--error ${apiError ? '' : 'alert--hidden'}`}
          role="alert"
          aria-live="assertive"
          id="api-alert"
        >
          <strong className="alert__status">
            Error <span className="alert__code">{apiError?.code}</span>:
          </strong>
          <p className="alert__message">{apiError?.message}</p>
          <button
            type="button"
            className="alert__close"
            aria-label="Cerrar alerta"
            onClick={clearError}
          >
            &times;
          </button>
        </aside>

        {!isLoggedIn ? (
          <UserLogin
            initialName={playerName}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <>
            {currentView === 'menu' && (
              <Menu
                playerName={playerName}
                onSessionCreated={handleSessionStart}
                onError={showError}
              />
            )}

            {currentView === 'lobby' && partida && session && (
              <Lobby
                partida={partida}
                session={session}
                onUpdatePartida={setPartida}
                onStartMatch={() => setCurrentView('gameboard')}
                onLeaveLobby={handleResetMatch}
                onError={showError}
              />
            )}

            {currentView === 'gameboard' && partida && session && (
              <GameBoard
                partida={partida}
                session={session}
                onUpdatePartida={setPartida}
                onFinishMatch={() => setCurrentView('results')}
                onError={showError}
              />
            )}

            {currentView === 'results' && partida && (
              <Results
                partida={partida}
                onBackToMenu={handleResetMatch}
                onError={showError}
              />
            )}

            {currentView === 'practice' && <Practice onError={showError} />}

            {currentView === 'history' && <History onError={showError} />}

            {currentView === 'admin' && (
              <AdminPanel
                adminKey={adminKey}
                onAdminKeyChange={(key) => {
                  setAdminKey(key);
                  sessionStorage.setItem('trivia-admin-key', key);
                }}
                onError={showError}
                onClearError={clearError}
              />
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p className="footer__text">
          Trivia Z &bull; Conectado a <code className="footer__code">{BASE_URL}</code>
        </p>
      </footer>
    </div>
  );
}