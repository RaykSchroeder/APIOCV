import { useState } from 'react';
import EquipmentsMonitoring from '../components/EquipmentsMonitoring';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState('');

  const fetchEquipments = async () => {
    if (!apiKey) {
      setError('Bitte API Key eingeben');
      return;
    }
    setError('');
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || `Fehler: ${res.status}`);
        setEquipments(null);
        return;
      }
      const data = await res.json();
      setEquipments(data);
    } catch (e) {
      setError('Netzwerkfehler');
      setEquipments(null);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Equipment Monitoring</h1>

      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-2"
      />
      <button
        onClick={fetchEquipments}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Abrufen
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {equipments && <EquipmentsMonitoring equipments={equipments} />}
    </div>
  );
}
