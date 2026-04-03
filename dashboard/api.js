// Mock responses — replace fetch URLs with real FastAPI endpoints

export async function getCommuteImpact() {
  // Real: fetch('/api/commute-impact').then(r => r.json())
  return {
    estimated_commuters_affected: 84200,
    change_pct: +12,
    peak_zone: "T Nagar",
    last_updated: new Date().toISOString(),
  };
}

export async function getHistory() {
  // Real: fetch('/api/history').then(r => r.json())
  const now = Date.now();
  return Array.from({ length: 36 }, (_, i) => ({
    timestamp: new Date(now - (35 - i) * 2 * 60 * 60 * 1000).toISOString(),
    disaster_score: +(40 + Math.sin(i / 4) * 18 + Math.random() * 10).toFixed(1),
  }));
}

export async function getZoneAdvice(zone) {
  // Real: fetch(`/api/zone-advice/${zone}`).then(r => r.json())
  const mock = {
    Velachery:        { level: "HIGH",   color: "#f43f5e", advice: "Avoid underpass. Flooding risk active. Use Medavakkam bypass.",        eta: "~45 min delay" },
    "T Nagar":        { level: "HIGH",   color: "#f43f5e", advice: "Metro construction blocking Usman Rd. Re-route via Panagal Park.",     eta: "~30 min delay" },
    Adyar:            { level: "MEDIUM", color: "#f59e0b", advice: "Drain overflow reported near bridge. Use 2nd Avenue alternative.",     eta: "~15 min delay" },
    "Chennai Central":{ level: "MEDIUM", color: "#f59e0b", advice: "Road works near Central station exit. Allow extra time.",              eta: "~10 min delay" },
    Ambattur:         { level: "LOW",    color: "#00e5a0", advice: "Minor pothole patches on Industrial Estate Rd. Normal traffic flow.",  eta: "No delay"      },
  };
  return mock[zone] || { level: "LOW", color: "#00e5a0", advice: "No active disruptions.", eta: "No delay" };
}

export async function getLiveUpdates() {
  // Real: fetch('/api/live-updates').then(r => r.json())
  return [
    { id: 1, time: "09:41", text: "Flood alert issued for Velachery underpass — drain capacity at 94%" },
    { id: 2, time: "09:38", text: "Construction crew deployed to T Nagar — Usman Road partially blocked" },
    { id: 3, time: "09:31", text: "Pothole reported at Adyar signal — maintenance team notified" },
    { id: 4, time: "09:24", text: "84,200 commuters affected across 5 active disruption zones" },
    { id: 5, time: "09:17", text: "Ambattur Industrial Estate: road patch work complete, traffic resumed" },
    { id: 6, time: "09:09", text: "Disaster risk score elevated to 72/100 — monitoring escalated" },
    { id: 7, time: "08:55", text: "IMD rainfall forecast: 85mm expected tonight — pre-emptive drain check initiated" },
    { id: 8, time: "08:44", text: "Citizen report: waterlogging near Nungambakkam High Road confirmed by camera feed" },
  ];
}