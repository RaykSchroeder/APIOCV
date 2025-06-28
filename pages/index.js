// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Hier kannst du z.B. die API mit apiKey aufrufen oder speichern
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
            <button type="submit" style={{ marginLeft: 10, padding: '8px 16px' }}>
              Senden
            </button>
          </form>
        </>
      ) : (
        <div>
          <h2>API-Key gespeichert:</h2>
          <p>{apiKey}</p>
          <button onClick={() => { setApiKey(''); setSubmitted(false); }}>
            API-Key neu eingeben
          </button>
        </div>
      )}
    </div>
  );
}
