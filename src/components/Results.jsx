// src/components/Results.jsx
import React from 'react';

export default function Results() {
  return (
    <section id="view-results" className="results results--hidden" aria-labelledby="results-heading">
      <header className="results__header">
        <span className="results__trophy" aria-hidden="true">🏆</span>
        <h2 id="results-heading" className="results__title">¡Partida Finalizada!</h2>
        <p className="results__winner-banner">
          Ganador de la partida: <strong className="results__winner-name" id="results-winner">Carloz</strong>
        </p>
      </header>

      <div className="results__table-wrapper">
        <table className="results__table">
          <caption className="results__caption">Clasificación Final de Jugadores</caption>
          <thead className="results__thead">
            <tr className="results__row">
              <th scope="col" className="results__th">Posición</th>
              <th scope="col" className="results__th">Jugador</th>
              <th scope="col" className="results__th">Puntos Totales</th>
            </tr>
          </thead>
          <tbody className="results__tbody" id="results-standings-body">
            <tr className="results__row results__row--first">
              <td className="results__td">🥇 1°</td>
              <td className="results__td">Carloz</td>
              <td className="results__td"><strong>80 pts</strong></td>
            </tr>
            <tr className="results__row">
              <td className="results__td">🥈 2°</td>
              <td className="results__td">Ana</td>
              <td className="results__td"><strong>60 pts</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer className="results__footer">
        <button type="button" id="btn-back-to-menu" className="results__button results__button--primary">
          Volver al Menú Principal
        </button>
      </footer>
    </section>
  );
}