export default function handler(req, res) {
  const { key } = req.query;

  if (key !== 'dein-geheimer-key') {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  res.status(200).json([
    { name: 'Equipment A', type: 'Sensor', id: 1 },
    { name: 'Equipment B', type: 'Motor', id: 2 }
  ]);
}
