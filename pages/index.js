import { useState } from "react";

export default function Home() {
  const [apiKey, setApiKey] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("Dein API-Key ist: " + apiKey);
    // Hier kannst du nach der Eingabe dann API-Aufrufe starten
  }

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: 300, padding: 8 }}
          autoFocus
        />
      </form>
    </div>
  );
}
