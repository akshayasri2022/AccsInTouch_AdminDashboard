import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaBoxOpen, FaClipboardList, FaUsers, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "../styles/Sidebar.css";
import LOGO from "../assets/LOGO.png";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Call the logout API
      await axios.post(
        'https://acc-in-touch-1.onrender.com/api/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Clear all authentication data
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      
      // Redirect to login page
      navigate('/');
      
    } catch (error) {
      console.error('Logout Error:', error);
      
      // Even if API call fails, clear local storage and redirect
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      
      navigate('/');
      
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <div className="logo-circle">
                            <img src={LOGO} alt="Accs In-Touch Logo" className="logo-img" />

            </div>
            <span className="logo-text">Accs In-Touch</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-links">
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
          </div>

          <button 
            onClick={handleLogoutClick} 
            className="nav-item logout-btn"
            disabled={isLoggingOut}
          >
            <FaSignOutAlt /> 
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleLogoutCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-message">Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel-btn" 
                onClick={handleLogoutCancel}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button 
                className="modal-btn confirm-btn" 
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}