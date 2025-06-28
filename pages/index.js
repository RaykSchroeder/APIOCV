import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [submittedKey, setSubmittedKey] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedKey(apiKey);
    alert('API-Key eingetragen: ' + apiKey);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>API-Key Eingabe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ padding: 8, fontSize: 16, width: 300 }}
          autoFocus
        />
        <button type="submit" style={{ marginLeft: 10, padding: '8px 16px' }}>
          Absenden
        </button>
      </form>

      {submittedKey && (
        <p style={{ marginTop: 20 }}>Aktuell eingetragener API-Key: {submittedKey}</p>
      )}
    </div>
  );
}
