import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import "../styles/TopbarShared.css";

export default function Topbar() {
  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>Dashboard</h2>
      </div>

      <div className="topbar-right">
        <span className="acc-text">Acc-in-touch</span>

        <button className="icon-btn" title="Notifications">
          <FaBell />
        </button>

        <button className="icon-btn" title="User Profile">
          <FaUserCircle />
        </button>
      </div>
    </header>
  );
}
