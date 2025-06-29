import React, { useState } from "react";
import Modal from "./Modal";

export default function EquipmentsMonitoring() {
  const [apiKey, setApiKey] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!apiKey) {
      setError("Bitte API-Key eingeben.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/monitoring/equipment/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey })
      });

      if (!response.ok) {
        throw new Error(`Serverfehler: ${response.statusText}`);
      }

      const data = await response.json();
      setEquipments(data.equipment || []);
    } catch (err) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment Monitoring</h1>

      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API-Key"
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`w-full p-2 rounded ${
          loading
            ? "bg-gray-300 text-gray-600"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {loading ? "Lade..." : "Einloggen"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <ul className="mt-4 space-y-2">
        {equipments.map((equip, idx) => (
          <li
            key={idx}
            className="border p-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedEquip(equip)}
          >
            {equip.hostname || `Equipment ${idx + 1}`}
          </li>
        ))}
      </ul>

      <Modal
        isOpen={!!selectedEquip}
        onClose={() => setSelectedEquip(null)}
        title={selectedEquip?.hostname || "Details"}
      >
        <pre className="whitespace-pre-wrap break-words">
          {JSON.stringify(selectedEquip, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}
