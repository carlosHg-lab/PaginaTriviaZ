// src/components/GameBoard.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { escucharPartida } from '../services/eventService';
import {
  obtenerPartida,
  obtenerPreguntaActual,
  responderPregunta,
  siguientePregunta
} from '../services/partidaService';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function GameBoard({
  partida,
  session,
  onUpdatePartida,
  onFinishMatch,
  onError
}) {
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [answeredInCurrentQ, setAnsweredInCurrentQ] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [cardAnimClass, setCardAnimClass] = useState('gameboard__card-flipper--enter');
  const [deckHistory, setDeckHistory] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(
    partida?.segundosRestantes ?? partida?.segundosPorPregunta ?? 20
  );

  // Refs estables para evitar re-ejecutar efectos y saturar el túnel
  const onUpdatePartidaRef = useRef(onUpdatePartida);
  const onFinishMatchRef = useRef(onFinishMatch);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onUpdatePartidaRef.current = onUpdatePartida;
    onFinishMatchRef.current = onFinishMatch;
    onErrorRef.current = onError;
  }, [onUpdatePartida, onFinishMatch, onError]);

  const lastQuestionIndexRef = useRef(null);
  const lastVersionRef = useRef(partida?.version ?? -1);

  const isIndividual = partida?.tipo === 'INDIVIDUAL';
  const isTurnBased = partida?.modalidad === 'POR_TURNOS';
  const isHost = session?.jugadorId === partida?.anfitrionId;
  const currentIdx = partida?.preguntaActual ?? 0;
  const totalQuestions = partida?.totalPreguntas || 1;
  const displayNumber = Math.min(currentIdx + 1, totalQuestions);
  const remainingCards = Math.max(totalQuestions - displayNumber, 0);

  const fetchCurrentQuestion = useCallback(
    async (qIndex) => {
      if (!partida?.id) return;
      try {
        setCardAnimClass('gameboard__card-flipper--exit');
        const data = await obtenerPreguntaActual(partida.id);
        const qObj = data?.pregunta ? { ...data.pregunta, ...data } : data;

        setQuestionData(qObj);
        setSelectedOption(null);
        setAnswerResult(null);
        setAnsweredInCurrentQ(Array.isArray(data?.respondieron) ? data.respondieron : []);

        if (typeof data?.segundosRestantes === 'number') {
          setSecondsLeft(data.segundosRestantes);
        }

        lastQuestionIndexRef.current = qIndex;
        requestAnimationFrame(() => {
          setCardAnimClass('gameboard__card-flipper--enter');
        });
      } catch (error) {
        if (onErrorRef.current) onErrorRef.current(error);
      }
    },
    [partida?.id]
  );

  const applyPartidaState = useCallback(
    (nuevoEstado) => {
      if (!nuevoEstado) return;
      lastVersionRef.current = nuevoEstado.version ?? lastVersionRef.current;
      if (onUpdatePartidaRef.current) onUpdatePartidaRef.current(nuevoEstado);

      if (typeof nuevoEstado.segundosRestantes === 'number') {
        setSecondsLeft(nuevoEstado.segundosRestantes);
      }

      if (Array.isArray(nuevoEstado.respondieron)) {
        setAnsweredInCurrentQ(nuevoEstado.respondieron);
      }

      if (nuevoEstado.estado === 'FINALIZADA') {
        const screenFx = document.getElementById('screen-fx');
        if (screenFx) screenFx.classList.remove('screen-fx-urgent');
        if (onFinishMatchRef.current) onFinishMatchRef.current();
        return;
      }

      if (nuevoEstado.preguntaCerrada) {
        const idx = nuevoEstado.preguntaActual ?? 0;
        setDeckHistory((prev) =>
          prev[idx] ? prev : { ...prev, [idx]: 'unanswered' }
        );
      }

      const newIdx = nuevoEstado.preguntaActual ?? 0;
      if (lastQuestionIndexRef.current !== newIdx) {
        fetchCurrentQuestion(newIdx);
      }
    },
    [fetchCurrentQuestion]
  );

  // Carga inicial de pregunta + SSE solo en MULTIJUGADOR
  useEffect(() => {
    if (!partida?.id) return;
    let active = true;

    fetchCurrentQuestion(partida.preguntaActual ?? 0);

    if (isIndividual) {
      return () => {
        active = false;
      };
    }

    const sse = escucharPartida(partida.id, (estadoSSE) => {
      if (active) applyPartidaState(estadoSSE);
    });

    const syncInterval = setInterval(async () => {
      try {
        const estadoActual = await obtenerPartida(partida.id);
        if (active && estadoActual && estadoActual.version !== lastVersionRef.current) {
          applyPartidaState(estadoActual);
        }
      } catch {
        // Ignorar fallos transitorios de red en polling de respaldo
      }
    }, 2000);

    return () => {
      active = false;
      sse.close();
      clearInterval(syncInterval);
    };
  }, [partida?.id, isIndividual, fetchCurrentQuestion, applyPartidaState]);

  // Temporizador visual en el navegador (solo en multijugador)
  useEffect(() => {
    if (isIndividual || partida?.preguntaCerrada || partida?.estado === 'FINALIZADA') {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isIndividual, partida?.preguntaCerrada, partida?.estado, currentIdx]);

  // Efecto de tensión cuando quedan <= 5 segundos
  useEffect(() => {
    const screenFx = document.getElementById('screen-fx');
    if (!screenFx) return;

    if (!isIndividual && !partida?.preguntaCerrada && secondsLeft > 0 && secondsLeft <= 5) {
      screenFx.classList.add('screen-fx-urgent');
    } else {
      screenFx.classList.remove('screen-fx-urgent');
    }
  }, [isIndividual, partida?.preguntaCerrada, secondsLeft]);

  if (!partida || !session) return null;

  const alreadyAnswered =
    selectedOption !== null || answeredInCurrentQ.includes(session.jugadorId);
  const isMyTurn = !isTurnBased || partida.turnoJugadorId === session.jugadorId;
  const isQuestionClosed = Boolean(partida.preguntaCerrada);
  const optionsDisabled = submitting || alreadyAnswered || !isMyTurn || isQuestionClosed;

  const turnPlayerObj = (partida.jugadores || []).find(
    (j) => j.id === partida.turnoJugadorId
  );

  const correctOptionIndex =
    answerResult?.opcionCorrecta ??
    (isQuestionClosed ? partida.opcionCorrecta : null);

  const handleSelectOption = async (optionIndex) => {
    if (optionsDisabled) return;

    setSubmitting(true);
    setSelectedOption(optionIndex);
    try {
      const res = await responderPregunta(partida.id, optionIndex, session.token);
      setAnswerResult(res);

      setAnsweredInCurrentQ((prev) =>
        prev.includes(session.jugadorId) ? prev : [...prev, session.jugadorId]
      );

      setDeckHistory((prev) => ({
        ...prev,
        [currentIdx]: res.correcta ? 'correct' : 'wrong'
      }));

      if (onUpdatePartidaRef.current) {
        onUpdatePartidaRef.current((prev) => {
          const updatedJugadores = Array.isArray(res.puntuaciones)
            ? res.puntuaciones.map((p) => ({
                ...p,
                id: p.id ?? p.jugadorId
              }))
            : prev.jugadores;

          return {
            ...prev,
            jugadores: updatedJugadores,
            preguntaCerrada: res.preguntaCerrada ?? prev.preguntaCerrada,
            opcionCorrecta: res.opcionCorrecta ?? prev.opcionCorrecta
          };
        });
      }
    } catch (error) {
      setSelectedOption(null);
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    if (advancing) return;
    setAdvancing(true);
    try {
      await siguientePregunta(partida.id, session.token);
      const estadoActualizado = await obtenerPartida(partida.id);
      applyPartidaState(estadoActualizado);
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      setAdvancing(false);
    }
  };

  const optionsList = questionData?.options || questionData?.opciones || [];
  const questionText =
    questionData?.question || questionData?.texto || 'Cargando pregunta...';
  const categoryText =
    questionData?.category || questionData?.categoria || 'General';

  const maxSeconds = partida.segundosPorPregunta || 20;
  const timePercentage = isIndividual
    ? 100
    : Math.max(0, Math.min(100, (secondsLeft / maxSeconds) * 100));

  const showFeedbackPanel =
    answerResult !== null || isQuestionClosed || (isTurnBased && !isMyTurn);

  const canAdvanceManually =
    (isIndividual && (answerResult !== null || isQuestionClosed)) ||
    (!isIndividual && isHost && isQuestionClosed);

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
            <span id="game-current-q">{displayNumber}</span> /{' '}
            <span id="game-total-q">{totalQuestions}</span>
          </strong>
        </div>

        <div
          className={`gameboard__turn ${isMyTurn ? 'gameboard__turn--my-turn' : ''}`}
          id="game-turn-indicator"
        >
          <span className="gameboard__turn-label">
            {isTurnBased ? 'Turno actual:' : 'Modalidad:'}
          </span>
          <strong className="gameboard__turn-player" id="game-turn-player">
            {isIndividual
              ? 'Individual (Sin límite de tiempo)'
              : isTurnBased
              ? partida.turnoJugadorId === session.jugadorId
                ? `${turnPlayerObj?.nombre || 'Tú'} (Tu turno)`
                : turnPlayerObj?.nombre || 'Esperando...'
              : 'Tiempo Real (Todos responden)'}
          </strong>
        </div>

        <div className="gameboard__timer" id="game-timer" role="timer" aria-live="off">
          <span className="gameboard__timer-icon" aria-hidden="true">⏱️</span>
          <output id="game-seconds-left" className="gameboard__timer-value">
            {isIndividual ? '∞' : secondsLeft}
          </output>
          {!isIndividual && <span className="gameboard__timer-unit">s</span>}
        </div>
      </header>

      <div className="gameboard__time-bar-container">
        <div
          id="game-time-bar"
          className="gameboard__time-bar"
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>

      <div className="gameboard__layout">
        <article className="gameboard__stage">
          <div className="gameboard__deck-container" aria-label="Progreso del mazo de cartas">
            <div className="gameboard__deck-slots" id="deck-slots-container">
              {Array.from({ length: totalQuestions }).map((_, idx) => {
                const status = deckHistory[idx];
                let slotClass = 'deck-slot';
                if (idx === currentIdx && !status) {
                  slotClass += ' deck-slot--current';
                } else if (status === 'correct') {
                  slotClass += ' deck-slot--correct';
                } else if (status === 'wrong') {
                  slotClass += ' deck-slot--wrong';
                } else if (status === 'unanswered') {
                  slotClass += ' deck-slot--unanswered';
                }
                return (
                  <span key={idx} className={slotClass}>
                    {idx + 1}
                  </span>
                );
              })}
            </div>
            <span className="gameboard__deck-label">
              Quedan <strong id="deck-remaining-count">{remainingCards}</strong> cartas
            </span>
          </div>

          <div className={`gameboard__card-flipper ${cardAnimClass}`} id="game-card-flipper">
            <header className="gameboard__question-header">
              <span className="gameboard__category" id="game-category">
                {categoryText}
              </span>
              <span
                className="gameboard__state-badge gameboard__state-badge--open"
                id="game-question-state"
              >
                {isQuestionClosed ? 'Pregunta Cerrada' : 'Pregunta Abierta'}
              </span>
            </header>

            <h2 id="gameboard-question-text" className="gameboard__question">
              {questionText}
            </h2>

            <div
              className="gameboard__options"
              role="group"
              aria-label="Opciones de respuesta"
              id="game-options-list"
            >
              {optionsList.map((optText, index) => {
                let btnClass = 'gameboard__option';
                if (correctOptionIndex !== null && index === correctOptionIndex) {
                  btnClass += ' gameboard__option--correct';
                } else if (
                  selectedOption === index &&
                  answerResult &&
                  !answerResult.correcta
                ) {
                  btnClass += ' gameboard__option--wrong';
                } else if (optionsDisabled) {
                  btnClass += ' gameboard__option--disabled';
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={btnClass}
                    data-option-index={index}
                    disabled={optionsDisabled}
                    onClick={() => handleSelectOption(index)}
                  >
                    <span className="gameboard__option-prefix">
                      {OPTION_LETTERS[index] || index + 1}
                    </span>
                    <span className="gameboard__option-text">{optText}</span>
                  </button>
                );
              })}
            </div>

            {showFeedbackPanel && (
              <footer className="gameboard__feedback" id="game-feedback" aria-live="polite">
                <div className="gameboard__feedback-info">
                  {answerResult ? (
                    <p className="gameboard__feedback-text">
                      {answerResult.correcta ? (
                        <>
                          ¡Respuesta correcta! Sumaste{' '}
                          <strong className="gameboard__points-earned">
                            +{answerResult.puntosGanados ?? 10} puntos
                          </strong>
                          .
                        </>
                      ) : (
                        <>
                          Respuesta incorrecta.{' '}
                          {typeof correctOptionIndex === 'number' &&
                            optionsList[correctOptionIndex] && (
                              <>
                                La correcta era:{' '}
                                <strong>{optionsList[correctOptionIndex]}</strong>
                              </>
                            )}
                        </>
                      )}
                    </p>
                  ) : isQuestionClosed ? (
                    <p className="gameboard__feedback-text">
                      Tiempo agotado / Pregunta cerrada.{' '}
                      {typeof correctOptionIndex === 'number' &&
                        optionsList[correctOptionIndex] && (
                          <>
                            Respuesta correcta:{' '}
                            <strong>{optionsList[correctOptionIndex]}</strong>
                          </>
                        )}
                    </p>
                  ) : (
                    <p className="gameboard__feedback-text">
                      Es el turno de{' '}
                      <strong>{turnPlayerObj?.nombre || 'otro jugador'}</strong>. Espera a
                      que responda...
                    </p>
                  )}

                  <p className="gameboard__auto-advance-note">
                    {isIndividual
                      ? 'Presiona siguiente para robar la próxima carta...'
                      : isQuestionClosed
                      ? 'Avanzando automáticamente en 5 segundos (el anfitrión puede adelantar)...'
                      : 'Esperando a los demás jugadores...'}
                  </p>
                </div>

                {canAdvanceManually && (
                  <button
                    type="button"
                    id="btn-next-question"
                    className="gameboard__button gameboard__button--next"
                    onClick={handleNextQuestion}
                    disabled={advancing}
                  >
                    {advancing
                      ? 'Cargando...'
                      : displayNumber >= totalQuestions
                      ? 'Ver Resultados Finales →'
                      : 'Siguiente Pregunta →'}
                  </button>
                )}
              </footer>
            )}
          </div>
        </article>

        <aside className="gameboard__sidebar" aria-label="Marcador en tiempo real">
          <h3 className="gameboard__sidebar-title">Puntuaciones en Vivo</h3>
          <ul className="gameboard__scoreboard" id="game-live-scoreboard">
            {(partida.jugadores || []).map((jugador) => {
              const yaRespondio = answeredInCurrentQ.includes(jugador.id);
              return (
                <li
                  key={jugador.id}
                  className={`gameboard__score-item ${
                    yaRespondio ? 'gameboard__score-item--answered' : ''
                  }`}
                >
                  <span className="gameboard__score-name">
                    {jugador.nombre} {jugador.id === session.jugadorId ? '(Tú)' : ''}
                  </span>
                  <span
                    className="gameboard__score-status"
                    title={yaRespondio ? 'Ya respondió' : 'Pensando...'}
                  >
                    {yaRespondio ? '✔️' : '💭'}
                  </span>
                  <strong className="gameboard__score-points">
                    {jugador.puntos ?? 0} pts
                  </strong>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </section>
  );
}