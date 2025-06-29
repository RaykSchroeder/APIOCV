export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key is missing' });
  }

  const API_BASE_URL = "https://api-eu.oceaview.com";
  const API_PATH = "/public/api/v1/equipments/monitoring";  // Oder /equipments je nach Ziel

  try {
    const response = await fetch(`${API_BASE_URL}${API_PATH}`, {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream API error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
