// src/components/Lobby.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { escucharPartida } from '../services/eventService';
import { iniciarPartida, obtenerPartida } from '../services/partidaService';

export default function Lobby({
  partida,
  session,
  onUpdatePartida,
  onStartMatch,
  onLeaveLobby,
  onError
}) {
  const [starting, setStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Refs estables para evitar reconexiones innecesarias de SSE
  const onUpdatePartidaRef = useRef(onUpdatePartida);
  const onStartMatchRef = useRef(onStartMatch);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onUpdatePartidaRef.current = onUpdatePartida;
    onStartMatchRef.current = onStartMatch;
    onErrorRef.current = onError;
  }, [onUpdatePartida, onStartMatch, onError]);

  const lastVersionRef = useRef(partida?.version ?? -1);

  const applyLobbyState = useCallback((nuevoEstado) => {
    if (!nuevoEstado) return;
    lastVersionRef.current = nuevoEstado.version ?? lastVersionRef.current;

    if (onUpdatePartidaRef.current) {
      onUpdatePartidaRef.current(nuevoEstado);
    }

    if (nuevoEstado.estado === 'EN_CURSO' && onStartMatchRef.current) {
      onStartMatchRef.current();
    }
  }, []);

  useEffect(() => {
    if (!partida?.id) return;
    let active = true;

    // Consulta inicial por si un jugador entró justo antes de abrir el SSE
    obtenerPartida(partida.id)
      .then((estadoInicial) => {
        if (active) applyLobbyState(estadoInicial);
      })
      .catch(() => {});

    // Suscripción en tiempo real por SSE
    const sse = escucharPartida(partida.id, (estadoSSE) => {
      if (active) applyLobbyState(estadoSSE);
    });

    // Respaldo comparando version por si el túnel interrumpe SSE
    const syncInterval = setInterval(async () => {
      try {
        const estadoActual = await obtenerPartida(partida.id);
        if (active && estadoActual && estadoActual.version !== lastVersionRef.current) {
          applyLobbyState(estadoActual);
        }
      } catch {
        // Ignorar errores transitorios en respaldo
      }
    }, 2500);

    return () => {
      active = false;
      sse.close();
      clearInterval(syncInterval);
    };
  }, [partida?.id, applyLobbyState]);

  if (!partida || !session) return null;

  const isHost = session.jugadorId === partida.anfitrionId;
  const jugadores = partida.jugadores || [];
  const canStart = isHost && jugadores.length >= 2 && !starting;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(partida.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignorar si el navegador bloquea el portapapeles
    }
  };

  const handleStartClick = async () => {
    if (!canStart) return;
    setStarting(true);
    try {
      await iniciarPartida(partida.id, session.token);
      const estadoActualizado = await obtenerPartida(partida.id);
      applyLobbyState(estadoActualizado);
      if (onStartMatchRef.current) onStartMatchRef.current();
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error);
      setStarting(false);
    }
  };

  return (
    <section id="view-lobby" className="lobby" aria-labelledby="lobby-heading">
      <header className="lobby__header">
        <div
          className="lobby__room-badge"
          onClick={handleCopyCode}
          style={{ cursor: 'pointer' }}
          title="Haz clic para copiar el código de sala"
        >
          <span className="lobby__room-label">
            {copied ? '¡Código Copiado!' : 'Código de Sala (clic para copiar):'}
          </span>
          <output id="lobby-room-code" className="lobby__room-code">
            {partida.id}
          </output>
        </div>

        <h2 id="lobby-heading" className="lobby__title">Sala de Espera</h2>

        <dl className="lobby__meta">
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Modalidad:</dt>
            <dd className="lobby__meta-desc" id="lobby-modality">
              {partida.modalidad || 'TIEMPO_REAL'}
            </dd>
          </div>
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Preguntas:</dt>
            <dd className="lobby__meta-desc" id="lobby-total-questions">
              {partida.totalPreguntas}
            </dd>
          </div>
          <div className="lobby__meta-item">
            <dt className="lobby__meta-term">Tiempo por pregunta:</dt>
            <dd className="lobby__meta-desc">
              <span id="lobby-seconds">{partida.segundosPorPregunta || 20}</span>s
            </dd>
          </div>
        </dl>
      </header>

      <section className="lobby__players-section" aria-label="Jugadores conectados">
        <header className="lobby__players-header">
          <h3 className="lobby__subtitle">Jugadores Conectados</h3>
          <span className="lobby__counter">
            <output id="lobby-player-count">{jugadores.length}</output> / 8 jugadores (Mínimo 2)
          </span>
        </header>

        <ul className="lobby__player-list" id="lobby-player-list">
          {jugadores.map((jugador) => {
            const esAnfitrion = jugador.id === partida.anfitrionId;
            const esYo = jugador.id === session.jugadorId;

            return (
              <li
                key={jugador.id}
                className={`lobby__player-item ${
                  esAnfitrion ? 'lobby__player-item--host' : ''
                }`}
                data-player-id={jugador.id}
              >
                <span className="lobby__player-name">
                  {jugador.nombre} {esYo ? '(Tú)' : ''}
                </span>
                <span className="lobby__player-badge">
                  {esAnfitrion ? '👑 Anfitrión' : 'Listo'}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="lobby__footer">
        <p className="lobby__status-msg" id="lobby-status-msg">
          <span className="lobby__spinner" aria-hidden="true">⏳</span>
          {isHost
            ? jugadores.length < 2
              ? 'Esperando al menos 2 jugadores para poder iniciar...'
              : '¡Sala lista! Ya puedes iniciar la partida.'
            : 'Escuchando eventos en tiempo real (SSE)... Esperando al anfitrión.'}
        </p>

        <div className="lobby__actions">
          {isHost && (
            <button
              type="button"
              id="btn-start-match"
              className="lobby__button--start"
              onClick={handleStartClick}
              disabled={!canStart}
              style={{
                opacity: canStart ? 1 : 0.55,
                cursor: canStart ? 'pointer' : 'not-allowed'
              }}
            >
              {starting ? 'Iniciando...' : 'Iniciar Partida Ahora'}
            </button>
          )}
          <button
            type="button"
            id="btn-leave-lobby"
            className="lobby__button--leave"
            onClick={onLeaveLobby}
          >
            Salir de la Sala
          </button>
        </div>
      </footer>
    </section>
  );
}