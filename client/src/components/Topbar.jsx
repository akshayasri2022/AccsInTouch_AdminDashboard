import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../styles/Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="page-title">Dashboard</h2>
      </div>

      <div className="topbar-right">
        {/* ✅ Replaced dropdown with plain text */}
        <span className="acc-text">Acc-in-touch</span>

        <button className="icon-btn" title="Notifications">
          <FaBell />
        </button>

        <button className="avatar-btn" title="User">
          <FaUserCircle />
        </button>
      </div>
    </header>
  );
}
