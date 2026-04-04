require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const FLASK_URL = process.env.FLASK_URL || "https://11devanshi.pythonanywhere.com";

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["https://serene-otter-53fff9.netlify.app", "https://69cfd0b69d55f863b2cdb6bf--serene-otter-53fff9.netlify.app","http://localhost:5173","http://localhost:5174","http://127.0.0.1:5173","http://127.0.0.1:5174"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── FILE UPLOAD SETUP ───────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `report-${Date.now()}-${uuidv4().slice(0, 8)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

// Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// ─── IN-MEMORY DATA STORE ─────────────────────────────────────────────────────
let reports = [
  {
    id: uuidv4(), zone: "Velachery", lat: 12.9788, lng: 80.2203,
    description: "Severe flooding near Velachery lake — road completely submerged",
    tag: "flooding", severity: "critical", dept: "Disaster Management",
    status: "open", photo: null, timestamp: new Date(Date.now() - 3600000).toISOString(),
    confidence: 0.95,
  },
  {
    id: uuidv4(), zone: "T. Nagar", lat: 13.0418, lng: 80.2341,
    description: "Large pothole on Usman Road causing traffic jam",
    tag: "pothole", severity: "high", dept: "Highways",
    status: "in-progress", photo: null, timestamp: new Date(Date.now() - 7200000).toISOString(),
    confidence: 0.88,
  },
  {
    id: uuidv4(), zone: "Anna Nagar", lat: 13.0850, lng: 80.2101,
    description: "Road construction blocking main arterial road",
    tag: "construction", severity: "medium", dept: "CMDA",
    status: "open", photo: null, timestamp: new Date(Date.now() - 10800000).toISOString(),
    confidence: 0.91,
  },
  {
    id: uuidv4(), zone: "Adyar", lat: 13.0067, lng: 80.2551,
    description: "Broken street light at Adyar signal",
    tag: "infrastructure", severity: "low", dept: "TANGEDCO",
    status: "resolved", photo: null, timestamp: new Date(Date.now() - 86400000).toISOString(),
    confidence: 0.82,
  },
  {
    id: uuidv4(), zone: "Tambaram", lat: 12.9249, lng: 80.1000,
    description: "Waterlogging near Tambaram station entrance",
    tag: "flooding", severity: "high", dept: "Disaster Management",
    status: "open", photo: null, timestamp: new Date(Date.now() - 1800000).toISOString(),
    confidence: 0.93,
  },
];

// ─── HELPER: KEYWORD FALLBACK TAGGER ─────────────────────────────────────────
function keywordTag(description = "", zone = "") {
  const d = description.toLowerCase();
  const zoneRisk = { velachery: 0.9, tambaram: 0.8, adyar: 0.7, "t. nagar": 0.5, "anna nagar": 0.4 };
  const riskBoost = zoneRisk[zone.toLowerCase()] || 0.3;

  if (d.includes("flood") || d.includes("water") || d.includes("submerge") || d.includes("waterlog")) {
    return { tag: "flooding", severity: riskBoost > 0.7 ? "critical" : "high", dept: "Disaster Management", confidence: 0.75 + riskBoost * 0.1 };
  }
  if (d.includes("pothole") || d.includes("crater") || d.includes("broken road") || d.includes("road damage")) {
    return { tag: "pothole", severity: "medium", dept: "Highways", confidence: 0.80 };
  }
  if (d.includes("construction") || d.includes("digging") || d.includes("excavat") || d.includes("block")) {
    return { tag: "construction", severity: "medium", dept: "CMDA", confidence: 0.78 };
  }
  if (d.includes("light") || d.includes("electric") || d.includes("power") || d.includes("wire")) {
    return { tag: "infrastructure", severity: "medium", dept: "TANGEDCO", confidence: 0.72 };
  }
  if (d.includes("garbage") || d.includes("waste") || d.includes("trash") || d.includes("dump")) {
    return { tag: "sanitation", severity: "low", dept: "GCC Sanitation", confidence: 0.70 };
  }
  if (d.includes("accident") || d.includes("crash") || d.includes("collision")) {
    return { tag: "accident", severity: "high", dept: "Traffic Police", confidence: 0.85 };
  }
  return { tag: "other", severity: "low", dept: "GCC", confidence: 0.50 };
}

// ─── HELPER: PROXY TO FLASK ───────────────────────────────────────────────────
async function tagViaFlask(description, zone) {
  try {
    const res = await fetch(`${FLASK_URL}/api/tag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, zone }),
      timeout: 5000,
    });
    if (!res.ok) throw new Error(`Flask responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[Flask proxy failed — using keyword fallback]: ${err.message}`);
    return keywordTag(description, zone);
  }
}

// ─── HELPER: COMPUTE DISASTER SCORE ──────────────────────────────────────────
function computeDisasterScore() {
  const openReports = reports.filter(r => r.status !== "resolved");
  if (!openReports.length) return { score: 0, level: "safe", color: "green" };

  const weights = { critical: 40, high: 20, medium: 10, low: 3 };
  const raw = openReports.reduce((sum, r) => sum + (weights[r.severity] || 5), 0);
  const score = Math.min(100, Math.round(raw));

  let level = "safe", color = "green";
  if (score >= 70) { level = "critical"; color = "red"; }
  else if (score >= 45) { level = "high"; color = "orange"; }
  else if (score >= 20) { level = "moderate"; color = "yellow"; }

  return { score, level, color, activeIncidents: openReports.length, totalReports: reports.length };
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — DATA (proxy to Flask or return cached)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/roads — proxy Devanshi's Flask
app.get("/api/roads", async (req, res) => {
  try {
    const url = new URL(`${FLASK_URL}/api/roads`);
    if (req.query.status) url.searchParams.set("status", req.query.status);
    const flaskRes = await fetch(url.toString());
    const data = await flaskRes.json();
    res.json(data);
  } catch (err) {
    console.warn("[/api/roads fallback]", err.message);
    // Fallback static data
    res.json([
      { id: 1, name: "GST Road", status: "blocked", lat: 12.9500, lng: 80.1400, reason: "Flooding" },
      { id: 2, name: "Anna Salai", status: "clear", lat: 13.0500, lng: 80.2450, reason: null },
      { id: 3, name: "Velachery Main Road", status: "flooded", lat: 12.9788, lng: 80.2203, reason: "Heavy rain" },
      { id: 4, name: "OMR", status: "clear", lat: 12.9279, lng: 80.2290, reason: null },
      { id: 5, name: "ECR", status: "blocked", lat: 12.8400, lng: 80.2300, reason: "Construction" },
    ].filter(r => !req.query.status || r.status === req.query.status));
  }
});

// GET /api/construction — proxy Flask
app.get("/api/construction", async (req, res) => {
  try {
    const flaskRes = await fetch(`${FLASK_URL}/api/construction`);
    const data = await flaskRes.json();
    res.json(data);
  } catch (err) {
    console.warn("[/api/construction fallback]", err.message);
    res.json([
      { id: 1, location: "Anna Nagar 2nd Avenue", lat: 13.0850, lng: 80.2101, description: "Metro rail construction — lane closed", endDate: "2025-03-31" },
      { id: 2, location: "T. Nagar Bus Terminus", lat: 13.0418, lng: 80.2341, description: "Road widening project", endDate: "2025-02-28" },
      { id: 3, location: "Tambaram-Mudichur Road", lat: 12.9249, lng: 80.1000, description: "Underground cable laying", endDate: "2025-01-15" },
    ]);
  }
});

// GET /api/flood-zones — proxy Flask
app.get("/api/flood-zones", async (req, res) => {
  try {
    const flaskRes = await fetch(`${FLASK_URL}/api/flood-zones`);
    const data = await flaskRes.json();
    res.json(data);
  } catch (err) {
    console.warn("[/api/flood-zones fallback]", err.message);
    res.json([
      { id: 1, area: "Velachery", lat: 12.9788, lng: 80.2203, risk_score: 9.2, color: "red", radius: 700 },
      { id: 2, area: "Tambaram", lat: 12.9249, lng: 80.1000, risk_score: 7.8, color: "orange", radius: 500 },
      { id: 3, area: "Adyar", lat: 13.0067, lng: 80.2551, risk_score: 6.5, color: "orange", radius: 450 },
      { id: 4, area: "Pallikaranai", lat: 12.9384, lng: 80.2135, risk_score: 8.9, color: "red", radius: 600 },
      { id: 5, area: "Anna Nagar", lat: 13.0850, lng: 80.2101, risk_score: 3.1, color: "green", radius: 400 },
      { id: 6, area: "T. Nagar", lat: 13.0418, lng: 80.2341, risk_score: 4.2, color: "yellow", radius: 350 },
    ]);
  }
});

// GET /api/disaster-score
app.get("/api/disaster-score", async (req, res) => {
  try {
    const flaskRes = await fetch(`${FLASK_URL}/api/disaster-score`);
    const data = await flaskRes.json();
    // Augment with our live report score
    const localScore = computeDisasterScore();
    res.json({ ...data, localScore });
  } catch (err) {
    res.json(computeDisasterScore());
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — CITIZEN REPORTS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/reports — all reports (optionally filter by zone/status)
app.get("/api/reports", (req, res) => {
  let result = [...reports];
  if (req.query.zone) result = result.filter(r => r.zone.toLowerCase().includes(req.query.zone.toLowerCase()));
  if (req.query.status) result = result.filter(r => r.status === req.query.status);
  if (req.query.tag) result = result.filter(r => r.tag === req.query.tag);
  // Sort newest first
  result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json(result);
});

// GET /api/reports/analytics — aggregated stats for dashboard charts
app.get("/api/reports/analytics", (req, res) => {
  const byZone = {};
  const byTag = {};
  const byStatus = { open: 0, "in-progress": 0, resolved: 0 };
  const bySeverity = { critical: 0, high: 0, medium: 0, low: 0 };

  for (const r of reports) {
    byZone[r.zone] = (byZone[r.zone] || 0) + 1;
    byTag[r.tag] = (byTag[r.tag] || 0) + 1;
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    bySeverity[r.severity] = (bySeverity[r.severity] || 0) + 1;
  }

  res.json({
    totalReports: reports.length,
    byZone: Object.entries(byZone).map(([zone, count]) => ({ zone, count })),
    byTag: Object.entries(byTag).map(([tag, count]) => ({ tag, count })),
    byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    bySeverity: Object.entries(bySeverity).map(([severity, count]) => ({ severity, count })),
    disasterScore: computeDisasterScore(),
    recentActivity: reports.slice(-5).reverse(),
  });
});

// PATCH /api/reports/:id/status — government updates report status
app.patch("/api/reports/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ["open", "in-progress", "resolved"];
  if (!valid.includes(status)) return res.status(400).json({ error: "Invalid status" });

  const idx = reports.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: "Report not found" });

  reports[idx].status = status;
  reports[idx].updatedAt = new Date().toISOString();
  res.json(reports[idx]);
});

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — AI TAGGING
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/tag — proxy to Flask AI tagger
app.post("/api/tag", async (req, res) => {
  const { description = "", zone = "" } = req.body;
  if (!description) return res.status(400).json({ error: "description is required" });
  const result = await tagViaFlask(description, zone);
  res.json(result);
});

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — UPLOAD REPORT (citizen photo submission)
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/upload-report — accepts multipart/form-data with photo + metadata
app.post("/api/upload-report", upload.single("photo"), async (req, res) => {
  try {
    const { description = "", zone = "", lat, lng } = req.body;
    if (!description) return res.status(400).json({ error: "description is required" });

    // 1. Tag via Flask (or fallback)
    const tagResult = await tagViaFlask(description, zone);

    // 2. Build photo URL if uploaded
    let photoUrl = null;
    if (req.file) {
      photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    // 3. Also try to forward to Flask's upload endpoint
    let flaskUploadResult = null;
    try {
      const flaskRes = await fetch(`${FLASK_URL}/api/upload-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, zone, lat, lng, tag: tagResult }),
      });
      flaskUploadResult = await flaskRes.json();
    } catch (e) {
      console.warn("[Flask upload-report proxy failed — storing locally]");
    }

    // 4. Store in memory
    const newReport = {
      id: uuidv4(),
      zone: zone || "Unknown",
      lat: parseFloat(lat) || 13.0827,
      lng: parseFloat(lng) || 80.2707,
      description,
      tag: tagResult.tag,
      severity: tagResult.severity,
      dept: tagResult.dept,
      confidence: tagResult.confidence,
      status: "open",
      photo: photoUrl,
      timestamp: new Date().toISOString(),
      flaskId: flaskUploadResult?.id || null,
    };
    reports.push(newReport);

    res.status(201).json({
      success: true,
      report: newReport,
      message: `Reported tagged as "${tagResult.tag}" and forwarded to ${tagResult.dept}`,
    });
  } catch (err) {
    console.error("[upload-report error]", err);
    res.status(500).json({ error: "Failed to process report" });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — CHATBOT
// ══════════════════════════════════════════════════════════════════════════════

// POST /api/chat — forward to Flask /api/chat or answer from local data
app.post("/api/chat", async (req, res) => {
  const { message = "", history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "message is required" });

  // Try Flask first
  try {
    const flaskRes = await fetch(`${FLASK_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      timeout: 8000,
    });
    if (flaskRes.ok) {
      const data = await flaskRes.json();
      return res.json(data);
    }
  } catch (err) {
    console.warn("[Flask /api/chat failed — using local chatbot]", err.message);
  }

  // Local chatbot fallback — answers from in-memory data
  const reply = localChatbot(message);
  res.json({ reply, source: "local" });
});

function localChatbot(message) {
  const m = message.toLowerCase();

  // Zone-specific queries
  const zones = [
    { name: "velachery", lat: 12.9788, lng: 80.2203, riskScore: 9.2 },
    { name: "tambaram", lat: 12.9249, lng: 80.1000, riskScore: 7.8 },
    { name: "adyar", lat: 13.0067, lng: 80.2551, riskScore: 6.5 },
    { name: "t. nagar", lat: 13.0418, lng: 80.2341, riskScore: 4.2 },
    { name: "anna nagar", lat: 13.0850, lng: 80.2101, riskScore: 3.1 },
    { name: "pallikaranai", lat: 12.9384, lng: 80.2135, riskScore: 8.9 },
  ];

  for (const zone of zones) {
    if (m.includes(zone.name)) {
      const zoneReports = reports.filter(r => r.zone.toLowerCase().includes(zone.name) && r.status !== "resolved");
      const safeWord = zone.riskScore > 7 ? "⚠️ NOT SAFE" : zone.riskScore > 4 ? "⚠️ USE CAUTION" : "✅ SAFE";
      const issues = zoneReports.map(r => `• ${r.tag} (${r.severity})`).join("\n") || "• No active reports";
      return `${safeWord} — ${zone.name.charAt(0).toUpperCase() + zone.name.slice(1)}\n\nFlood risk score: ${zone.riskScore}/10\nActive issues:\n${issues}\n\n${zone.riskScore > 7 ? "Avoid this area. Use alternative routes." : zone.riskScore > 4 ? "Proceed with caution. Watch for waterlogging." : "Area is clear. Normal travel expected."}`;
    }
  }

  const score = computeDisasterScore();
  if (m.includes("safe") || m.includes("drive") || m.includes("travel") || m.includes("road")) {
    return `Current city disaster score: ${score.score}/100 (${score.level.toUpperCase()})\n\n${score.activeIncidents} active incidents across Chennai.\n\nMost affected: Velachery, Pallikaranai, Tambaram.\nSafer areas: Anna Nagar, T. Nagar.\n\nAsk me about a specific area for detailed info!`;
  }
  if (m.includes("flood")) {
    const floods = reports.filter(r => r.tag === "flooding" && r.status !== "resolved");
    return `🌊 Active flooding reports: ${floods.length}\n\n${floods.map(f => `• ${f.zone}: ${f.description}`).join("\n") || "No active floods."}\n\nAvoid low-lying areas. Velachery and Pallikaranai are high risk.`;
  }
  if (m.includes("pothole")) {
    const potholes = reports.filter(r => r.tag === "pothole" && r.status !== "resolved");
    return `🕳️ Active pothole reports: ${potholes.length}\n\n${potholes.map(p => `• ${p.zone}: ${p.description}`).join("\n") || "No major potholes reported."}`;
  }
  if (m.includes("score") || m.includes("disaster")) {
    return `📊 City Disaster Score: ${score.score}/100\nLevel: ${score.level.toUpperCase()}\nActive incidents: ${score.activeIncidents}\n\n${score.score > 70 ? "⚠️ Critical situation. Avoid non-essential travel." : score.score > 45 ? "⚠️ Elevated risk. Stay updated." : "✅ City is relatively safe right now."}`;
  }
  if (m.includes("report") || m.includes("problem") || m.includes("issue")) {
    return "To report an issue, tap the 📸 Report button on the map! You can upload a photo and we'll automatically tag it and route it to the right department. Your report shows up live on the government dashboard.";
  }
  if (m.includes("hello") || m.includes("hi") || m.includes("hey")) {
    return `👋 Hello! I'm पथVique's city assistant.\n\nAsk me things like:\n• "Is Velachery safe to drive?"\n• "Any flooding near Adyar?"\n• "What's the disaster score today?"\n• "Show me pothole reports"`;
  }

  return `I can help you with:\n• Road safety by area ("Is T. Nagar safe?")\n• Flood zone status\n• Active potholes & construction\n• City disaster score\n\nTry asking: "Is Velachery safe right now?"`;
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTES — SMART ROUTE (proxy Flask)
// ══════════════════════════════════════════════════════════════════════════════

app.post("/api/smart-route", async (req, res) => {
  try {
    const flaskRes = await fetch(`${FLASK_URL}/api/smart-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      timeout: 8000,
    });
    if (flaskRes.ok) {
      const data = await flaskRes.json();
      return res.json(data);
    }
    throw new Error("Flask smart-route failed");
  } catch (err) {
    res.json({ message: "Smart routing unavailable — Flask offline", fallback: true });
  }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "पथVique backend",
    flaskUrl: FLASK_URL,
    reports: reports.length,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛣️  पथVique Backend running on http://localhost:${PORT}`);
  console.log(`   Flask AI: ${FLASK_URL}`);
  console.log(`   Endpoints ready:\n`);
  const routes = [
    "GET  /api/health", "GET  /api/roads", "GET  /api/construction",
    "GET  /api/flood-zones", "GET  /api/disaster-score",
    "GET  /api/reports", "GET  /api/reports/analytics",
    "PATCH /api/reports/:id/status",
    "POST /api/tag", "POST /api/upload-report", "POST /api/chat", "POST /api/smart-route",
  ];
  routes.forEach(r => console.log(`   ${r}`));
  console.log("\n");
});
