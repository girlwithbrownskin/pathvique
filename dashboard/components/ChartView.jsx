import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Tooltip, Filler,
} from "chart.js";
import { getHistory } from "../api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function ChartView({ refresh }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory().then(setHistory);
  }, [refresh]);

  const labels = history.map(h =>
    new Date(h.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );
  const scores = history.map(h => h.disaster_score);

  const data = {
    labels,
    datasets: [{
      data: scores,
      borderColor: "#f43f5e",
      backgroundColor: (ctx) => {
        const c = ctx.chart.ctx;
        const g = c.createLinearGradient(0, 0, 0, 180);
        g.addColorStop(0, "rgba(244,63,94,0.25)");
        g.addColorStop(1, "rgba(244,63,94,0.0)");
        return g;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a2235",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#7c8a9e",
        bodyColor: "#e8eaf0",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: ctx => `  Risk score: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#4a5568",
          font: { size: 10, family: "DM Mono" },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
        border: { color: "rgba(255,255,255,0.07)" },
      },
      y: {
        min: 0, max: 100,
        grid: { color: "rgba(255,255,255,0.04)" },
        ticks: {
          color: "#4a5568",
          font: { size: 10, family: "DM Mono" },
          stepSize: 25,
          callback: v => v,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="chart-wrap">
      <div style={{ position: "relative", height: "180px" }}>
        {history.length > 0
          ? <Line data={data} options={options} />
          : <div className="chart-loading">Loading history…</div>
        }
      </div>
    </div>
  );
}