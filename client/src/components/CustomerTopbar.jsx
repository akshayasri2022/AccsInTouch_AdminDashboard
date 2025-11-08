import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/CustomerTopbar.css";

export default function CustomerTopbar() {
  return (
    <header className="customer-topbar">
      <div className="topbar-left">
        <h2 className="page-title">Customers</h2>
      </div>

      <div className="topbar-right">
        {/* Plain text (not interactive) */}
        <span className="shop-selector">Acc-in-touch</span>

        {/* Notification */}
        <button
          className="notif-btn"
          title="Notifications"
          aria-label="Notifications"
          type="button"
        >
          <FiBell size={18} />
        </button>

        {/* Profile avatar */}
        <img
          className="user-avatar"
          src="https://i.pravatar.cc/40?img=5"
          alt="User"
          title="Profile"
        />
      </div>
    </header>
  );
}
