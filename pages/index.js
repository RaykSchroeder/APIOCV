import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setEquipments([]);
    setLoading(true);

    try {
      const res = await fetch(`/api/equipments?apiKey=${encodeURIComponent(apiKey)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unbekannter Fehler');
      }

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

  const filteredEquipments = equipments.filter((eq) =>
    eq.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Geräte Abfrage</h1>
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

      {equipments.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Geräte suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
          />
        </div>
      )}

      {loading && <p>Lade Daten...</p>}
      {error && <p style={{ color: 'red' }}>Fehler: {error}</p>}

      {equipments.length > 0 && (
        <div>
          <h2>Gefundene Geräte:</h2>
          {filteredEquipments.length === 0 ? (
            <p>Keine Geräte passend zur Suche.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {filteredEquipments.map((eq, idx) => (
                <li key={idx} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                  <strong>Name:</strong> {eq.name || 'Unbekannt'} <br />
                  <strong>ID:</strong> {eq.id || 'Unbekannt'} <br />
                  <strong>Typ:</strong> {eq.type || 'Nicht angegeben'} <br />
                  <strong>Kritisch:</strong> {eq.critical ? 'Ja' : 'Nein'} <br />
                  <strong>Deaktiviert:</strong> {eq.disabled ? 'Ja' : 'Nein'} <br />
                  <strong>Topologie:</strong> {eq.topology?.name || 'Nicht angegeben'} <br />
                  <strong>Data-Loggings (aktiv):</strong> {eq.dataLoggingsOngoingCount || 0}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
