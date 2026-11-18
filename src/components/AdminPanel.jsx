// src/components/AdminPanel.jsx
import React from 'react';

export default function AdminPanel() {
  return (
    <section id="view-admin" className="admin" aria-labelledby="admin-heading">
      <header className="admin__header">
        <h2 id="admin-heading" className="admin__title">Panel de Administración de Preguntas</h2>

        <div className="admin__auth">
          <label htmlFor="admin-api-key" className="admin__label">
            Clave de Administrador (<code>X-Admin-Key</code>):
          </label>
          <input
            type="password"
            id="admin-api-key"
            className="admin__input admin__input--key"
            placeholder="Ingresa TRIVIA_ADMIN_KEY"
            required
          />
          <button type="button" id="btn-verify-admin" className="admin__button admin__button--auth">
            Conectar y Cargar
          </button>
        </div>
      </header>

      <div className="admin__grid">
        <article className="admin__panel admin__panel--create">
          <h3 className="admin__subtitle">Agregar Nueva Pregunta</h3>

          <form className="admin__form" id="form-admin-create-question">
            <div className="admin__field">
              <label htmlFor="new-q-text" className="admin__label">Enunciado de la Pregunta</label>
              <textarea
                id="new-q-text"
                name="texto"
                className="admin__textarea"
                rows="3"
                placeholder="Escribe la pregunta aquí..."
                required
              />
            </div>

            <div className="admin__row">
              <div className="admin__field">
                <label htmlFor="new-q-category" className="admin__label">Categoría</label>
                <input
                  type="text"
                  id="new-q-category"
                  name="categoria"
                  className="admin__input"
                  placeholder="Ej. Historia"
                  required
                />
              </div>

              <div className="admin__field">
                <label htmlFor="new-q-difficulty" className="admin__label">Dificultad</label>
                <select
                  id="new-q-difficulty"
                  name="dificultad"
                  className="admin__select"
                  defaultValue="medium"
                >
                  <option value="easy">Fácil (easy)</option>
                  <option value="medium">Media (medium - Por defecto)</option>
                  <option value="hard">Difícil (hard)</option>
                </select>
              </div>
            </div>

            <fieldset className="admin__fieldset">
              <legend className="admin__legend">Opciones de Respuesta (4 opciones)</legend>
              <div className="admin__options-inputs">
                <input
                  type="text"
                  name="opcion0"
                  className="admin__input"
                  placeholder="Índice 0: Primera opción"
                  required
                />
                <input
                  type="text"
                  name="opcion1"
                  className="admin__input"
                  placeholder="Índice 1: Segunda opción"
                  required
                />
                <input
                  type="text"
                  name="opcion2"
                  className="admin__input"
                  placeholder="Índice 2: Tercera opción"
                  required
                />
                <input
                  type="text"
                  name="opcion3"
                  className="admin__input"
                  placeholder="Índice 3: Cuarta opción"
                  required
                />
              </div>
            </fieldset>

            <div className="admin__field">
              <label htmlFor="new-q-correct" className="admin__label">
                Índice de la Opción Correcta (0 - 3)
              </label>
              <select
                id="new-q-correct"
                name="correcta"
                className="admin__select"
                defaultValue="0"
                required
              >
                <option value="0">0 - Primera opción</option>
                <option value="1">1 - Segunda opción</option>
                <option value="2">2 - Tercera opción</option>
                <option value="3">3 - Cuarta opción</option>
              </select>
            </div>

            <button type="submit" className="admin__button admin__button--submit">
              Guardar Pregunta (POST)
            </button>
          </form>
        </article>

        <article className="admin__panel admin__panel--list">
          <header className="admin__list-header">
            <h3 className="admin__subtitle">Banco de Preguntas</h3>

            <div className="admin__filters">
              <input
                type="text"
                id="admin-filter-cat"
                className="admin__input admin__input--sm"
                placeholder="Filtrar categoría"
              />
              <select
                id="admin-filter-diff"
                className="admin__select admin__select--sm"
                defaultValue=""
              >
                <option value="">Todas las dificultades</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              <button type="button" id="btn-admin-filter" className="admin__button admin__button--sm">
                Filtrar
              </button>
            </div>
          </header>

          <div className="admin__table-container">
            <table className="admin__table">
              <thead className="admin__thead">
                <tr className="admin__tr">
                  <th scope="col" className="admin__th">ID</th>
                  <th scope="col" className="admin__th">Categoría / Dif.</th>
                  <th scope="col" className="admin__th">Pregunta y Respuesta Correcta</th>
                  <th scope="col" className="admin__th">Acción</th>
                </tr>
              </thead>
              <tbody className="admin__tbody" id="admin-questions-tbody">
                <tr className="admin__tr" data-question-id="12">
                  <td className="admin__td">#12</td>
                  <td className="admin__td">
                    <span className="admin__tag">Historia</span>
                    <small className="admin__diff">easy</small>
                  </td>
                  <td className="admin__td">
                    <p className="admin__q-text">¿En qué año llegó Cristóbal Colón a América?</p>
                    <small className="admin__q-answer">
                      Correcta (Índice 0): <strong>1492</strong>
                    </small>
                  </td>
                  <td className="admin__td">
                    <button
                      type="button"
                      className="admin__button admin__button--delete"
                      data-delete-id="12"
                      aria-label="Eliminar pregunta 12"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}