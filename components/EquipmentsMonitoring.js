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
          throw new Error(`API Fehler: ${res.status}`);
        }
        const data = await res.json();

        if (Array.isArray(data)) {
          setEquipments(data);
        } else if (data.equipments && Array.isArray(data.equipments)) {
          setEquipments(data.equipments);
        } else {
          throw new Error('Ungültiges Datenformat von API');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchEquipments();
  }, [apiKey]);

  if (error) {
    return <div className="text-red-600 p-4">Fehler: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Equipments</h2>
      <ul className="max-h-96 overflow-y-auto border rounded p-2 space-y-1">
        {equipments.map((eq, idx) => (
          <li
            key={idx}
            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => setSelectedEquipment(eq)}
          >
            {eq.name || 'Unbenanntes Equipment'}
          </li>
        ))}
      </ul>

      {selectedEquipment && (
        <Modal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}
    </div>
  );
}
