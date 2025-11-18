// src/components/CustomerTopbar.jsx
import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/TopbarShared.css";

export default function CustomerTopbar() {
  // 🔹 Read logged-in user from localStorage
  let user = null;
  try {
    const stored = localStorage.getItem("user"); // this should be set after login
    user = stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
  }

  // 🔹 Optional: default avatar if user or user.avatar is missing
  const avatarUrl =
    user?.avatar ||
    "https://i.pravatar.cc/40?u=default"; // put your own default image if you want

  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>Customer Management</h2>
      </div>

      <div className="topbar-right">
        <span className="acc-text">
  Accs In Touch
</span>

        <button className="icon-btn" title="Notifications">
          <FiBell />
        </button>

        <img
          src={avatarUrl}
          className="avatar-img"
          alt={user?.name || "User"}
        />
      </div>
    </header>
  );
}
