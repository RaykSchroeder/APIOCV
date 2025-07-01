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

  const getEquipmentColor = (eq) => {
    const now = new Date();

    // Prüfen, ob ein anderer Alarm vorliegt (anders als "kein Alarm")
    const hasAnyAlarm = eq.dataLoggings?.some(dl => dl.ongoingAlarms && dl.ongoingAlarms.length > 0);
    if (hasAnyAlarm) return 'bg-blue-300';

    // Wenn kein Alarm da ist, prüfen wir die Zeitstempel
    const timestamps = eq.dataLoggings?.flatMap(dl => {
      const dates = [];
      if (dl.lastReading?.date) dates.push(new Date(dl.lastReading.date));
      if (dl.dataLogger?.lastCommunicationDate) dates.push(new Date(dl.dataLogger.lastCommunicationDate));
      return dates;
    }) || [];

    if (timestamps.length === 0) {
      // Keine Zeitstempel = rot (kritisch)
      return 'bg-red-300';
    }

    const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
    const diffHours = (now - mostRecent) / (1000 * 60 * 60);

    if (diffHours < 24) {
      // Letzter Zeitstempel < 1 Tag → orange
      return 'bg-orange-300';
    } else {
      // Letzter Zeitstempel > 1 Tag → rot
      return 'bg-red-300';
    }

    // Wenn keine der Bedingungen passt, grün (z.B. kein Alarm und aktuell)
    // Aber in dieser Logik haben wir das bereits abgefangen.
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Abrufen
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      {data && Array.isArray(data) && (
        <div className="mt-4 space-y-2 max-h-64 overflow-auto border p-2 rounded">
          {data.map((eq) => {
            // Farbe bestimmen
            const color = getEquipmentColor(eq);
            return (
              <button
                key={eq.id}
                className={`block w-full text-left px-3 py-2 rounded ${color} hover:opacity-80`}
                onClick={() => setSelectedEquipment(eq)}
              >
                {eq.name}
              </button>
            );
          })}
        </div>
      )}

      {selectedEquipment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedEquipment(null)}
        >
          <div
            className="bg-white p-6 rounded max-w-xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedEquipment.name}</h2>
            <p>
              <strong>Topology:</strong> {selectedEquipment.topology?.name || '–'}
            </p>

            <h3 className="mt-4 font-semibold">Data Loggings:</h3>
            <ul className="list-disc ml-6">
              {selectedEquipment.dataLoggings?.map((dl) => (
                <li key={dl.id} className="mb-2">
                  <strong>{dl.name}</strong> — Letzte Messung: {dl.lastReading?.value} {dl.lastReading?.unit} am {dl.lastReading?.date}
                  <br />
                  Letzte Kommunikation: {dl.dataLogger?.lastCommunicationDate || '–'}
                  {dl.ongoingAlarms?.length > 0 && (
                    <ul className="list-decimal ml-4 mt-1 text-red-600">
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
              className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
