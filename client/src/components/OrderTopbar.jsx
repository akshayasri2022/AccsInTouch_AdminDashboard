// src/components/OrderTopbar.jsx
import React from "react";
import "../styles/TopbarShared.css"; 
import { FiBell } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

export default function OrderTopbar() {
  // Get logged-in user details from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  const avatarUrl = user?.avatar || "https://i.pravatar.cc/40?u=default"; // fallback

  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>Order Management</h2>
      </div>

      <div className="topbar-right">
        <span className="acc-text">
  Accs In Touch
</span>

        

        <img
          src={avatarUrl}
          className="avatar-img"
          alt={user?.name || "User"}
        />
      </div>
    </header>
  );
}
