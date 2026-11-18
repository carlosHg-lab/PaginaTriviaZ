// src/components/Practice.jsx
import React from 'react';

export default function Practice() {
  return (
    <section id="view-practice" className="practice" aria-labelledby="practice-heading">
      <header className="practice__header">
        <h2 id="practice-heading" className="practice__title">Práctica de Preguntas Aleatorias</h2>
        <p className="practice__subtitle">
          Filtra por categoría y dificultad para entrenar sin crear una sala.
        </p>
      </header>

      <form className="practice__filters" id="form-practice-filters">
        <div className="practice__field">
          <label htmlFor="filter-category" className="practice__label">Categoría</label>
          <select id="filter-category" name="categoria" className="practice__select" defaultValue="">
            <option value="">Todas las categorías</option>
            <option value="Historia">Historia</option>
          </select>
        </div>

        <div className="practice__field">
          <label htmlFor="filter-difficulty" className="practice__label">Dificultad</label>
          <select id="filter-difficulty" name="dificultad" className="practice__select" defaultValue="">
            <option value="">Cualquiera</option>
            <option value="easy">Fácil (easy)</option>
            <option value="medium">Media (medium)</option>
            <option value="hard">Difícil (hard)</option>
          </select>
        </div>

        <div className="practice__field">
          <label htmlFor="filter-amount" className="practice__label">Cantidad (1-50)</label>
          <input
            type="number"
            id="filter-amount"
            name="cantidad"
            className="practice__input"
            min="1"
            max="50"
            defaultValue="10"
          />
        </div>

        <button type="submit" className="practice__button">
          Cargar Preguntas
        </button>
      </form>

      <article className="practice__card" id="practice-question-card" data-question-id="12">
        <header className="practice__card-header">
          <span className="practice__badge">Historia</span>
          <span className="practice__badge practice__badge--difficulty">easy</span>
        </header>
        <h3 className="practice__question">¿Pregunta aleatoria de entrenamiento?</h3>
        <div className="practice__options">
          <button type="button" className="practice__option" data-answer="Opción A">Opción A</button>
          <button type="button" className="practice__option" data-answer="Opción B">Opción B</button>
          <button type="button" className="practice__option" data-answer="Opción C">Opción C</button>
          <button type="button" className="practice__option" data-answer="Opción D">Opción D</button>
        </div>
      </article>
    </section>
  );
}