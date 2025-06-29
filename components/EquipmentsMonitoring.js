import { useState } from 'react';
import Modal from './Modal';

export default function EquipmentsMonitoring({ equipments }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Equipments</h1>
      <ul className="space-y-2 max-h-96 overflow-y-auto border rounded p-2">
        {equipments.map((eq, index) => (
          <li
            key={index}
            onClick={() => setSelected(eq)}
            className="cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            {eq.name || eq.id || 'Unnamed Equipment'}
          </li>
        ))}
      </ul>

      {selected && (
        <Modal onClose={() => setSelected(null)} equipment={selected} />
      )}
    </div>
  );
}
