import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function EquipmentsMonitoring({ apiKey }) {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    async function fetchEquipments() {
      try {
        const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();

        if (Array.isArray(data)) {
          setEquipments(data);
        } else if (data.equipments && Array.isArray(data.equipments)) {
          setEquipments(data.equipments);
        } else {
          throw new Error('API returned invalid data format');
        }
      } catch (err) {
        console.error('Error fetching equipments:', err);
        setError(err.message);
      }
    }

    fetchEquipments();
  }, [apiKey]);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Fehler: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Equipments</h1>
      <ul className="space-y-2 max-h-96 overflow-y-auto border rounded p-2">
        {(equipments || []).map((eq, idx) => (
          <li
            key={idx}
            className="border p-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedEquipment(eq)}
          >
            {eq.name || "Unbenanntes Equipment"}
          </li>
        ))}
      </ul>
      {selectedEquipment && (
        <Modal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}
    </div>
  );
}
