import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartPie, FaBoxOpen, FaClipboardList, FaUsers, FaFileAlt } from "react-icons/fa";
import "../styles/Dashboard.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-top">
        <div className="logo">
          <div className="logo-circle">O</div>
          <span className="logo-text">Logo</span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FaChartPie /> <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/product-management" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FaBoxOpen /> <span>Product Management</span>
        </NavLink>

        <NavLink 
          to="/order-management" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FaClipboardList /> <span>Order Management</span>
        </NavLink>

        <NavLink 
          to="/customer-management" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FaUsers /> <span>Customer Management</span>
        </NavLink>

        <NavLink 
          to="/reports" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <FaFileAlt /> <span>Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
}
