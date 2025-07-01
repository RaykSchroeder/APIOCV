import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `API error ${res.status}`);
        setData(null);
        return;
      }

      setData(json);
      setError('');
      setSelectedEquipment(null);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Fetch failed');
      setData(null);
    }
  };

  // Funktion gibt inline Styles zurück, passend zum Status
  const getEquipmentStyle = (eq) => {
    if (!eq.isActive) {
      return {
        backgroundColor: '#d1d5db', // Tailwind bg-gray-300
        color: '#6b7280',           // Tailwind text-gray-600
        cursor: 'not-allowed',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    }

    // Aktive Equipments mit Alarm prüfen
    const dataLoggings = eq.monitoringData?.dataLoggings || eq.dataLoggings || [];
    const now = new Date();

    const hasAnyAlarm = dataLoggings.some(dl => dl.ongoingAlarms?.length > 0);
    if (hasAnyAlarm) {
      return {
        backgroundColor: '#fca5a5', // Tailwind bg-red-300
        color: '#991b1b',           // Tailwind text-red-800
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    }

    // Zeitstempel für Farbe prüfen
    const timestamps = dataLoggings.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    });

    if (timestamps.length === 0) {
      // Keine Zeitstempel - kritisch (rot)
      return {
        backgroundColor: '#fca5a5',
        color: '#991b1b',
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    }

    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffHours = (now - mostRecent) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return {
        backgroundColor: '#bbf7d0', // Tailwind bg-green-300
        color: '#166534',           // Tailwind text-green-800
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    } else if (diffHours < 48) {
      return {
        backgroundColor: '#fde68a', // Tailwind bg-yellow-300
        color: '#854d0e',           // Tailwind text-yellow-800
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    } else {
      return {
        backgroundColor: '#fca5a5',
        color: '#991b1b',
        cursor: 'pointer',
        border: 'none',
        padding: '1rem',
        borderRadius: '0.5rem',
        width: '100%',
        textAlign: 'left',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '0.5rem',
      };
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '768px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{
          border: '1px solid #ccc',
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          borderRadius: '0.375rem',
        }}
      />
      <button
        onClick={fetchData}
        style={{
          backgroundColor: '#2563eb', // blau
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        Abrufen
      </button>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {data && Array.isArray(data) && (
        <div>
          {data.map(eq => {
            const style = getEquipmentStyle(eq);
            return (
              <button
                key={eq.id}
                onClick={() => eq.isActive && setSelectedEquipment(eq)}
                style={style}
                disabled={!eq.isActive}
                title={eq.isActive ? undefined : 'Inaktiv'}
              >
                <h2 style={{ fontWeight: '600', margin: 0 }}>{eq.name}</h2>

                {eq.isActive && eq.monitoringData?.dataLoggings?.some(dl => dl.ongoingAlarms?.length > 0) && (
                  <p style={{ color: '#b91c1c', fontWeight: '700', marginTop: '0.25rem' }}>⚠️ Alarm aktiv!</p>
                )}

                {!eq.isActive && (
                  <p style={{ fontStyle: 'italic', color: '#6b7280', marginTop: '0.25rem' }}>Inaktiv</p>
                )}

                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Topologie: {eq.topology?.name || '–'}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {selectedEquipment && (
        <div
          onClick={() => setSelectedEquipment(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              maxWidth: '36rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>{selectedEquipment.name}</h2>
            <p>
              <strong>Topologie:</strong> {selectedEquipment.topology?.name || '–'}
            </p>

            <h3 style={{ marginTop: '1rem', fontWeight: '600' }}>Data Loggings:</h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
              {(selectedEquipment.monitoringData?.dataLoggings || selectedEquipment.dataLoggings || []).map((dl) => (
                <li key={dl.id} style={{ marginBottom: '0.5rem' }}>
                  <strong>{dl.name}</strong> — Letzte Messung: {dl.lastReading?.value} {dl.lastReading?.unit} am {dl.lastReading?.date}
                  <br />
                  Letzte Kommunikation: {dl.dataLogger?.lastCommunicationDate || '–'}
                  {dl.ongoingAlarms?.length > 0 && (
                    <ul style={{ listStyleType: 'decimal', paddingLeft: '1rem', marginTop: '0.25rem', color: '#b91c1c' }}>
                      {dl.ongoingAlarms.map((alarm) => (
                        <li key={alarm.id}>
                          Alarm Level: {alarm.level}, Typ: {alarm.type}, Start: {alarm.startDate}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedEquipment(null)}
              style={{
                marginTop: '1.5rem',
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
