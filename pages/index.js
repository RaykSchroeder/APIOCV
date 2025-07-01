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

  // Style-Funktion analog zu deinem Button-Style vom Beispiel
  const getEquipmentStyle = (eq) => {
    const baseStyle = {
      margin: '0.25rem 0',
      backgroundColor: '#e5e7eb', // default grau für inaktiv
      color: '#000',
      border: 'none',
      padding: '0.75rem 1rem',
      borderRadius: '4px',
      cursor: eq.isActive ? 'pointer' : 'not-allowed',
      boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100px',
      transition: 'background-color 0.3s ease',
      userSelect: 'none',
    };

    if (!eq.isActive) {
      return baseStyle; // grau + disabled cursor
    }

    // Prüfe auf Alarme
    const alarms = eq.monitoringData?.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []) || [];
    if (alarms.length > 0) {
      return { ...baseStyle, backgroundColor: '#fca5a5', color: '#7f1d1d', cursor: 'pointer' }; // rot
    }

    // Prüfe Zeitstempel für aktive Geräte ohne Alarm
    const now = new Date();
    const timestamps = eq.monitoringData?.dataLoggings?.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    }) || [];

    if (timestamps.length === 0) {
      return { ...baseStyle, backgroundColor: '#f87171', color: '#7f1d1d' }; // kritisch rot, falls keine Zeitstempel
    }

    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffHours = (now - mostRecent) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return { ...baseStyle, backgroundColor: '#bbf7d0', color: '#166534' }; // grün
    } else if (diffHours < 48) {
      return { ...baseStyle, backgroundColor: '#fde68a', color: '#92400e' }; // gelb
    } else {
      return { ...baseStyle, backgroundColor: '#fca5a5', color: '#7f1d1d' }; // rot
    }
  };

  // Sortieren wie gewünscht
  const sortedEquipments = data ? [...data] : [];

  sortedEquipments.sort((a, b) => {
    const getOldestAlarmStart = (eq) => {
      const alarms = (eq.monitoringData?.dataLoggings || eq.dataLoggings || [])
        .flatMap(dl => dl.ongoingAlarms || []);
      if (alarms.length === 0) return null;
      return alarms.reduce((oldest, alarm) => {
        const d = new Date(alarm.startDate);
        return (!oldest || d < oldest) ? d : oldest;
      }, null);
    };

    const aAlarmDate = getOldestAlarmStart(a);
    const bAlarmDate = getOldestAlarmStart(b);

    // Equipments mit Alarm zuerst
    if (aAlarmDate && !bAlarmDate) return -1;
    if (!aAlarmDate && bAlarmDate) return 1;

    // Beide mit Alarm, ältester Alarm zuerst
    if (aAlarmDate && bAlarmDate) {
      return aAlarmDate - bAlarmDate;
    }

    // Aktive ohne Alarm kommen vor Inaktive
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;

    // Alphabetisch sonst
    return a.name.localeCompare(b.name);
  });

  return (
    <div style={{ padding: '1rem', maxWidth: '960px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #d1d5db',
          marginBottom: '1rem',
          fontSize: '1rem',
        }}
      />
      <button
        onClick={fetchData}
        style={{
          backgroundColor: '#1DB954',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.25rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          marginBottom: '1rem',
        }}
      >
        Abrufen
      </button>

      {error && (
        <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {data && Array.isArray(data) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {sortedEquipments.map(eq => (
            <button
              key={eq.id}
              onClick={() => eq.isActive && setSelectedEquipment(eq)}
              style={getEquipmentStyle(eq)}
              disabled={!eq.isActive}
              title={eq.isActive ? undefined : 'Inaktiv'}
            >
              <h2 style={{ fontWeight: 600, margin: 0 }}>{eq.name}</h2>

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
          ))}
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
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <h2 style={{ fontWeight: '700', marginBottom: '1rem' }}>
        {selectedEquipment.name}
      </h2>
      <p>
        <strong>Topologie:</strong> {selectedEquipment.topology?.name || '–'}
      </p>

      <h3 style={{ marginTop: '1.5rem', fontWeight: '600' }}>Data Loggings:</h3>
      <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
        {(selectedEquipment.monitoringData?.dataLoggings || selectedEquipment.dataLoggings || []).map(dl => (
          <li key={dl.id} style={{ marginBottom: '1rem' }}>
            <strong>{dl.name}</strong> — Letzte Messung: {dl.lastReading?.value} {dl.lastReading?.unit} am {dl.lastReading?.date}
            <br />
            Letzte Kommunikation: {dl.dataLogger?.lastCommunicationDate || '–'}
            {dl.ongoingAlarms?.length > 0 && (
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem', color: '#b91c1c' }}>
                {dl.ongoingAlarms.map(alarm => (
                  <li key={alarm.id}>
                    Alarm seit {new Date(alarm.startDate).toLocaleString()}: {alarm.message || `${alarm.type} (Level ${alarm.level})`}
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
          marginTop: '1rem',
          backgroundColor: '#1DB954',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
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
