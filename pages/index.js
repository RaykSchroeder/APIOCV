import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch("https://api-eu.oceaview.com/public/api/v1/equipments/monitoring", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`API error ${response.status}: ${text}`);
        setError(`API error ${response.status}: ${text}`);
        return;
      }

      const json = await response.json();
      setData(json);
      setError('');
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Fetch failed');
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="border rounded p-2 mr-2"
      />
      <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 rounded">
        Abrufen
      </button>

      {error && <div style={{ color: 'red' }} className="mt-2">{error}</div>}
      {data && <pre className="mt-4 bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
