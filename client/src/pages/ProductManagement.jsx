import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProductTable from "../components/ProductTable";
import AddProductForm from "./AddProductForm"; // <- new import
import "../styles/Product.css";

export default function ProductManagement() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("all");
  const [globalSearch, setGlobalSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  // Local state to show/hide the inline Add Product form
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />

        <div className="dashboard-content">
          <div className="product-page">
            <div className="product-header">
              <h2>Product</h2>

              <div className="product-actions">
                <input
                  className="search-input"
                  placeholder="Search product or SKU..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
                <button
                  className="btn-outline"
                  onClick={() => alert("Export - implement as needed")}
                >
                  Export
                </button>

                {/* When the Add form is visible, hide the +Add button (or you could keep a nav option) */}
                {!showAddForm ? (
                  <button
                    className="btn-primary"
                    // previously navigated; now show inline form instead
                    onClick={() => setShowAddForm(true)}
                  >
                    + Add Product
                  </button>
                ) : (
                  <button
                    className="btn-cancel"
                    onClick={() => setShowAddForm(false)}
                    title="Close add product form"
                  >
                    Close
                  </button>
                )}

                {/* Optional: if you still want route-based navigation available, uncomment below */}
                {/* <button className="btn-primary" onClick={() => navigate("/products/add")}>+ Add Product (route)</button> */}
              </div>
            </div>

            {/* Filters and tabs */}
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
                <input
                  className="filter-input"
                  placeholder="Search product..."
                  value={rightSearch}
                  onChange={(e) => setRightSearch(e.target.value)}
                />
                <select className="filter-select">
                  <option>Select Date</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                </select>
                <button
                  className="btn-outline"
                  onClick={() => alert("Open filters")}
                >
                  Filters
                </button>
              </div>
            </div>

            {/* ===== Inline Add Product form rendering ===== */}
            {showAddForm ? (
              <div className="add-product-inline">
                {/* Pass onCancel so form can close itself */}
                <AddProductForm onCancel={() => setShowAddForm(false)} />
              </div>
            ) : (
              /* ===== Normal product list/table ===== */
              <ProductTable search={globalSearch} tab={tab} rightSearch={rightSearch} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
