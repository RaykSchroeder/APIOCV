import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/equipments?apiKey=${encodeURIComponent(apiKey)}`);
      if (!res.ok) throw new Error('API-Request fehlgeschlagen');
      const data = await res.json();
      setEquipments(data.equipments);
    } catch (err) {
      setError(err.message);
      setEquipments(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API-Key Eingabe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoFocus
          style={{ width: '300px', padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '8px 16px' }}>
          Abfragen
        </button>
      </form>

      {loading && <p>Lade Daten...</p>}
      {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}

      {equipments && (
        <div style={{ marginTop: '20px' }}>
          <h2>Geräte & Sensoren</h2>
          {equipments.length === 0 && <p>Keine Geräte gefunden.</p>}
          {equipments.map((equipment) => (
            <div key={equipment.id} style={{ border: '1px solid #ccc', marginBottom: '15px', padding: '10px' }}>
              <h3>{equipment.name}</h3>
              {equipment.sensors.length === 0 && <p>Keine Sensoren angeschlossen.</p>}
              {equipment.sensors.map((sensor) => (
                <div key={sensor.id} style={{ marginBottom: '10px' }}>
                  <strong>Sensor Typ:</strong> {sensor.type} <br />
                  <strong>Letzte Aktualisierung:</strong> {sensor.lastUpdated} <br />
                  <strong>Werte:</strong>
                  <ul>
                    {Object.entries(sensor.values).map(([key, val]) => (
                      <li key={key}>{key}: {val}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
