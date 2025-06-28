import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        throw new Error(err.message || "Fehler bei der API-Abfrage");
      }

      const result = await res.json();
      setData(result);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!submitted ? (
        <>
          <h1>API-Key Eingabe</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="API-Key eingeben"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoFocus
              style={{ width: 300, padding: 8, fontSize: 16 }}
              required
            />
            <button type="submit" style={{ marginLeft: 10, padding: "8px 16px" }}>
              Senden
            </button>
          </form>
          {loading && <p>Lade Daten...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      ) : (
        <div>
          <h2>Sensoren / Geräte</h2>
          {data && data.length === 0 && <p>Keine Geräte gefunden.</p>}
          {data && data.length > 0 && (
            <ul>
              {data.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>: {item.description || "Keine Beschreibung"}
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={() => {
              setApiKey("");
              setSubmitted(false);
              setData(null);
              setError("");
            }}
            style={{ marginTop: 20, padding: "8px 16px" }}
          >
            API-Key neu eingeben
          </button>
        </div>
      )}
    </div>
  );
}
