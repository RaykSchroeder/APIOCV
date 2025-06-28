import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState(null);

  async function handleKeySubmit(e) {
    e.preventDefault();
    setError(null);
    setEquipment(null);

    if (!apiKey.trim()) {
      setError("Bitte API-Key eingeben");
      return;
    }

    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(`Fehler: ${err.error?.message || JSON.stringify(err.error)}`);
        return;
      }

      const data = await res.json();
      setEquipment(data.data);
    } catch (err) {
      setError("Fehler beim Laden der Geräte: " + err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={handleKeySubmit}>
        <input
          type="password"
          placeholder="API-Key hier eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: 300, padding: 8 }}
          autoFocus
        />
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {equipment && (
        <pre style={{ marginTop: 20 }}>{JSON.stringify(equipment, null, 2)}</pre>
      )}
    </div>
  );
}
