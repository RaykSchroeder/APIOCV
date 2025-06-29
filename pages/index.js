import { useState, useEffect } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(false);
  const [error, setError] = useState(null);

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  // Für Sensor-Auswahl bei Readings & Alarme
  const [selectedDataLogging, setSelectedDataLogging] = useState(null);

  // Detail-Daten
  const [equipmentMonitoring, setEquipmentMonitoring] = useState(null);
  const [dataLoggings, setDataLoggings] = useState([]);
  const [readings, setReadings] = useState([]);
  const [alarms, setAlarms] = useState([]);

  // Fehler & Ladezustände Detail
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // --- Equipments laden ---
  const fetchEquipments = async () => {
    setLoadingEquipments(true);
    setError(null);
    setEquipments([]);
    try {
      const res = await fetch(`/api/equipments?apiKey=${encodeURIComponent(apiKey)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Fehler beim Laden der Geräte');
      setEquipments(json.equipments || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingEquipments(false);
    }
  };

  // --- Details laden (je nach Tab) ---
  const fetchDetails = async (equipmentId, tab) => {
    if (!equipmentId) return;
    setLoadingDetails(true);
    setDetailError(null);
    setSelectedDataLogging(null);
    setEquipmentMonitoring(null);
    setDataLoggings([]);
    setReadings([]);
    setAlarms([]);

    try {
      if (tab === 'overview') {
        // Monitoring Daten
        const res = await fetch(`/api/equipmentDetails/monitoring?apiKey=${encodeURIComponent(apiKey)}&equipmentId=${equipmentId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Fehler beim Laden der Monitoring-Daten');
        setEquipmentMonitoring(json.data);
      } else if (tab === 'sensors') {
        // DataLoggings sind Teil vom Monitoring - laden wir Monitoring und zeigen nur sensors
        const res = await fetch(`/api/equipmentDetails/monitoring?apiKey=${encodeURIComponent(apiKey)}&equipmentId=${equipmentId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Fehler beim Laden der Sensor-Daten');
        // sensors kommen aus dataLoggings im Monitoring
        setDataLoggings(json.data?.dataLoggings || []);
      }
      // Readings & Alarms brauchen ausgewählten Sensor/DataLogging
    } catch (e) {
      setDetailError(e.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- Readings laden für DataLogging ---
  const fetchReadings = async (equipmentId, dataLoggingId) => {
    if (!equipmentId || !dataLoggingId) return;
    setLoadingDetails(true);
    setDetailError(null);
    setReadings([]);
    try {
      const res = await fetch(`/api/equipmentDetails/readings?apiKey=${encodeURIComponent(apiKey)}&equipmentId=${equipmentId}&dataLoggingId=${dataLoggingId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Fehler beim Laden der Messwerte');
      setReadings(json.data || []);
    } catch (e) {
      setDetailError(e.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- Alarme laden für DataLogging ---
  const fetchAlarms = async (equipmentId, dataLoggingId) => {
    if (!equipmentId || !dataLoggingId) return;
    setLoadingDetails(true);
    setDetailError(null);
    setAlarms([]);
    try {
      const res = await fetch(`/api/equipmentDetails/alarms?apiKey=${encodeURIComponent(apiKey)}&equipmentId=${equipmentId}&dataLoggingId=${dataLoggingId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Fehler beim Laden der Alarme');
      setAlarms(json.data || []);
    } catch (e) {
      setDetailError(e.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // --- Handler bei Equipment Klick ---
  const onEquipmentClick = (eq) => {
    setSelectedEquipment(eq);
    setSelectedTab(null);
    setSelectedDataLogging(null);
    setEquipmentMonitoring(null);
    setDataLoggings([]);
    setReadings([]);
    setAlarms([]);
  };

  // --- Handler Tab Klick ---
  const onTabClick = (tab) => {
    setSelectedTab(tab);
    setSelectedDataLogging(null);
    setReadings([]);
    setAlarms([]);

    if (selectedEquipment) {
      fetchDetails(selectedEquipment.id, tab);
    }
  };

  // --- Handler DataLogging Auswahl (für readings/alarms) ---
  const onDataLoggingSelect = (dl) => {
    setSelectedDataLogging(dl);
    setReadings([]);
    setAlarms([]);
    if (selectedEquipment && dl) {
      if (selectedTab === 'readings') fetchReadings(selectedEquipment.id, dl.id);
      if (selectedTab === 'alarms') fetchAlarms(selectedEquipment.id, dl.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">API-Key Eingabe</h1>
      <div className="flex mb-6">
        <input
          className="border border-gray-300 rounded px-3 py-2 flex-grow mr-2"
          type="text"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          onClick={fetchEquipments}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          disabled={!apiKey || loadingEquipments}
        >
          Geräte laden
        </button>
      </div>
      {loadingEquipments && <p>Lade Geräte...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loadingEquipments && equipments.length > 0 && (
        <div className="flex">
          <div className="w-1/3 border-r border-gray-300 pr-4">
            <h2 className="font-semibold mb-2">Geräte</h2>
            <ul className="space-y-2 max-h-[600px] overflow-auto">
              {equipments.map((eq) => (
                <li
                  key={eq.id}
                  className={`cursor-pointer p-2 rounded hover:bg-blue-100 ${
                    selectedEquipment?.id === eq.id ? 'bg-blue-200 font-semibold' : ''
                  }`}
                  onClick={() => onEquipmentClick(eq)}
                >
                  {eq.name || 'Unbekannt'} (ID: {eq.id})
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 pl-6">
            {!selectedEquipment && <p>Bitte wähle ein Gerät aus, um Details anzuzeigen.</p>}

            {selectedEquipment && (
              <>
                <h2 className="text-xl font-semibold mb-4">{selectedEquipment.name} - Details</h2>

                <div className="mb-4 space-x-2">
                  <button
                    className={`px-3 py-1 rounded border ${
                      selectedTab === 'overview' ? 'bg-blue-600 text-white' : 'border-gray-400'
                    }`}
                    onClick={() => onTabClick('overview')}
                  >
                    Übersicht
                  </button>
                  <button
                    className={`px-3 py-1 rounded border ${
                      selectedTab === 'sensors' ? 'bg-blue-600 text-white' : 'border-gray-400'
                    }`}
                    onClick={() => onTabClick('sensors')}
                  >
                    Sensoren
                  </button>
                  <button
                    className={`px-3 py-1 rounded border ${
                      selectedTab === 'readings' ? 'bg-blue-600 text-white' : 'border-gray-400'
                    }`}
                    onClick={() => onTabClick('readings')}
                  >
                    Messwerte
                  </button>
                  <button
                    className={`px-3 py-1 rounded border ${
                      selectedTab === 'alarms' ? 'bg-blue-600 text-white' : 'border-gray-400'
                    }`}
                    onClick={() => onTabClick('alarms')}
                  >
                    Alarme
                  </button>
                </div>

                {loadingDetails && <p>Lade Daten...</p>}
                {detailError && <p className="text-red-600">{detailError}</p>}

                {/* Übersicht (Monitoring) */}
                {selectedTab === 'overview' && equipmentMonitoring && (
                  <div>
                    <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded max-h-[400px] overflow-auto">
                      {JSON.stringify(equipmentMonitoring, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Sensoren (DataLoggings) */}
                {selectedTab === 'sensors' && (
                  <div>
                    {dataLoggings.length === 0 ? (
                      <p>Keine Sensoren gefunden.</p>
                    ) : (
                      <ul className="space-y-2 max-h-[400px] overflow-auto border p-2 rounded">
                        {dataLoggings.map((dl) => (
                          <li key={dl.id} className="border-b last:border-b-0 pb-1">
                            <strong>{dl.name || 'Sensor ' + dl.id}</strong> <br />
                            Status: {dl.status} <br />
                            Start: {dl.startDate} <br />
                            Ende: {dl.endDate || '–'} <br />
                            Letzter Messwert Index: {dl.lastReadingIndex} <br />
                            Intervall: {dl.readingInterval} s
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Messwerte */}
                {selectedTab === 'readings' && (
                  <div>
                    <p>Wähle einen Sensor:</p>
                    {dataLoggings.length === 0 && <p>Keine Sensoren verfügbar, bitte zuerst Sensoren laden.</p>}
                    {dataLoggings.length > 0 && (
                      <select
                        className="border border-gray-300 rounded px-2 py-1 mb-2"
                        value={selectedDataLogging?.id || ''}
                        onChange={(e) => {
                          const dl = dataLoggings.find((d) => d.id === e.target.value);
                          onDataLoggingSelect(dl);
                        }}
                      >
                        <option value="">-- Sensor auswählen --</option>
                        {dataLoggings.map((dl) => (
                          <option key={dl.id} value={dl.id}>
                            {dl.name || `Sensor ${dl.id}`}
                          </option>
                        ))}
                      </select>
                    )}

                    {readings.length > 0 && (
                      <ul className="space-y-1 max-h-[300px] overflow-auto border p-2 rounded">
                        {readings.map((r) => (
                          <li key={r.index}>
                            {r.date}: {r.value} {r.unit}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Alarme */}
                {selectedTab === 'alarms' && (
                  <div>
                    <p>Wähle einen Sensor:</p>
                    {dataLoggings.length === 0 && <p>Keine Sensoren verfügbar, bitte zuerst Sensoren laden.</p>}
                    {dataLoggings.length > 0 && (
                      <select
                        className="border border-gray-300 rounded px-2 py-1 mb-2"
                        value={selectedDataLogging?.id || ''}
                        onChange={(e) => {
                          const dl = dataLoggings.find((d) => d.id === e.target.value);
                          onDataLoggingSelect(dl);
                        }}
                      >
                        <option value="">-- Sensor auswählen --</option>
                        {dataLoggings.map((dl) => (
                          <option key={dl.id} value={dl.id}>
                            {dl.name || `Sensor ${dl.id}`}
                          </option>
                        ))}
                      </select>
                    )}

                    {alarms.length > 0 ? (
                      <ul className="space-y-2 max-h-[300px] overflow-auto border p-2 rounded">
                        {alarms.map((alarm) => (
                          <li key={alarm.id} className="border-b last:border-b-0 pb-1">
                            <strong>Typ:</strong> {alarm.alarmTypeDto} / {alarm.alarmSubTypeDto} <br />
                            <strong>Start:</strong> {alarm.startDate} <br />
                            <strong>Ende:</strong> {alarm.endDate || '–'} <br />
                            <strong>Status:</strong> {alarm.isAcknowledged ? 'Bestätigt' : 'Offen'} <br />
                            <strong>Beschreibung:</strong> {alarm.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Keine Alarme gefunden.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
