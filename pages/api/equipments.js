export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ message: "API-Key fehlt" });
  }

  try {
    const response = await fetch("https://api-eu.oceaview.com/public/api/v1/equipments", {
      headers: {
        "X-API-KEY": apiKey,
        "Accept": "application/json"
      }
    });
    if (!response.ok) throw new Error("Fehler beim Abrufen der Daten");
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
