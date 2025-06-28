import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchEquipments = async () => {
    setLoading(true);
    setError(null);
    setEquipments(null);

    try {
      const res = await fetch('/api/equipments', {
        headers: {
          'X-API-KEY': apiKey,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Unbekannter Fehler');
      } else {
        const data = await res.json();
        setEquipments(data);
      }
    } catch (err) {
      setError('Fehler bei der Anfrage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API-Key Eingabe</h1>
      <input
        type="text"
        placeholder="API-Key eingeben"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: '300px', padding: '8px', fontSize: '16px' }}
        autoFocus
      />
      <button
        onClick={handleFetchEquipments}
        disabled={!apiKey || loading}
        style={{ marginLeft: '10px', padding: '8px 16px', fontSize: '16px' }}
      >
        {loading ? 'Lade...' : 'Geräte laden'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>Fehler: {error}</p>}

      {equipments && (
        <div style={{ marginTop: '20px' }}>
          <h2>Gefundene Geräte:</h2>
          <pre style={{ background: '#eee', padding: '10px' }}>
            {JSON.stringify(equipments, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
