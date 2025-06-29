import { useState } from "react";

export default function EquipmentsMonitoring() {
  const [apiKey, setApiKey] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/public/api/v1/equipments/monitoring", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      if (!res.ok) throw new Error(`Fehler: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setEquipments(data);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
      setIsLoggedIn(false);
      setEquipments([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      {!isLoggedIn ? (
        <div style={{ maxWidth: "400px", margin: "auto" }}>
          <h2>Login mit API-Key</h2>
          <input
            type="password"
            placeholder="API-Key eingeben"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1rem",
            }}
          />
          <button
            onClick={handleLogin}
            disabled={!apiKey || loading}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              cursor: apiKey && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Lade..." : "Einloggen"}
          </button>
          {error && (
            <p style={{ color: "red", marginTop: "1rem" }}>
              Fehler: {error}
            </p>
          )}
        </div>
      ) : (
        <div>
          <h2>Equipments Monitoring</h2>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setApiKey("");
              setEquipments([]);
              setSelectedEquip(null);
            }}
            style={{ marginBottom: "1rem" }}
          >
            Logout
          </button>
          {equipments.length === 0 ? (
            <p>Keine Equipments gefunden.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {equipments.map((equip) => (
                <li
                  key={equip.id}
                  onClick={() => setSelectedEquip(equip)}
                  style={{
                    padding: "0.5rem",
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  <strong>{equip.name}</strong> — Topologie: {equip.topology?.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedEquip && (
        <div
          onClick={() => setSelectedEquip(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3>{selectedEquip.name} - Details</h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontSize: "0.9rem",
                maxHeight: "60vh",
                overflowY: "auto",
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              {JSON.stringify(selectedEquip, null, 2)}
            </pre>
            <button
              onClick={() => setSelectedEquip(null)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
