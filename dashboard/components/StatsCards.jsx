import { issues } from "../data";

const Icon = ({ type }) => {
  if (type === "total") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  );
  if (type === "high") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (type === "zones") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
  if (type === "resolved") return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
  return null;
};

export default function StatsCards() {
  const total = issues.length;
  const high  = issues.filter(i => i.severity === "High").length;
  const zones = [...new Set(issues.map(i => i.area))].length;
  const cards = [
    { label: "Total issues",   value: total, trend: "+2 today",    dir: "up",   icon: "total",    color: "blue"  },
    { label: "High severity",  value: high,  trend: "+1 vs avg",   dir: "up",   icon: "high",     color: "red"   },
    { label: "Zones affected", value: zones, trend: "5 districts", dir: "",     icon: "zones",    color: "amber" },
    { label: "Resolved today", value: 0,     trend: "0 pending",   dir: "down", icon: "resolved", color: "green" },
  ];
  return (
    <div className="stats-row">
      {cards.map(c => (
        <div className="stat-card" key={c.label}>
          <div className="stat-card-top">
            <span className="stat-label">{c.label}</span>
            <span className={`stat-icon ${c.color}`}><Icon type={c.icon} /></span>
          </div>
          <div className="stat-value">{c.value}</div>
          <div className={`stat-trend ${c.dir}`}>{c.trend}</div>
        </div>
      ))}
    </div>
  );
}