import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (!apiKey) return;

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 600000); // 10 Minuten

    return () => clearInterval(intervalId);
  }, [apiKey]);

  const getEquipmentColor = (eq) => {
    const now = new Date();

    const alarms = eq.monitoringData?.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []) || [];
    if (alarms.length > 0) {
      const oldestAlarmStart = Math.min(...alarms.map(alarm => new Date(alarm.startDate).getTime()));
      const diffHours = (now - new Date(oldestAlarmStart)) / (1000 * 60 * 60);
      if (diffHours >= 24) {
        return '#b91c1c'; // Tailwind red-700
      } else {
        return '#fb923c'; // Tailwind orange-400
      }
    }

    const timestamps = eq.monitoringData?.dataLoggings?.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    }) || [];

    if (timestamps.length === 0) {
      return '#9ca3af'; // Tailwind gray-400
    }

    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffMinutes = (now - mostRecent) / (1000 * 60);
    const diffHours = diffMinutes / 60;

    if (diffMinutes < 40) {
      return '#86efac'; // Tailwind green-300
    } else if (diffHours < 24) {
      return '#fb923c'; // Tailwind orange-400
    } else {
      return '#b91c1c'; // Tailwind red-700
    }
  };

  const sortedEquipments = (data || []).slice().sort((a, b) => {
    const getLongestAlarmStart = (eq) => {
      const alarms = eq.monitoringData?.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []) || [];
      if (alarms.length === 0) return null;
      return Math.min(...alarms.map(alarm => new Date(alarm.startDate).getTime()));
    };

    const aAlarmStart = getLongestAlarmStart(a);
    const bAlarmStart = getLongestAlarmStart(b);

    if (aAlarmStart && bAlarmStart) {
      return aAlarmStart - bAlarmStart;
    } else if (aAlarmStart) {
      return -1;
    } else if (bAlarmStart) {
      return 1;
    }

    const getMostRecentTimestamp = (eq) => {
      const timestamps = eq.monitoringData?.dataLoggings?.flatMap(dl => {
        const dates = [];
        if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
        if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
        return dates;
      }) || [];
      if (timestamps.length === 0) return 0;
      return Math.max(...timestamps.map(d => d.getTime()));
    };

    const aTime = getMostRecentTimestamp(a);
    const bTime = getMostRecentTimestamp(b);

    return bTime - aTime;
  });

  return (
    <div style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{
          border: '1px solid #ccc',
          padding: '0.5rem 1rem',
          borderRadius: 6,
          width: '100%',
          marginBottom: '0.75rem',
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
          borderRadius: 6,
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '1rem',
          width: '100%',
          marginBottom: '1rem',
        }}
      >
        Abrufen
      </button>

      {error && <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>{error}</div>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {sortedEquipments.map((eq) => {
          const bgColor = getEquipmentColor(eq);
          const hasAlarm = eq.monitoringData?.dataLoggings?.some(dl => dl.ongoingAlarms?.length > 0);
          return (
            <button
              key={eq.id}
              onClick={() => setSelectedEquipment(eq)}
              style={{
                backgroundColor: bgColor,
                padding: '1rem',
                borderRadius: 8,
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                minHeight: 110,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#111',
              }}
            >
              <h2 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{eq.name}</h2>
              {hasAlarm && (
                <p style={{ color: '#b91c1c', fontWeight: '700', margin: 0 }}>⚠️ Alarm aktiv!</p>
              )}
              <p style={{ marginTop: 'auto', fontSize: '0.875rem', color: '#444' }}>
                Topologie: {eq.topology?.name || '–'}
              </p>
            </button>
          );
        })}
      </div>

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
              {(selectedEquipment.monitoringData?.dataLoggings || []).map(dl => (
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
