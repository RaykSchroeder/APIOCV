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
        console.error(`Error: ${json.error}`, json.details || '');
        setError(`Error ${res.status}: ${json.error}`);
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
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="API Key"
        className="border rounded p-2 mr-2"
      />
      <button onClick={fetchData} className="bg-blue-500 text-white px-4 py-2 rounded">
        Abrufen
      </button>

      {error && <div className="text-red-500 mt-2">{error}</div>}
      {data && (
        <pre className="bg-gray-100 p-2 mt-4 rounded">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
