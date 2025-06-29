import { useState } from 'react';
import Modal from './Modal';

export default function EquipmentsMonitoring({ equipments }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Equipments</h2>
      <ul className="space-y-2 max-h-96 overflow-y-auto border rounded p-3 bg-gray-50">
        {equipments.map((eq) => (
          <li
            key={eq.id || eq.name}
            onClick={() => setSelected(eq)}
            className="cursor-pointer p-2 bg-white rounded shadow-sm hover:bg-gray-100"
          >
            {eq.name || eq.id || 'Unnamed Equipment'}
          </li>
        ))}
      </ul>

      {selected && <Modal equipment={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
