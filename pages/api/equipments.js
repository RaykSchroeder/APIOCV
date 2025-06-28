export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { apiKey } = req.body;

  if (!apiKey) {
    res.status(400).json({ error: "API-Key fehlt" });
    return;
  }

  try {
    const apiRes = await fetch(
      "https://api-eu.oceaview.com/public/api/v1/equipments",
      {
        headers: {
          "X-API-KEY": apiKey,
          Accept: "application/json",
        },
      }
    );

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      res.status(apiRes.status).json({ error: errorData });
      return;
    }

    const data = await apiRes.json();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: "Server-Fehler", details: err.message });
  }
}
