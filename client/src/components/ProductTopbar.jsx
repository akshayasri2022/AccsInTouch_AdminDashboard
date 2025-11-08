import React from "react";
import "../styles/ProductTopbar.css";
import { FiBell } from "react-icons/fi";

export default function ProductTopbar() {
  return (
    <header className="product-topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Product</h1>
      </div>

      <div className="topbar-right">
        {/* Replaced dropdown with plain text */}
        <span className="acc-text">Acc-in-touch</span>

        {/* Notification icon */}
        <button className="icon-btn notification-btn">
          <FiBell size={18} />
        </button>

        {/* Profile avatar */}
        <div className="profile-avatar">
          <img
            src="https://i.pravatar.cc/32?img=3"
            alt="User"
            className="avatar-img"
          />
        </div>
      </div>
    </header>
  );
}
