import React from "react";
import "../styles/StatsCard.css";
import { FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
export default function StatsCard({
  title,
  value,
  subtitle,
  topMeta,
  meta = [],
  variant = "orders",
  timeFilter = "all",
  onTimeFilterChange,
}) {
  const iconMap = {
    cart: <FaShoppingCart />,
    customers: <FaUsers />,
    orders: <FaBox />,
  };

  const icon = iconMap[variant] || iconMap.orders;

  const trimmed = (subtitle || "").trim();
  const subtitleClass =
    trimmed.startsWith("-") ? "sub down" : trimmed.startsWith("+") ? "sub up" : "sub neutral";

  // avoid rendering topMeta if same label exists in meta
  const showTopMeta = topMeta && !meta.some((m) => m.label === topMeta);

  // Handle dropdown change with logging
  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    console.log(`StatsCard ${title} - Filter changed to:`, newValue);
    
    if (onTimeFilterChange) {
      onTimeFilterChange(newValue);
    }
  };

  return (
    <div className={`stats-card stats-${variant}`}>
      <div className="stats-top">
        <div className="icon-wrap">{icon}</div>
        <select 
          className="stats-dropdown"
          value={timeFilter}
          onChange={handleFilterChange}
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      <div className="stats-content">
        <div className="title-row">
          <div className={`title ${variant === "cart" ? "title-alert" : ""}`}>{title}</div>
          <div className="title-meta">{showTopMeta ? topMeta : ""}</div>
        </div>

        <div className="main-row">
          <div className="value-block">
            <div className="main-value">{value}</div>
            <div className={subtitleClass}>{subtitle}</div>
          </div>

          {meta && meta.length > 0 && (
            <div className="meta-col">
              {meta.map((m, i) => (
                <div key={i} className="meta-item">
                  <div className="meta-label">{m.label}</div>
                  <div className="meta-value">
                    {m.value}
                    {m.extra && <span className="meta-extra"> {m.extra}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}