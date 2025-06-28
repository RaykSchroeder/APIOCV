import fetch from 'node-fetch';

export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    res.status(400).json({ error: 'API key missing' });
    return;
  }

  try {
    const response = await fetch('https://deine-api-url/equipments', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    const data = await response.json();

    // Beispiel: Daten strukturieren
    const enrichedData = data.equipments.map(equipment => ({
      id: equipment.id,
      name: equipment.name,
      sensors: equipment.sensors.map(sensor => ({
        id: sensor.id,
        type: sensor.type,
        values: sensor.values,
        lastUpdated: sensor.lastUpdated
      }))
    }));

    res.status(200).json({ equipments: enrichedData });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Fetch error' });
  }
}
