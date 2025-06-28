import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEquipments(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/equipments?apiKey=${encodeURIComponent(apiKey)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unbekannter Fehler');
      }

      // Falls data.equipments kein Array ist, versuche ein Array daraus zu machen
      const equipmentArray = Array.isArray(data.equipments)
        ? data.equipments
        : [data.equipments].flat().filter(Boolean);

      setEquipments(equipmentArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>API-Key Eingabe</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: '300px', padding: '8px', fontSize: '16px' }}
        />
        <button
          type="submit"
          style={{ padding: '8px 12px', marginLeft: '10px', fontSize: '16px' }}
        >
          Abfragen
        </button>
      </form>

      {loading && <p>Lade Daten...</p>}

      {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}

      {equipments && (
        <div>
          <h2>Gefundene Geräte:</h2>
          {equipments.length === 0 ? (
            <p>Keine Geräte gefunden.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {equipments.map((eq, idx) => (
                <li key={idx} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <strong>Name:</strong> {eq.name || 'Unbekannt'} <br />
                  <strong>ID:</strong> {eq.id || 'Unbekannt'} <br />
                  <strong>Typ:</strong> {eq.type || 'Nicht angegeben'} <br />
                  {eq.sensors && eq.sensors.length > 0 ? (
                    <div style={{ marginTop: '5px' }}>
                      <strong>Sensoren:</strong>
                      <ul>
                        {eq.sensors.map((sensor, sidx) => (
                          <li key={sidx}>
                            Typ: {sensor.type || 'Nicht angegeben'}<br />
                            Werte:{' '}
                            {sensor.values
                              ? Object.entries(sensor.values)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(', ')
                              : 'Keine'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div><strong>Sensoren:</strong> Keine vorhanden</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
