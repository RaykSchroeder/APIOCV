import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEquipments = async () => {
    if (!apiKey) {
      setError("Bitte API-Key eingeben");
      return;
    }
    setLoading(true);
    setError("");
    setEquipment([]);
    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      if (!res.ok) throw new Error("API-Fehler");
      const data = await res.json();
      setEquipment(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Oceaview Dashboard</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="API-Key eingeben"
          className="border p-2 mr-2"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2"
          onClick={fetchEquipments}
        >
          Geräte laden
        </button>
      </div>

      {loading && <p>Lade Daten...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {equipment.map((eq) => (
        <div key={eq.id} className="border p-2 rounded mb-2">
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
