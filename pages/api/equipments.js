export default function handler(req, res) {
  const { key } = req.query;

  if (!key || key !== "geheim") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Beispiel-Daten
  const equipments = [
    { name: "Equipment 1", status: "active", details: { type: "sensor", location: "Berlin" } },
    { name: "Equipment 2", status: "inactive", details: { type: "camera", location: "Hamburg" } },
    { name: "Equipment 3", status: "active", details: { type: "motor", location: "Munich" } },
  ];

  res.status(200).json(equipments);
}
