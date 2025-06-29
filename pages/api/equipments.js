export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    const response = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments/monitoring', {
      headers: {
        'X-API-KEY': key,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Upstream API error' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch failed in API route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
