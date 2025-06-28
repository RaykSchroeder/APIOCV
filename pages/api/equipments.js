import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    console.log('Kein API-Key übergeben');
    res.status(400).json({ error: 'API key missing' });
    return;
  }

  try {
    console.log('API-Key erhalten:', apiKey);

    const response = await fetch('https://api-eu.oceaview.com', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    console.log('API-Response Status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.log('API-Fehler:', errText);
      res.status(response.status).json({ error: errText });
      return;
    }

    const data = await response.json();

    // Transformiere die Daten für das Frontend
    const transformed = (data.equipments || []).map((eq) => ({
      id: eq.id || 'Unbekannt',
      name: eq.name || 'Unbekannt',
      type: eq.type || 'Nicht angegeben',
      sensors: (eq.sensors || []).map((s) => ({
        type: s.type || 'Nicht angegeben',
        values: s.values || {}
      }))
    }));

    res.status(200).json({ equipments: transformed });
  } catch (error) {
    console.error('Fetch-Fehler:', error);
    res.status(500).json({ error: error.message || 'Fetch error' });
  }
}
