import { issues } from "../data";
const typeIcons = { Pothole: "◈", Flood: "◉", Construction: "◆" };

export default function IssueTable() {
  return (
    <div className="issue-table-wrap">
      <table className="issue-table">
        <thead>
          <tr><th>ID</th><th>Type</th><th>Area</th><th>Severity</th><th>Status</th></tr>
        </thead>
        <tbody>
          {issues.map(i => (
            <tr key={i.id}>
              <td style={{ fontFamily: "DM Mono", color: "#4a5568" }}>#{String(i.id).padStart(4,"0")}</td>
              <td className="type-cell">
                <span style={{ marginRight: 7, opacity: 0.5, fontSize: 11 }}>{typeIcons[i.type] || "◇"}</span>
                {i.type}
              </td>
              <td>{i.area}</td>
              <td><span className={`severity-pill ${i.severity.toLowerCase()}`}>{i.severity}</span></td>
              <td style={{ fontFamily: "DM Mono", fontSize: 10, color: "#4a5568", letterSpacing: "0.5px" }}>OPEN</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}