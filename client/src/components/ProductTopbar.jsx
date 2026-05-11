
import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/TopbarShared.css";

export default function ProductTopbar() {
  // Read logged-in user info from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error getting user from localStorage:", error);
  }

  const avatarUrl = user?.avatar || "https://i.pravatar.cc/40?u=default"; // fallback profile pic

  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>Product Management</h2>
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
