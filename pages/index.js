import { useState } from 'react';
import EquipmentsMonitoring from '@/components/EquipmentsMonitoring';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [submittedKey, setSubmittedKey] = useState('');

  function handleSubmit() {
    if (apiKey.trim()) {
      setSubmittedKey(apiKey.trim());
    }
  }

  return (
    <div className="p-4">
      {!submittedKey ? (
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-xl font-bold">Bitte API-Key eingeben</h1>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="API-Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Einloggen
          </button>
        </div>
      ) : (
        <EquipmentsMonitoring apiKey={submittedKey} />
      )}
    </div>
  );
}
