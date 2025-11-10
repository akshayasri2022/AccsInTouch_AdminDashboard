// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaDownload, FaFilter, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
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
  const [refreshKey, setRefreshKey] = useState(0);

  // Show add form when URL is /ProductManagement/add
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState([]); // <-- Store fetched products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setShowAddForm(location.pathname === "/ProductManagement/add");
  }, [location.pathname]);

   // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("https://acc-in-touch-1.onrender.com/api/Product");
        console.log(res,"responseProducts")
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey]); // refetch when a product is added or updated

  function handleOpenAdd() {
    navigate("/ProductManagement/add");
  }

  function handleProductAdded(newProduct) {
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => {
      navigate("/ProductManagement");
    }, 1500);
  }

  function handleCloseAdd() {
    navigate("/ProductManagement");
  }

    // Filter products based on search + tab selection
  const filteredProducts = products.filter((product) => {
    const searchTerm = globalSearch.toLowerCase() || rightSearch.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm);

    if (tab === "published") return product.status === "Published" && matchesSearch;
    if (tab === "lowstock") return product.stock < 10 && matchesSearch;
    if (tab === "draft") return product.status === "Draft" && matchesSearch;
    return matchesSearch;
  });

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
                  <AddProductForm onCancel={handleCloseAdd} 
                  onProductAdded={handleProductAdded}
                    />
                </div>
             ) : (
                <div className="product-table-container">
                  {loading ? (
                    <p className="loading-text">Loading products...</p>
                  ) : error ? (
                    <p className="error-text">{error}</p>
                  ) : (
                    <ProductTable
                      key={refreshKey}
                      products={filteredProducts} // <-- Pass fetched products
                      search={globalSearch}
                      tab={tab}
                      rightSearch={rightSearch}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}