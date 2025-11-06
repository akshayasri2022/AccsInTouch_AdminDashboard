import React from "react";
import "../styles/CustomerTopbar.css";

export default function CustomerTopbar() {
  return (
    <div className="customer-topbar" role="banner" aria-label="Customer topbar">
      <div className="topbar-left">
        <h1 className="page-title">Customer Management</h1>
      </div>

      <div className="topbar-right" role="navigation" aria-label="Topbar controls">
        {/* Shop selector (matches .shop-selector in CSS) */}
        <button
          type="button"
          className="shop-selector"
          aria-haspopup="listbox"
          aria-label="Switch shop"
        >
          Nik Shop <span className="arrow" aria-hidden="true">▾</span>
        </button>

        {/* Notification button (matches .notif-btn / .notification-btn in CSS) */}
        <button
          type="button"
          className="notif-btn"
          title="Notifications"
          aria-label="Open notifications"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b46b6"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </button>

        {/* Avatar (matches .user-avatar in CSS) */}
        <button
          type="button"
          className="profile-avatar"
          aria-label="Open user menu"
        >
          <img
            src="https://i.pravatar.cc/40?img=56"
            alt="User avatar"
            className="user-avatar"
            width="36"
            height="36"
          />
        </button>
      </div>
    </div>
  );
}
