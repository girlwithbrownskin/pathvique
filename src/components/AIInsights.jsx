import { issues } from "../data";

export default function AIInsights() {
  const high = issues.filter(i => i.severity === "High").length;
  const isHighRisk = high >= 2;

  return (
    <div className="ai-insights">
      <div className="ai-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
      </div>
      <div className="ai-content">
        <div className="ai-label">AI analysis</div>
        <div className="ai-message">
          {isHighRisk
            ? "Multiple high-severity incidents detected across Chennai. Immediate dispatch recommended for T Nagar and Velachery zones."
            : "City conditions are within normal parameters. No immediate action required."}
        </div>
        <div className="ai-meta">
          Analysed {issues.length} active reports — confidence 94% — updated just now
        </div>
      </div>
      <div className={`ai-risk-badge ${isHighRisk ? "high" : "stable"}`}>
        {isHighRisk ? "HIGH RISK" : "STABLE"}
      </div>
    </div>
  );
}