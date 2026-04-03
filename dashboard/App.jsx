import { useState, useEffect } from "react";
import StatsCards from "./components/StatsCards";
import MapView from "./components/MapView";
import ChartView from "./components/ChartView";
import IssueTable from "./components/IssueTable";
import AIInsights from "./components/AIInsights";
import CommuteImpact from "./components/CommuteImpact";
import ZoneCards from "./components/ZoneCards";
import LiveTicker from "./components/LiveTicker";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(false);
  const [time, setTime] = useState(new Date());
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    setRefresh(r => !r);
  };

  const fmt = d =>
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fmtDate = d =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">PV</div>
          <div className="header-title-group">
            <h1 className="app-title">Pathvique</h1>
            <span className="app-subtitle">Urban Intelligence Platform</span>
          </div>
        </div>
        <div className="header-center">
          <span className="live-dot" />
          <span className="live-label">Live</span>
          <span className="header-city">Chennai, Tamil Nadu</span>
        </div>
        <div className="header-right">
          <div className="time-block">
            <span className="time-value">{fmt(time)}</span>
            <span className="time-date">{fmtDate(time)}</span>
          </div>
          <button className={`refresh-btn${pulse ? " pulse" : ""}`} onClick={handleRefresh}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 4v6h6M23 20v-6h-6"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
            </svg>
            Sync data
          </button>
        </div>
      </header>

      {/* HERO COMMUTE IMPACT — judges see this first */}
      <CommuteImpact refresh={refresh} />

      <main className="app-main">
        <AIInsights />
        <StatsCards />

        <div className="main-grid">
          <div className="grid-left">
            <section className="panel">
              <div className="panel-header">
                <span className="panel-title">Issue map</span>
                <span className="panel-badge">5 active</span>
              </div>
              <MapView key={refresh} />
            </section>

            <section className="panel">
              <div className="panel-header">
                <span className="panel-title">Disaster risk score — 72h trend</span>
                <span className="panel-badge">rolling window</span>
              </div>
              <ChartView refresh={refresh} />
            </section>
          </div>

          <div className="grid-right">
            <section className="panel">
              <div className="panel-header">
                <span className="panel-title">Zone advisories</span>
                <span className="panel-badge status-red">2 critical</span>
              </div>
              <ZoneCards refresh={refresh} />
            </section>

            <section className="panel">
              <div className="panel-header">
                <span className="panel-title">Active issues</span>
                <span className="panel-badge status-red">3 high</span>
              </div>
              <IssueTable />
            </section>
          </div>
        </div>
      </main>

      {/* LIVE TICKER — pinned at bottom */}
      <LiveTicker refresh={refresh} />

      <footer className="app-footer">
        <span>Pathvique © 2025</span>
        <span className="footer-sep" />
        <span>Camera feeds · Citizen reports · IMD rainfall data</span>
        <span className="footer-sep" />
        <span className="footer-dpdp">DPDP Act 2023 compliant</span>
      </footer>
    </div>
  );
}