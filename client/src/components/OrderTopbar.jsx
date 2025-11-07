import React from "react";
import "../styles/ProductTopbar.css"; // reuse same style file
import { FiBell } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

export default function OrderTopbar() {
  return (
    <header className="product-topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">Orders</h1>
      </div>

      <div className="topbar-right">
        {/* Store selector */}
        <div className="shop-dropdown">
          <span className="shop-name">Nik Shop</span>
          <IoMdArrowDropdown className="dropdown-icon" />
        </div>

        {/* Notification icon */}
        <button className="icon-btn notification-btn" title="Notifications">
          <FiBell size={18} />
        </button>

        {/* Profile avatar */}
        <div className="profile-avatar">
          <img
            src="https://i.pravatar.cc/32?img=4"
            alt="User avatar"
            className="avatar-img"
          />
        </div>
      </div>
    </header>
  );
}
