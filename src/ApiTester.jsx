import React, { useState } from 'react';

const ApiTester = () => {
  // Estados para el formulario
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/api/categorias');
  const [headersInput, setHeadersInput] = useState('{\n  "Content-Type": "application/json"\n}');
  const [bodyInput, setBodyInput] = useState('');
  
  // Estados para la respuesta
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'https://carlos-trivia-api.loca.lt';

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // 1. Parsear los headers (convertir texto a objeto)
      let customHeaders = {};
      if (headersInput.trim()) {
        customHeaders = JSON.parse(headersInput);
      }

      // 2. Parsear el body si no está vacío
      let parsedBody = null;
      if (bodyInput.trim() && method !== 'GET' && method !== 'DELETE') {
        parsedBody = JSON.parse(bodyInput);
      }

      // 3. Construir la configuración
      const config = {
        method: method,
        headers: {
/*           "X-Admin-Key": "TuClaveSecreta", */          
        'bypass-tunnel-reminder': 'true', // Siempre incluido
          ...customHeaders,
        },
      };

      if (parsedBody) {
        config.body = JSON.stringify(parsedBody);
      }

      // 4. Hacer la petición
      const res = await fetch(`${BASE_URL}${endpoint}`, config);
      
      // Intentar leer la respuesta (puede que sea 204 No Content y no haya JSON)
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        data = await res.text(); // Para respuestas vacías o texto plano
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🛠️ Cliente API Genérico (Mini-Postman)</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ padding: '8px' }}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
        
        <input 
          type="text" 
          value={endpoint} 
          onChange={(e) => setEndpoint(e.target.value)} 
          placeholder="ej. /api/partidas"
          style={{ flex: 1, padding: '8px' }}
        />
        
        <button 
          onClick={handleSendRequest} 
          disabled={loading}
          style={{ padding: '8px 15px', backgroundColor: loading ? '#ccc' : '#28a745', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Enviando...' : 'Enviar Petición'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold' }}>Headers (JSON):</label>
          <textarea 
            value={headersInput} 
            onChange={(e) => setHeadersInput(e.target.value)}
            rows="4"
            style={{ width: '100%', fontFamily: 'monospace', padding: '8px' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 'bold' }}>Body (JSON) - Solo para POST/PUT:</label>
          <textarea 
            value={bodyInput} 
            onChange={(e) => setBodyInput(e.target.value)}
            rows="4"
            placeholder='ej. {"nombre": "Ana"}'
            style={{ width: '100%', fontFamily: 'monospace', padding: '8px' }}
          />
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Respuesta del Servidor:</h3>
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        color: '#d4d4d4', 
        padding: '15px', 
        borderRadius: '5px',
        minHeight: '150px',
        overflow: 'auto',
        maxHeight: '400px'
      }}>
        {loading && <p style={{ color: '#f1c40f' }}>⏳ Esperando respuesta...</p>}
        {error && <pre style={{ color: '#ff6b6b', whiteSpace: 'pre-wrap' }}>{error}</pre>}
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
        {!loading && !error && !response && <p style={{ color: '#888' }}>Aquí aparecerá el resultado...</p>}
      </div>
    </div>
  );
};

export default ApiTester;