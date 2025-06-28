import fetch from "node-fetch";

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
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ message: errData.message || "API Fehler" });
    }

    const data = await response.json();

    // Je nach API Struktur hier anpassen,
    // z.B. falls Sensoren in data.sensors o.ä. drin sind
    // Hier nehmen wir einfach an data ist Array der Geräte

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Interner Serverfehler" });
  }
}
