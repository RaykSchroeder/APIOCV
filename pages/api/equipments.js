// pages/api/equipments.js

export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(401).json({ error: 'Kein API Key übergeben' });
  }

  try {
    const apiRes = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments/monitoring', {
      headers: {
        'Authorization': `Bearer ${key}`, // API-Key als Bearer-Token
        'Content-Type': 'application/json',
      },
    });

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      return res.status(apiRes.status).json({ error: errorText });
    }

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server Error' });
  }
}
