import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('API-Key: ' + apiKey);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API-Key Eingabe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="API-Key eingeben"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          autoFocus
          style={{ width: '300px', padding: '8px', fontSize: '16px' }}
        />
      </form>
    </div>
  );
}
