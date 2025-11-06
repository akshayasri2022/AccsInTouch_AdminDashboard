// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaDownload, FaFilter, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import ProductTopbar from "../components/ProductTopbar"; // <-- product-specific topbar
import ProductTable from "../components/ProductTable";
import AddProductForm from "./AddProductForm";
import "../styles/Product.css";

export default function ProductManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("all");
  const [globalSearch, setGlobalSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  // Show add form when URL is /ProductManagement/add
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setShowAddForm(location.pathname === "/ProductManagement/add");
  }, [location.pathname]);

  function handleOpenAdd() {
    navigate("/ProductManagement/add");
  }

  function handleCloseAdd() {
    navigate("/ProductManagement");
  }

  return (
    <div className="dashboard-root">
      <Sidebar />

      {/* main area includes ProductTopbar */}
      <div className="dashboard-main">
        <ProductTopbar />

        <div className="dashboard-content">
          <div className="product-page">
            {/* Header + actions */}
            {!showAddForm && (
              <div className="product-header-wrap">
                <div className="product-header-right ">

                  {/* Search bar with icon */}
                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      className="search-input"
                      placeholder="Search product or SKU..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                  </div>

                  {/* Export button with icon */}
                  <button
                    className="btn-outline"
                    onClick={() => alert("Export - implement as needed")}
                  >
                    <FaDownload style={{ marginRight: "6px" }} /> Export
                  </button>

                  {/* Add Product */}
                  <button className="btn-primary" onClick={handleOpenAdd}>
                    + Add Product
                  </button>
                </div>
              </div>
            )}

            {/* Tabs + right filter */}
            {!showAddForm && (
              <div className="product-filters">
                <div className="tabs">
                  <button
                    className={`tab ${tab === "all" ? "active" : ""}`}
                    onClick={() => setTab("all")}
                  >
                    All Product
                  </button>
                  <button
                    className={`tab ${tab === "published" ? "active" : ""}`}
                    onClick={() => setTab("published")}
                  >
                    Published
                  </button>
                  <button
                    className={`tab ${tab === "lowstock" ? "active" : ""}`}
                    onClick={() => setTab("lowstock")}
                  >
                    Low Stock
                  </button>
                  <button
                    className={`tab ${tab === "draft" ? "active" : ""}`}
                    onClick={() => setTab("draft")}
                  >
                    Draft
                  </button>
                </div>

                <div className="right-filters">

                  {/* Right-side search with icon */}
                  <div className="filter-search-wrapper">
                    <FaSearch className="filter-search-icon" />
                    <input
                      className="filter-input"
                      placeholder="Search product..."
                      value={rightSearch}
                      onChange={(e) => setRightSearch(e.target.value)}
                    />
                  </div>

                  {/* Select date with icon */}
                  <div className="select-wrapper">
                    <FaCalendarAlt className="select-icon" />
                    <select className="filter-select">
                      <option>Select Date</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>

                  {/* Filters button with icon */}
                  <button
                    className="btn-outline"
                    onClick={() => alert("Open filters")}
                  >
                    <FaFilter style={{ marginRight: "6px" }} /> Filters
                  </button>
                </div>
              </div>
            )}

            {/* Main area */}
            <div className="product-main-area">
              {showAddForm ? (
                <div className="add-product-inline">
                  <AddProductForm onCancel={handleCloseAdd} />
                </div>
              ) : (
                <div className="product-table-container">
                  <ProductTable
                    search={globalSearch}
                    tab={tab}
                    rightSearch={rightSearch}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
