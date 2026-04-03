import { useEffect, useState } from "react";
import { getCommuteImpact } from "../api";

function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

export default function CommuteImpact({ refresh }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    getCommuteImpact().then(setData);
  }, [refresh]);

  const displayed = useCountUp(data?.estimated_commuters_affected ?? 0);

  return (
    <div className="commute-hero">
      <div className="commute-hero-inner">
        <div className="commute-label-row">
          <span className="commute-eyebrow">
            <span className="live-dot" style={{ width: 6, height: 6 }} />
            Live impact
          </span>
          <span className="commute-updated">
            Updated {data ? new Date(data.last_updated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"}
          </span>
        </div>

        <div className="commute-number-row">
          <span className="commute-number">
            {displayed.toLocaleString("en-IN")}
          </span>
          <div className="commute-number-meta">
            <span className="commute-change up">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
              {data?.change_pct ?? 0}% vs yesterday
            </span>
            <span className="commute-desc">commuters affected right now</span>
          </div>
        </div>

        <div className="commute-peak">
          Peak disruption zone:
          <span className="commute-peak-zone">{data?.peak_zone ?? "—"}</span>
        </div>
      </div>

      <div className="commute-hero-glow" />
    </div>
  );
}