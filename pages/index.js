import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [error, setError] = useState(null);

  async function loadEquipment() {
    setError(null);
    setEquipment(null);

    if (!apiKey) {
      setError("Bitte API-Key eingeben.");
      return;
    }

    try {
      const res = await fetch("/api/equipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(`Fehler: ${err.error?.message || JSON.stringify(err.error)}`);
        return;
      }

      const data = await res.json();
      setEquipment(data.data);
    } catch (e) {
      setError("Fehler beim Laden der Geräte: " + e.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setApiKey(inputKey.trim());
  }

  function handleLogout() {
    setApiKey("");
    setEquipment(null);
    setError(null);
    setInputKey("");
  }

  return (
    <div style={{ padding: 20 }}>
      {!apiKey ? (
        <form onSubmit={handleSubmit}>
          <label>
            API-Key eingeben:{" "}
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              style={{ width: "300px" }}
              required
            />
          </label>
          <button type="submit">Speichern</button>
        </form>
      ) : (
        <>
          <button onClick={handleLogout}>API-Key entfernen</button>
          <button onClick={loadEquipment} style={{ marginLeft: 10 }}>
            Geräte laden
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {equipment && (
            <div style={{ marginTop: 20 }}>
              <h2>Geräte:</h2>
              <pre>{JSON.stringify(equipment, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
