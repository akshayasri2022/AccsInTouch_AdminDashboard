import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartPie, FaBoxOpen, FaClipboardList, FaUsers, FaFileAlt } from "react-icons/fa";
import "../styles/Sidebar.css";

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
        <NavLink
          to="/adminDashboard"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaChartPie /> <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/ProductManagement"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaBoxOpen /> <span>Product Management</span>
        </NavLink>

        <NavLink
          to="/OrderManagement"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaClipboardList /> <span>Order Management</span>
        </NavLink>

        <NavLink
          to="/CustomerManagement"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaUsers /> <span>Customer Management</span>
        </NavLink>

        {/* <NavLink
          to="/reports"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <FaFileAlt /> <span>Reports</span>
        </NavLink> */}
      </nav>
    </aside>
  );
}
