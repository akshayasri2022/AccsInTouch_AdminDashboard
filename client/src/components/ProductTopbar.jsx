import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/TopbarShared.css";

export default function ProductTopbar() {
  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>ProductManagement</h2>
      </div>

      <div className="topbar-right">
        <span className="acc-text">Acc-in-touch</span>

        <button className="icon-btn" title="Notifications">
          <FiBell />
        </button>

        <img
          src="https://i.pravatar.cc/40?img=3"
          className="avatar-img"
          alt="User"
        />
      </div>
    </header>
  );
}
