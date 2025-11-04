import React from "react";
import "../styles/Dashboard.css";

export default function StatsCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-left">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-right small-muted">{subtitle}</div>
    </div>
  );
}
