import React, { useState } from 'react';

export default function EquipmentsMonitoring() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEquipments = async () => {
    setError('');
    setEquipments(null);

    if (!apiKey.trim()) {
      setError('Bitte API-Key eingeben');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Fehler beim Laden der Daten');
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEquipments(data);
      setLoading(false);
    } catch (e) {
      setError('Netzwerkfehler');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {!equipments && (
        <>
          <input
            type="text"
            placeholder="API-Key eingeben"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={fetchEquipments}
            className="bg-blue-600 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? 'Lade...' : 'Daten laden'}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {equipments && (
        <div className="mt-4 max-h-[400px] overflow-auto border p-4 rounded bg-gray-50">
          <pre>{JSON.stringify(equipments, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
