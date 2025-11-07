// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaDownload, FaFilter, FaCalendarAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import ProductTopbar from "../components/ProductTopbar";
import ProductTable from "../components/ProductTable";
import AddProductForm from "./AddProductForm";
import "../styles/Product.css";

export default function ProductManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState("all");
  const [globalSearch, setGlobalSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    setShowAddForm(location.pathname.includes("/add"));
  }, [location.pathname]);

  const handleOpenAdd = () => {
    navigate("/ProductManagement/add");
  };

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      navigate("/ProductManagement");
    }, 1200);
  };

  const handleCloseAdd = () => {
    navigate("/ProductManagement");
  };

  return (
    <div className="dashboard-root" style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6" }}>
      <Sidebar />
      <div className="dashboard-main" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ProductTopbar />
        <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
          <div className="product-page">
            {!showAddForm && (
              <div className="product-header-wrap">
                <div className="product-header-left">
                  <h2>Products</h2>
                </div>
                <div className="product-header-right">
                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search product or SKU..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                  </div>
                  <button className="btn-outline">
                    <FaDownload style={{ marginRight: "6px" }} /> Export
                  </button>
                  <button className="btn-primary" onClick={handleOpenAdd}>
                    + Add Product
                  </button>
                </div>
              </div>
            )}
            {!showAddForm && (
              <div className="product-filters">
                <div className="tabs">
                  {["all", "published", "lowstock", "draft"].map((t) => (
                    <button
                      key={t}
                      className={`tab ${tab === t ? "active" : ""}`}
                      onClick={() => setTab(t)}
                    >
                      {t === "all"
                        ? "All Product"
                        : t === "published"
                        ? "Published"
                        : t === "lowstock"
                        ? "Low Stock"
                        : "Draft"}
                    </button>
                  ))}
                </div>
                <div className="right-filters">
                  <div className="filter-search-wrapper">
                    <FaSearch className="filter-search-icon" />
                    <input
                      type="text"
                      className="filter-input"
                      placeholder="Search product..."
                      value={rightSearch}
                      onChange={(e) => setRightSearch(e.target.value)}
                    />
                  </div>
                  <div className="select-wrapper">
                    <FaCalendarAlt className="select-icon" />
                    <select className="filter-select">
                      <option>Select Date</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                  </div>
                  <button className="btn-outline">
                    <FaFilter style={{ marginRight: "6px" }} /> Filters
                  </button>
                </div>
              </div>
            )}
            <div className="product-main-area">
              {showAddForm ? (
                <AddProductForm onCancel={handleCloseAdd} onProductAdded={handleProductAdded} />
              ) : (
                <ProductTable
                  key={refreshKey}
                  search={globalSearch}
                  rightSearch={rightSearch}
                  tab={tab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}