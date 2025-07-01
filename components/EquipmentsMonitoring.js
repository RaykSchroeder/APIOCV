import React, { useState } from "react";

const equipmentData = [ /* hier kommt dein JSON rein */ ];

function EquipmentList() {
  const [selected, setSelected] = useState(null);

  // Prüfe ob Equipment Alarme hat (mindestens einer ongoingAlarm in dataLoggings)
  const hasAlarm = (equipment) =>
    equipment.dataLoggings.some(dl => dl.ongoingAlarms.length > 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Equipment Übersicht</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {equipmentData.map(eq => (
          <li
            key={eq.id}
            style={{
              margin: "10px 0",
              padding: 10,
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: hasAlarm(eq) ? "#ffdddd" : "#ddffdd"
            }}
            onClick={() => setSelected(eq)}
          >
            <strong>{eq.name}</strong>{" "}
            {hasAlarm(eq) && <span style={{color:"red"}}>⚠️ Alarm!</span>}
            <div style={{ fontSize: 12, color: "#555" }}>
              Topologie: {eq.topology.name}
            </div>
          </li>
        ))}
      </ul>

      {/* Pop-up / Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(1,1,1,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 8,
              maxWidth: "90%",
              maxHeight: "80%",
              overflowY: "auto"
            }}
          >
            <h2>{selected.name}</h2>
            <p><strong>Topologie:</strong> {selected.topology.name}</p>
            <h3>Data Loggings:</h3>
            {selected.dataLoggings.map(dl => (
              <div key={dl.id} style={{ marginBottom: 15, paddingBottom: 10, borderBottom: "1px solid #eee" }}>
                <strong>{dl.name}</strong> ({dl.physicalParameter})<br />
                <em>Letzte Messung:</em> {dl.lastReading.value} {dl.lastReading.unit} am {new Date(dl.lastReading.date).toLocaleString()}<br />
                <em>DataLogger SN:</em> {dl.dataLogger.serialNumber}<br />
                <em>Letzte Kommunikation:</em> {new Date(dl.dataLogger.lastCommunicationDate).toLocaleString()}<br />
                {dl.ongoingAlarms.length > 0 ? (
                  <>
                    <strong style={{color:"red"}}>Aktive Alarme:</strong>
                    <ul>
                      {dl.ongoingAlarms.map(alarm => (
                        <li key={alarm.id}>
                          ID: {alarm.id}, Level: {alarm.level}, Typ: {alarm.type}, Subtyp: {alarm.subType}<br />
                          Gestartet am: {new Date(alarm.startDate).toLocaleString()}<br />
                          Bestätigt: {alarm.isAcknowledged ? "Ja" : "Nein"}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p>Keine aktiven Alarme</p>
                )}
              </div>
            ))}
            <button onClick={() => setSelected(null)}>Schließen</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EquipmentList;
