import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");

  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      if (!res.ok) throw new Error("Fehler beim Abrufen der Daten");
      const data = await res.json();
      setEquipment(data.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Oceaview Equipment Übersicht</h1>
      <div className="my-4">
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="API Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={fetchEquipments}>
          Lade Geräte
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {equipment.map((eq) => (
        <div key={eq.id} className="border rounded p-2 my-2">
          <h2 className="font-semibold">{eq.name}</h2>
          {eq.sensors && eq.sensors.length > 0 ? (
            eq.sensors.map((s) => (
              <div key={s.id} className="pl-4">
                <p>Sensor: {s.name} ({s.type})</p>
                <p>Einheit: {s.unit}</p>
              </div>
            ))
          ) : (
            <p>Keine Sensoren gefunden.</p>
          )}
        </div>
      ))}
    </div>
  );
}
