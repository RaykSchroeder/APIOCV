import { useState } from 'react';
import EquipmentsMonitoring from '@/components/EquipmentsMonitoring';

export default function Home() {
  const [key, setKey] = useState('');
  const [equipments, setEquipments] = useState(null);
  const [error, setError] = useState(null);

  const fetchEquipments = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Unknown error');
      }
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      {!equipments ? (
        <div className="space-y-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter API Key"
            className="border p-2 w-full"
          />
          <button
            onClick={fetchEquipments}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Load Equipments
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ) : (
        <EquipmentsMonitoring equipments={equipments} />
      )}
    </div>
  );
}
