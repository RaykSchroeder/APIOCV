import { useState } from 'react';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/equipments?key=${encodeURIComponent(apiKey)}`);

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || `API error ${res.status}`);
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
        <pre className="bg-gray-100 p-2 mt-2 rounded max-h-64 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
