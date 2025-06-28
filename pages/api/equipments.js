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
    const response = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments', {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    console.log('API-Response Status:', response.status);
    if (!response.ok) {
      const errText = await response.text();
      console.log('API-Fehler:', errText);
      res.status(response.status).json({ error: errText });
      return;
    }

    const data = await response.json();
    res.status(200).json({ equipments: data.equipments });
  } catch (error) {
    console.error('Fetch-Fehler:', error);
    res.status(500).json({ error: error.message || 'Fetch error' });
  }
}
