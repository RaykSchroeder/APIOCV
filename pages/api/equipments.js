const getEquipmentColor = (eq) => {
  const now = new Date();
  let worstStatus = 'green';

  // Prüfe Alarme
  const alarms = eq.monitoringData?.dataLoggings?.flatMap(dl => dl.ongoingAlarms || []) || [];
  if (alarms.length > 0) {
    const alarmStartTimes = alarms.map(alarm => toBerlinTime(alarm.startDate).getTime());
    const oldestAlarm = Math.min(...alarmStartTimes);
    const hoursSinceAlarm = (now - new Date(oldestAlarm)) / (1000 * 60 * 60);

    if (hoursSinceAlarm > 24) {
      worstStatus = 'darkred'; // Schlimmster Fall
    } else {
      worstStatus = 'orange'; // Alarm aktiv (≤ 24 h)
    }
  }

  // Prüfe Kommunikation
  const timestamps = eq.monitoringData?.dataLoggings?.flatMap(dl => {
    const dates = [];
    if (dl.lastReading?.date) dates.push(toBerlinTime(dl.lastReading.date));
    if (dl.dataLogger?.lastCommunicationDate) dates.push(toBerlinTime(dl.dataLogger.lastCommunicationDate));
    return dates;
  }) || [];

  if (timestamps.length === 0) {
    return '#9ca3af'; // grau, keine Daten
  }

  const mostRecent = new Date(Math.max(...timestamps.map(d => d.getTime())));
  const diffMinutes = (now - mostRecent) / (1000 * 60);

  if (diffMinutes > 60) {
    worstStatus = 'darkred';
  } else if (diffMinutes > 40) {
    if (worstStatus !== 'darkred' && worstStatus !== 'red') {
      worstStatus = 'red';
    }
  }

  // Farbe nach schlimmstem Status bestimmen
  if (worstStatus === 'darkred') return '#b91c1c';
  if (worstStatus === 'red') return '#f43f5e';
  if (worstStatus === 'orange') return '#f97316';
  return '#86efac';
};
