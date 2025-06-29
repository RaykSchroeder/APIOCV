export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key required' });
  }

  console.log(`Proxying to Oceaview with API key: ${key}`);

  try {
    const response = await fetch("https://api-eu.oceaview.com/public/api/v1/equipments/monitoring", {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upstream API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: `Upstream API error: ${response.status}`, details: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Fetch failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
