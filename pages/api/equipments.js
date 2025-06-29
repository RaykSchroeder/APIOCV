export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key required' });
  }

  const url = "https://api-eu.oceaview.com/public/api/v1/equipments/monitoring";

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}: ${errorText}`);
      return res.status(response.status).json({ error: `Upstream API error: ${response.status}`, details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Fetch failed:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
