import React, { useState, useEffect } from "react";
import Modal from "./Modal";

export default function EquipmentsMonitoring() {
  const [key, setKey] = useState("");
  const [enteredKey, setEnteredKey] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const handleLogin = async () => {
    if (!key) return;
    setEnteredKey(key);
  };

  useEffect(() => {
    if (enteredKey) {
      fetch(`/api/equipments?key=${enteredKey}`)
        .then((res) => res.json())
        .then((data) => setEquipments(data))
        .catch((err) => console.error("Error loading equipments", err));
    }
  }, [enteredKey]);

  return (
    <div className="p-4">
      {!enteredKey ? (
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter API Key"
            className="border p-2 rounded w-full max-w-sm"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Equipments</h2>
          <ul className="space-y-2">
            {equipments.map((eq, idx) => (
              <li
                key={idx}
                className="border p-2 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedEquipment(eq)}
              >
                {eq.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedEquipment && (
        <Modal equipment={selectedEquipment} onClose={() => setSelectedEquipment(null)} />
      )}
    </div>
  );
}
