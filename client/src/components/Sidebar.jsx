import React from "react";
import { FaChartPie, FaBoxOpen, FaClipboardList, FaUsers, FaFileAlt } from "react-icons/fa";
import "../styles/Dashboard.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-circle">O</div>
          <span className="logo-text">Logo</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-item active"><FaChartPie /> <span>Dashboard</span></button>
        <button className="nav-item"><FaBoxOpen /> <span>Product Management</span></button>
        <button className="nav-item"><FaClipboardList /> <span>Order Management</span></button>
        <button className="nav-item"><FaUsers /> <span>Customer Management</span></button>
        <button className="nav-item"><FaFileAlt /> <span>Reports</span></button>
      </nav>
    </aside>
  );
}
