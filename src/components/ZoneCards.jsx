import { useEffect, useState } from "react";
import { getZoneAdvice } from "../api";

const ZONES = ["Velachery", "T Nagar", "Adyar", "Chennai Central", "Ambattur"];

export default function ZoneCards({ refresh }) {
  const [data, setData] = useState({});

  useEffect(() => {
    Promise.all(ZONES.map(z => getZoneAdvice(z).then(d => [z, d])))
      .then(pairs => setData(Object.fromEntries(pairs)));
  }, [refresh]);

  return (
    <div className="zone-list">
      {ZONES.map(zone => {
        const d = data[zone];
        if (!d) return (
          <div className="zone-card loading" key={zone}>
            <div className="zone-skeleton" />
          </div>
        );
        return (
          <div className="zone-card" key={zone} style={{ "--zone-color": d.color }}>
            <div className="zone-card-top">
              <div className="zone-left">
                <span className="zone-dot" />
                <span className="zone-name">{zone}</span>
              </div>
              <span className="zone-level">{d.level}</span>
            </div>
            <p className="zone-advice">{d.advice}</p>
            <div className="zone-eta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              {d.eta}
            </div>
          </div>
        );
      })}
    </div>
  );
}