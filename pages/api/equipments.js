// pages/api/equipments.js
export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || ''; // oder aus Umgebungsvariablen
  if (!apiKey) {
    return res.status(401).json({ error: 'API key missing' });
  }

  try {
    const response = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments', {
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
}
