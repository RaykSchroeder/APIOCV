// pages/api/equipments.js
export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) {
    return res.status(400).json({ error: 'API key required' });
  }

  const API_BASE_URL = "https://api-eu.oceaview.com";
  const HEADERS = {
    'Authorization': `Bearer ${key}`,
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/public/api/v1/equipments/monitoring`, {
      headers: HEADERS,
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`Upstream API error ${response.status}: ${text}`);
      return res.status(response.status).json({ error: `Upstream API error: ${response.status}`, details: text });
    }

    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
