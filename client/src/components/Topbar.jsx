import React from "react";
import { FiBell } from "react-icons/fi";
import "../styles/TopbarShared.css";

export default function Topbar() {
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }

  const avatar = user?.avatar || "https://i.pravatar.cc/40?u=default";

  return (
    <header className="shared-topbar">
      <div className="topbar-left">
        <h2>Dashboard</h2>
      </div>

      <div className="topbar-right">
        <span className="acc-text">
  Accs In Touch
</span>

        

        <img
          src={avatar}
          className="avatar-img"
          alt={user?.name || "User"}
        />
      </div>
    </header>
  );
}
