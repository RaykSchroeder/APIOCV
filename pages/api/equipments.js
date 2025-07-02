export default async function handler(req, res) {
  const { key } = req.query;

  if (!key) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    // Alle Equipments (inkl. inaktive)
    const allResponse = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments', {
      headers: {
        'X-API-KEY': key,
        'Accept': 'application/json',
      },
    });

    // Nur aktive Equipments
    const activeResponse = await fetch('https://api-eu.oceaview.com/public/api/v1/equipments/monitoring', {
      headers: {
        'X-API-KEY': key,
        'Accept': 'application/json',
      },
    });

    const allData = await allResponse.json();
    const activeData = await activeResponse.json();

    if (!allResponse.ok) {
      return res.status(allResponse.status).json({ error: allData.message || 'Upstream API error (all equipments)' });
    }
    if (!activeResponse.ok) {
      return res.status(activeResponse.status).json({ error: activeData.message || 'Upstream API error (active equipments)' });
    }

    // IDs der aktiven Equipments sammeln
    const activeIds = new Set(activeData.map(eq => eq.id));

    // Alle Equipments anpassen: aktiv (true/false)
    const combined = allData.map(eq => ({
      ...eq,
      isActive: activeIds.has(eq.id),
      // Falls aktiv, ergänze die Monitoring-Daten aus activeData
      monitoringData: activeData.find(aeq => aeq.id === eq.id) || null,
    }));

    return res.status(200).json(combined);
  } catch (error) {
    console.error('Fetch failed in API route:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
