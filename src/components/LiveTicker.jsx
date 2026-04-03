import { useEffect, useState, useRef } from "react";
import { getLiveUpdates } from "../api";

export default function LiveTicker({ refresh }) {
  const [items, setItems] = useState([]);
  const trackRef = useRef(null);

  useEffect(() => {
    getLiveUpdates().then(setItems);
  }, [refresh]);

  // duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div className="ticker-bar">
      <div className="ticker-tag">
        <span className="live-dot" style={{ width: 6, height: 6 }} />
        Updates
      </div>
      <div className="ticker-window">
        <div className="ticker-track" ref={trackRef} style={{ "--count": items.length }}>
          {all.map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-time">{item.time}</span>
              {item.text}
              <span className="ticker-sep">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}