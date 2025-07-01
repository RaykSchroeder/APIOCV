import { useState, useEffect } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Filter states
  const [showAlarms, setShowAlarms] = useState(true);
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `API error ${res.status}`);
        setData([]);
        return;
      }

      setData(json);
      setError('');
      setSelectedEquipment(null);
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Fetch failed');
      setData([]);
    }
  };

  // Hilfsfunktion: Prüft, ob Equipment Alarm hat
  const hasAlarm = (eq) =>
    eq.dataLoggings?.some(dl => dl.ongoingAlarms?.length > 0);

  // Hilfsfunktion: Prüft, ob Equipment aktiv ist (nach Zeitstempel)
  const isActive = (eq) => {
    const now = new Date();
    const timestamps = eq.dataLoggings?.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    }) || [];
    if (timestamps.length === 0) return false;
    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffHours = (now - mostRecent) / (1000 * 60 * 60);
    return diffHours < 48; // aktiv wenn letzte Kommunikation < 48h
  };

  // Farbe bestimmen
  const getEquipmentColor = (eq) => {
    if (hasAlarm(eq)) return '#f87171'; // rot
    if (isActive(eq)) return '#a3e635'; // grün
    return '#9ca3af'; // grau
  };

  // Filter-Logik & Sortierung
  const filteredAndSortedData = data
    .filter(eq => {
      if (hasAlarm(eq) && !showAlarms) return false;
      if (isActive(eq) && !hasAlarm(eq) && !showActive) return false;
      if (!isActive(eq) && !hasAlarm(eq) && !showInactive) return false;
      return true;
    })
    .sort((a, b) => {
      // Alarme zuerst, sortiert nach ältestem Alarmstartdatum
      const aAlarm = a.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []).sort((x, y) => new Date(x.startDate) - new Date(y.startDate))[0];
      const bAlarm = b.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []).sort((x, y) => new Date(x.startDate) - new Date(y.startDate))[0];
      if (aAlarm && !bAlarm) return -1;
      if (!aAlarm && bAlarm) return 1;
      if (aAlarm && bAlarm) return new Date(aAlarm.startDate) - new Date(bAlarm.startDate);
      // Dann aktive ohne Alarm
      const aActive = isActive(a);
      const bActive = isActive(b);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0; // inaktive zuletzt
    });

  // Styles
  const styles = {
    container: { maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' },
    input: { width: '100%', padding: 8, fontSize: 16, marginBottom: 12 },
    button: { backgroundColor: '#1DB954', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' },
    error: { color: 'red', marginTop: 10 },
    filters: { display: 'flex', gap: 20, margin: '20px 0', alignItems: 'center' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 12 },
    card: (color) => ({
      backgroundColor: color,
      padding: 12,
      borderRadius: 6,
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 140,
    }),
    cardTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 6, color: '#111' },
    alarmText: { color: '#b91c1c', fontWeight: 'bold', fontSize: 14 },
    topologyText: { fontSize: 14, color: '#444' },
    modalBackdrop: {
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: 'white', borderRadius: 8, padding: 20, maxWidth: 600, maxHeight: '80vh',
      overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
    },
    closeButton: {
      marginTop: 20, backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 4,
      cursor: 'pointer', fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={styles.input}
      />
      <button onClick={fetchData} style={styles.button}>
        Abrufen
      </button>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.filters}>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={showAlarms} onChange={() => setShowAlarms(!showAlarms)} />
          Alarme anzeigen
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={showActive} onChange={() => setShowActive(!showActive)} />
          Aktive anzeigen
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} />
          Inaktive anzeigen
        </label>
      </div>

      <div style={styles.grid}>
        {filteredAndSortedData.map(eq => {
          const color = getEquipmentColor(eq);
          return (
            <div
              key={eq.id}
              onClick={() => setSelectedEquipment(eq)}
              style={styles.card(color)}
              title={eq.name}
            >
              <div style={styles.cardTitle}>{eq.name}</div>
              {hasAlarm(eq) && <div style={styles.alarmText}>⚠️ Alarm aktiv!</div>}
              <div style={styles.topologyText}>Topologie: {eq.topology?.name || '–'}</div>
            </div>
          );
        })}
      </div>

      {selectedEquipment && (
        <div style={styles.modalBackdrop} onClick={() => setSelectedEquipment(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>{selectedEquipment.name}</h2>
            <p><strong>Topologie:</strong> {selectedEquipment.topology?.name || '–'}</p>
            <h3>Data Loggings:</h3>
            <ul>
              {selectedEquipment.dataLoggings?.map(dl => (
                <li key={dl.id} style={{ marginBottom: 10 }}>
                  <strong>{dl.name}</strong> — Letzte Messung: {dl.lastReading?.value} {dl.lastReading?.unit} am {dl.lastReading?.date}<br />
                  Letzte Kommunikation: {dl.dataLogger?.lastCommunicationDate || '–'}
                  {dl.ongoingAlarms?.length > 0 && (
                    <ul style={{ marginLeft: 20, marginTop: 4, color: '#b91c1c' }}>
                      {dl.ongoingAlarms.map(alarm => (
                        <li key={alarm.id}>
                          Alarm Level: {alarm.level}, Typ: {alarm.type}, Start: {alarm.startDate}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <button style={styles.closeButton} onClick={() => setSelectedEquipment(null)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}
