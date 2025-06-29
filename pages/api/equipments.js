export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key required' });
  }

  const API_BASE_URL = "https://api-eu.oceaview.com";

  try {
    const response = await fetch(`${API_BASE_URL}/public/api/v1/equipments/monitoring`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });

    const text = await response.text();

    if (!response.ok) {
      console.error(`Upstream API error ${response.status}: ${text}`);
      return res.status(response.status).json({
        error: `Upstream API error: ${response.status}`,
        details: text
      });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (error) {
    console.error('Fetch failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
