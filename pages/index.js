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

  const getEquipmentStyle = (eq) => {
    const hasAnyAlarm = eq.dataLoggings?.some(dl => dl.ongoingAlarms?.length > 0);
    if (hasAnyAlarm) {
      return {
        backgroundColor: '#F87171', // rot
        color: 'white',
        padding: '1rem',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        marginBottom: '0.5rem',
      };
    }

    const now = new Date();
    const timestamps = eq.dataLoggings?.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    }) || [];

    if (timestamps.length === 0) {
      return {
        backgroundColor: '#F87171', // rot
        color: 'white',
        padding: '1rem',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        marginBottom: '0.5rem',
      };
    }

    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffHours = (now - mostRecent) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return {
        backgroundColor: '#86EFAC', // grün
        color: 'black',
        padding: '1rem',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        marginBottom: '0.5rem',
      };
    } else if (diffHours < 48) {
      return {
        backgroundColor: '#FDE68A', // gelb
        color: 'black',
        padding: '1rem',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        marginBottom: '0.5rem',
      };
    } else {
      return {
        backgroundColor: '#F87171', // rot
        color: 'white',
        padding: '1rem',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        border: 'none',
        marginBottom: '0.5rem',
      };
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '640px', margin: '0 auto' }}>
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
          fontSize: '1rem',
        }}
      />
      <button
        onClick={fetchData}
        style={{
          backgroundColor: '#2563EB', // blau
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        Abrufen
      </button>

      {error && (
        <div style={{ color: '#DC2626', marginTop: '1rem', fontWeight: '600' }}>
          {error}
        </div>
      )}

      {data && Array.isArray(data) && (
        <div style={{ marginTop: '1rem', maxHeight: '24rem', overflowY: 'auto' }}>
          {data.map(eq => {
            const style = getEquipmentStyle(eq);
            return (
              <button
                key={eq.id}
                onClick={() => setSelectedEquipment(eq)}
                style={style}
                type="button"
              >
                <h2 style={{ fontWeight: '600', margin: 0 }}>{eq.name}</h2>
                {eq.dataLoggings?.some(dl => dl.ongoingAlarms?.length > 0) && (
                  <p style={{ color: '#B91C1C', fontWeight: '700', marginTop: '0.25rem' }}>
                    ⚠️ Alarm aktiv!
                  </p>
                )}
                <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>
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
              maxWidth: '480px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>
              {selectedEquipment.name}
            </h2>
            <p>
              <strong>Topologie:</strong> {selectedEquipment.topology?.name || '–'}
            </p>

            <h3 style={{ marginTop: '1rem', fontWeight: '600' }}>Data Loggings:</h3>
            <ul style={{ marginLeft: '1.5rem' }}>
              {selectedEquipment.dataLoggings?.map((dl) => (
                <li key={dl.id} style={{ marginBottom: '0.5rem' }}>
                  <strong>{dl.name}</strong> — Letzte Messung: {dl.lastReading?.value} {dl.lastReading?.unit} am {dl.lastReading?.date}
                  <br />
                  Letzte Kommunikation: {dl.dataLogger?.lastCommunicationDate || '–'}
                  {dl.ongoingAlarms?.length > 0 && (
                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.25rem', color: '#B91C1C', listStyleType: 'decimal' }}>
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
                backgroundColor: '#DC2626',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
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
