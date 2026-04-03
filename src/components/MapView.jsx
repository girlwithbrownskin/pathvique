import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { issues } from "../data";
import "leaflet/dist/leaflet.css";

const severityColor = { High: "#f43f5e", Medium: "#f59e0b", Low: "#00e5a0" };

export default function MapView() {
  return (
    <div className="map-wrap">
      <MapContainer center={[13.0827, 80.2707]} zoom={12}
        style={{ height: "100%", width: "100%" }} attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {issues.map(issue => (
          <CircleMarker key={issue.id} center={[issue.lat, issue.lng]} radius={10}
            pathOptions={{
              color: severityColor[issue.severity] || "#7c8a9e",
              fillColor: severityColor[issue.severity] || "#7c8a9e",
              fillOpacity: 0.35, weight: 2,
            }}>
            <Popup>
              <div style={{ fontFamily: "DM Sans,sans-serif", fontSize: 12, minWidth: 130, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: "#e8eaf0", marginBottom: 4 }}>{issue.type}</div>
                <div style={{ color: "#7c8a9e" }}>{issue.area}</div>
                <div style={{
                  marginTop: 6, display: "inline-block", padding: "2px 7px", borderRadius: 4,
                  fontSize: 10, fontWeight: 600,
                  background: issue.severity === "High" ? "rgba(244,63,94,0.15)" : "rgba(245,158,11,0.15)",
                  color: issue.severity === "High" ? "#f43f5e" : "#f59e0b",
                }}>{issue.severity}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}