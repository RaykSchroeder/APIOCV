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
          'X-API-KEY': apiKey,
          'Accept': 'application/json'
        }
      });

      const json = await response.json();

      if (!response.ok) {
        console.error(`API error ${response.status}:`, json);
        setError(`API error ${response.status}: ${json.message || 'Unknown error'}`);
        setData(null);
        return;
      }

      setData(json);
      setError('');
    } catch (err) {
      console.error('Fetch failed:', err);
      setError('Fetch failed');
      setData(null);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Abrufen
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {data && (
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
