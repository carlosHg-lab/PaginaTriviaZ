// src/components/Menu.jsx
import React, { useState } from 'react';
import { crearPartida, unirsePartida } from '../services/partidaService';

export default function Menu({ playerName, onSessionCreated, onError }) {
  // null = Pantalla de selección de modo | 'INDIVIDUAL' | 'MULTIJUGADOR'
  const [selectedMode, setSelectedMode] = useState(null);

  const [totalQuestions, setTotalQuestions] = useState(10);
  const [modality, setModality] = useState('TIEMPO_REAL');
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(20);
  const [roomCode, setRoomCode] = useState('');

  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreateIndividual = async (e) => {
    e.preventDefault();
    const nombreJugador = playerName?.trim();
    if (!nombreJugador || creating) return;

    setCreating(true);
    try {
      const sesion = await crearPartida({
        nombre: nombreJugador,
        tipo: 'INDIVIDUAL',
        totalPreguntas: Number(totalQuestions)
      });
      onSessionCreated(sesion, nombreJugador);
    } catch (error) {
      onError(error);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateMultiplayer = async (e) => {
    e.preventDefault();
    const nombreJugador = playerName?.trim();
    if (!nombreJugador || creating) return;

    setCreating(true);
    try {
      const sesion = await crearPartida({
        nombre: nombreJugador,
        tipo: 'MULTIJUGADOR',
        modalidad: modality,
        totalPreguntas: Number(totalQuestions),
        segundosPorPregunta: Number(secondsPerQuestion)
      });
      onSessionCreated(sesion, nombreJugador);
    } catch (error) {
      onError(error);
    } finally {
      setCreating(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const nombreJugador = playerName?.trim();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanCode || !nombreJugador || joining) return;

    setJoining(true);
    try {
      const sesion = await unirsePartida(cleanCode, nombreJugador);
      onSessionCreated(sesion, nombreJugador);
    } catch (error) {
      onError(error);
    } finally {
      setJoining(false);
    }
  };

  // PASO 1: Elegir Modo (sin mostrar configuraciones todavía)
  if (!selectedMode) {
    return (
      <section id="view-menu" className="menu" aria-labelledby="menu-heading">
        <header className="menu__header">
          <h2 id="menu-heading" className="menu__title">Selecciona el Modo de Juego</h2>
          <p className="menu__subtitle">
            Hola <strong>{playerName}</strong>, ¿cómo quieres jugar hoy?
          </p>
        </header>

        <div className="menu__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article className="menu__card menu__card--create" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }} aria-hidden="true">
                🧠
              </span>
              <h3 className="menu__card-title">Modo Individual</h3>
              <p className="menu__description">
                Juega solo, responde a tu propio ritmo sin límite de tiempo por pregunta y supera tu puntaje.
              </p>
            </div>
            <button
              type="button"
              className="menu__button menu__button--primary"
              onClick={() => setSelectedMode('INDIVIDUAL')}
            >
              Jugar Individual &rarr;
            </button>
          </article>

          <article className="menu__card menu__card--join" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }} aria-hidden="true">
                ⚔️
              </span>
              <h3 className="menu__card-title">Modo Multijugador</h3>
              <p className="menu__description">
                Compite con de 2 a 8 jugadores en Tiempo Real o Por Turnos creando una sala o uniéndote con un código.
              </p>
            </div>
            <button
              type="button"
              className="menu__button menu__button--secondary"
              onClick={() => setSelectedMode('MULTIJUGADOR')}
            >
              Jugar Multijugador &rarr;
            </button>
          </article>
        </div>
      </section>
    );
  }

  // PASO 2A: Configuración exclusiva de Modo Individual
  if (selectedMode === 'INDIVIDUAL') {
    return (
      <section id="view-menu" className="menu" aria-labelledby="menu-heading">
        <header className="menu__header">
          <h2 id="menu-heading" className="menu__title">Partida Individual</h2>
          <p className="menu__subtitle">
            Configura la cantidad de preguntas para comenzar tu partida, <strong>{playerName}</strong>.
          </p>
        </header>

        <article className="menu__card menu__card--create" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form className="menu__form" id="form-create-individual" onSubmit={handleCreateIndividual}>
            <div className="menu__field">
              <label htmlFor="match-questions" className="menu__label">
                Total de Preguntas (1 - 50)
              </label>
              <input
                type="number"
                id="match-questions"
                name="totalPreguntas"
                className="menu__input"
                min="1"
                max="50"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="menu__button menu__button--primary"
              disabled={creating}
            >
              {creating ? 'Preparando Partida...' : 'Comenzar Partida'}
            </button>

            <button
              type="button"
              className="lobby__button--leave"
              style={{ width: '100%' }}
              onClick={() => setSelectedMode(null)}
              disabled={creating}
            >
              &larr; Cambiar Modo
            </button>
          </form>
        </article>
      </section>
    );
  }

  // PASO 2B: Configuración exclusiva de Modo Multijugador (Crear Sala o Unirse)
  return (
    <section id="view-menu" className="menu" aria-labelledby="menu-heading">
      <header className="menu__header">
        <h2 id="menu-heading" className="menu__title">Salas Multijugador</h2>
        <p className="menu__subtitle">
          Crea una sala nueva o ingresa el código de un amigo, <strong>{playerName}</strong>.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className="lobby__button--leave"
            onClick={() => setSelectedMode(null)}
          >
            &larr; Cambiar Modo
          </button>
        </div>
      </header>

      <div className="menu__grid">
        {/* Crear Sala Multijugador */}
        <article className="menu__card menu__card--create">
          <h3 className="menu__card-title">Crear Sala Multijugador</h3>

          <form className="menu__form" id="form-create-match" onSubmit={handleCreateMultiplayer}>
            <div className="menu__field">
              <label htmlFor="match-modality" className="menu__label">Modalidad de Juego</label>
              <select
                id="match-modality"
                name="modalidad"
                className="menu__select"
                value={modality}
                onChange={(e) => setModality(e.target.value)}
              >
                <option value="TIEMPO_REAL">Tiempo Real (Todos responden a la vez)</option>
                <option value="POR_TURNOS">Por Turnos (Rotación por jugador)</option>
              </select>
            </div>

            <div className="menu__field">
              <label htmlFor="match-questions" className="menu__label">
                Total de Preguntas (1 - 50)
              </label>
              <input
                type="number"
                id="match-questions"
                name="totalPreguntas"
                className="menu__input"
                min="1"
                max="50"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(e.target.value)}
                required
              />
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
                value={secondsPerQuestion}
                onChange={(e) => setSecondsPerQuestion(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="menu__button menu__button--primary"
              disabled={creating}
            >
              {creating ? 'Creando Sala...' : 'Crear Sala'}
            </button>
          </form>
        </article>

        {/* Unirse a Sala */}
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
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="menu__button menu__button--secondary"
              disabled={joining}
            >
              {joining ? 'Uniéndose...' : 'Unirse a la Partida'}
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}