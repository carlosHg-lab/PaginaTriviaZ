// src/components/AdminPanel.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  obtenerPreguntasAdmin,
  crearPregunta,
  eliminarPregunta
} from '../services/preguntaService';

export default function AdminPanel({
  adminKey = '',
  onAdminKeyChange,
  onError,
  onClearError
}) {
  const [keyInput, setKeyInput] = useState(adminKey);
  const [questions, setQuestions] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filtros del banco de preguntas
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // Estado del formulario para crear pregunta
  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [dificultad, setDificultad] = useState('medium');
  const [opciones, setOpciones] = useState(['', '', '', '']);
  const [correcta, setCorrecta] = useState(0);
  const [creating, setCreating] = useState(false);

  // Refs estables para callbacks externos
  const onAdminKeyChangeRef = useRef(onAdminKeyChange);
  const onErrorRef = useRef(onError);
  const onClearErrorRef = useRef(onClearError);
  useEffect(() => {
    onAdminKeyChangeRef.current = onAdminKeyChange;
    onErrorRef.current = onError;
    onClearErrorRef.current = onClearError;
  }, [onAdminKeyChange, onError, onClearError]);

  // GET /api/preguntas (con cabecera X-Admin-Key y filtros opcionales)
  const loadQuestions = useCallback(async (keyToUse, cat = '', diff = '') => {
    const cleanKey = keyToUse?.trim();
    if (!cleanKey) {
      if (onErrorRef.current) {
        onErrorRef.current('Debes ingresar la clave de administrador (X-Admin-Key).', '401');
      }
      return;
    }

    setLoadingList(true);
    setSuccessMsg('');
    if (onClearErrorRef.current) onClearErrorRef.current();

    try {
      const data = await obtenerPreguntasAdmin(cat.trim(), diff, cleanKey);
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.preguntas)
        ? data.preguntas
        : [];

      setQuestions(lista);
      setConnected(true);
      if (onAdminKeyChangeRef.current) {
        onAdminKeyChangeRef.current(cleanKey);
      }
    } catch (error) {
      setConnected(false);
      setQuestions([]);
      if (onErrorRef.current) {
        onErrorRef.current(error, '401');
      }
    } finally {
      setLoadingList(false);
    }
  }, []);

  // Si ya hay clave guardada en sessionStorage al abrir la pestaña, carga automáticamente
  useEffect(() => {
    if (adminKey?.trim()) {
      setKeyInput(adminKey);
      loadQuestions(adminKey, '', '');
    }
  }, [adminKey, loadQuestions]);

  const handleConnect = () => {
    loadQuestions(keyInput, filterCategory, filterDifficulty);
  };

  const handleKeyDownAuth = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConnect();
    }
  };

  const handleFilter = () => {
    loadQuestions(keyInput || adminKey, filterCategory, filterDifficulty);
  };

  const handleOptionChange = (index, value) => {
    setOpciones((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // POST /api/preguntas
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const activeKey = (keyInput || adminKey).trim();
    if (!activeKey) {
      if (onErrorRef.current) {
        onErrorRef.current('Ingresa tu X-Admin-Key y presiona Conectar antes de guardar.', '401');
      }
      return;
    }

    setCreating(true);
    setSuccessMsg('');
    if (onClearErrorRef.current) onClearErrorRef.current();

    try {
      await crearPregunta(
        {
          texto: texto.trim(),
          opciones: opciones.map((opt) => opt.trim()),
          correcta: Number(correcta),
          categoria: categoria.trim(),
          dificultad
        },
        activeKey
      );

      // Limpiar formulario y refrescar tabla
      setTexto('');
      setOpciones(['', '', '', '']);
      setCorrecta(0);
      await loadQuestions(activeKey, filterCategory, filterDifficulty);
      setSuccessMsg('Pregunta guardada correctamente en el banco.');
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      setCreating(false);
    }
  };

  // DELETE /api/preguntas/{id}
  const handleDelete = async (id) => {
    const activeKey = (keyInput || adminKey).trim();
    if (!activeKey || deletingId !== null) return;

    setDeletingId(id);
    setSuccessMsg('');
    if (onClearErrorRef.current) onClearErrorRef.current();

    try {
      await eliminarPregunta(id, activeKey);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setSuccessMsg(`Pregunta #${id} eliminada.`);
    } catch (error) {
      if (onErrorRef.current) onErrorRef.current(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="view-admin" className="admin" aria-labelledby="admin-heading">
      <header className="admin__header">
        <h2 id="admin-heading" className="admin__title">
          Panel de Administración de Preguntas
        </h2>

        <div className="admin__auth">
          <label htmlFor="admin-api-key" className="admin__label">
            Clave de Administrador (<code>X-Admin-Key</code>):
          </label>
          <input
            type="password"
            id="admin-api-key"
            className="admin__input admin__input--key"
            placeholder="Ingresa TRIVIA_ADMIN_KEY"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={handleKeyDownAuth}
            required
          />
          <button
            type="button"
            id="btn-verify-admin"
            className="admin__button admin__button--auth"
            onClick={handleConnect}
            disabled={loadingList}
          >
            {loadingList
              ? 'Conectando...'
              : connected
              ? 'Recargar Banco'
              : 'Conectar y Cargar'}
          </button>
        </div>
      </header>

      {successMsg && (
        <p
          role="status"
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.14)',
            color: '#059669',
            fontWeight: 600
          }}
        >
          ✔️ {successMsg}
        </p>
      )}

      <div className="admin__grid">
        {/* Formulario de creación (POST /api/preguntas) */}
        <article className="admin__panel admin__panel--create">
          <h3 className="admin__subtitle">Agregar Nueva Pregunta</h3>

          <form
            className="admin__form"
            id="form-admin-create-question"
            onSubmit={handleCreateSubmit}
          >
            <div className="admin__field">
              <label htmlFor="new-q-text" className="admin__label">
                Enunciado de la Pregunta
              </label>
              <textarea
                id="new-q-text"
                name="texto"
                className="admin__textarea"
                rows="3"
                placeholder="Escribe la pregunta aquí..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                required
              />
            </div>

            <div className="admin__row">
              <div className="admin__field">
                <label htmlFor="new-q-category" className="admin__label">
                  Categoría
                </label>
                <input
                  type="text"
                  id="new-q-category"
                  name="categoria"
                  className="admin__input"
                  placeholder="Ej. Historia"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  required
                />
              </div>

              <div className="admin__field">
                <label htmlFor="new-q-difficulty" className="admin__label">
                  Dificultad
                </label>
                <select
                  id="new-q-difficulty"
                  name="dificultad"
                  className="admin__select"
                  value={dificultad}
                  onChange={(e) => setDificultad(e.target.value)}
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
                {opciones.map((valor, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`opcion${index}`}
                    className="admin__input"
                    placeholder={`Índice ${index}: Opción ${index + 1}`}
                    value={valor}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                ))}
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
                value={correcta}
                onChange={(e) => setCorrecta(Number(e.target.value))}
                required
              >
                <option value={0}>0 - Primera opción</option>
                <option value={1}>1 - Segunda opción</option>
                <option value={2}>2 - Tercera opción</option>
                <option value={3}>3 - Cuarta opción</option>
              </select>
            </div>

            <button
              type="submit"
              className="admin__button admin__button--submit"
              disabled={creating}
            >
              {creating ? 'Guardando...' : 'Guardar Pregunta (POST)'}
            </button>
          </form>
        </article>

        {/* Listado y filtrado (GET /api/preguntas y DELETE /api/preguntas/{id}) */}
        <article className="admin__panel admin__panel--list">
          <header className="admin__list-header">
            <h3 className="admin__subtitle">
              Banco de Preguntas {connected ? `(${questions.length})` : ''}
            </h3>

            <div className="admin__filters">
              <input
                type="text"
                id="admin-filter-cat"
                className="admin__input admin__input--sm"
                placeholder="Filtrar categoría"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              />
              <select
                id="admin-filter-diff"
                className="admin__select admin__select--sm"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="">Todas las dificultades</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
              <button
                type="button"
                id="btn-admin-filter"
                className="admin__button admin__button--sm"
                onClick={handleFilter}
                disabled={loadingList}
              >
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
                {!connected ? (
                  <tr className="admin__tr">
                    <td className="admin__td" colSpan="4">
                      Ingresa tu clave <code>TRIVIA_ADMIN_KEY</code> y presiona{' '}
                      <strong>Conectar y Cargar</strong> para ver el banco de preguntas.
                    </td>
                  </tr>
                ) : loadingList ? (
                  <tr className="admin__tr">
                    <td className="admin__td" colSpan="4">
                      Cargando preguntas del servidor...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr className="admin__tr">
                    <td className="admin__td" colSpan="4">
                      No se encontraron preguntas con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  questions.map((q) => {
                    const qText = q.texto ?? q.question ?? '';
                    const qCat = q.categoria ?? q.category ?? 'General';
                    const qDiff = q.dificultad ?? q.difficulty ?? 'medium';
                    const qOpts = q.opciones ?? q.options ?? [];
                    const correctIdx = q.correcta;
                    const correctText =
                      typeof correctIdx === 'number' && qOpts[correctIdx] !== undefined
                        ? qOpts[correctIdx]
                        : '';

                    return (
                      <tr key={q.id} className="admin__tr" data-question-id={q.id}>
                        <td className="admin__td">#{q.id}</td>
                        <td className="admin__td">
                          <span className="admin__tag">{qCat}</span>
                          <small className="admin__diff">{qDiff}</small>
                        </td>
                        <td className="admin__td">
                          <p className="admin__q-text">{qText}</p>
                          <small className="admin__q-answer">
                            Correcta (Índice {correctIdx}):{' '}
                            <strong>{correctText}</strong>
                          </small>
                        </td>
                        <td className="admin__td">
                          <button
                            type="button"
                            className="admin__button admin__button--delete"
                            data-delete-id={q.id}
                            aria-label={`Eliminar pregunta ${q.id}`}
                            disabled={deletingId === q.id}
                            onClick={() => handleDelete(q.id)}
                          >
                            {deletingId === q.id ? 'Eliminando...' : '🗑️ Eliminar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}