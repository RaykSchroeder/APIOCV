import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    res.status(400).json({ error: 'API key missing' });
    return;
  }

  try {
    const response = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments', {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(response.status).json({ error: errText });
      return;
    }

    const data = await response.json();

    // Rückgabe direkt der Geräte-Liste
    res.status(200).json({ equipments: data });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Fetch error' });
  }
}
