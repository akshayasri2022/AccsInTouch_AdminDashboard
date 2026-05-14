// src/pages/ProductManagement.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaDownload, FaFilter, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
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
  const [products, setProducts] = useState([]); // <-- Store fetched products
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // also used for 7days/30days and status name
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // 'all' | 'low' | 'instock'

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    setShowAddForm(location.pathname === "/ProductManagement/add");
  }, [location.pathname]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Product`
        );
        console.log(res, "responseProducts");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshKey]);

  // helper to normalize status => lowercase, no spaces / hyphen / underscore
  const normalizeStatus = (value) => {
    if (value === undefined || value === null) return "";
    return value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, ""); // remove space, underscore, hyphen
  };

  // derive categories from products for filter dropdown
  const categoryOptions = useMemo(() => {
    const setCat = new Set();
    products.forEach((p) => {
      const cat = p.productCategory || p.category;
      if (cat) setCat.add(cat);
    });
    return Array.from(setCat);
  }, [products]);

  const handleExport = () => {
    const headers = [
      "productSKU",
      "productName",
      "productQuantity",
      "productStatus",
      "basicPricing",
    ];

    const csvData = filteredProducts.map((order) => [
      order.productSKU || "",
      order.productName || "",
      order.productQuantity || "",
      order.productStatus || "",
      order.basicPricing || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `products_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  // Apply filter button opens modal
  function handleOpenFilters() {
    setShowFilterModal(true);
  }

  function handleClearFilters() {
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterStatus("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setStockFilter("all");
    setShowFilterModal(false);
  }

  function handleApplyFilters() {
    // Modal just closes — filters are read from state in filteredProducts
    setShowFilterModal(false);
  }

  // date select on right side (dropdown)
  function handleDateSelectChange(e) {
    const val = e.target.value;
    if (val === "7") setFilterStatus("7days");
    else if (val === "30") setFilterStatus("30days");
    else setFilterStatus("");
  }

  // Filtered products computed from products + UI filter states
  const filteredProducts = products.filter((product) => {
    const now = new Date();
    const createdDate = product.createdAt ? new Date(product.createdAt) : null;

    // Defensive normalization (ensure strings)
    const prodName = (product.productName || "").toString();
    const prodSKU = (product.productSKU || "").toString();
    const prodStatusRaw = (
      product.productStatus ||
      product.status ||
      ""
    ).toString();
    const prodCategoryRaw = (
      product.productCategory ||
      product.category ||
      ""
    ).toString();

    const prodStatusNorm = normalizeStatus(prodStatusRaw); // key
    const prodCategory = prodCategoryRaw.trim().toLowerCase();

    // Search filters (merge left+right search, case-insensitive)
    const searchTermCombined = `${globalSearch || ""} ${rightSearch || ""}`
      .trim()
      .toLowerCase();

    const searchTokens = searchTermCombined
      ? searchTermCombined.split(/\s+/).filter(Boolean)
      : [];

    const nameLower = prodName.toLowerCase();
    const skuLower = prodSKU.toLowerCase();

    const matchesSearch =
      searchTokens.length === 0 ||
      searchTokens.every(
        (t) => nameLower.includes(t) || skuLower.includes(t)
      );

    if (!matchesSearch) return false;

    // Stock quantity (for stock filters & outofstock/lowstock tabs, if you want)
    const qty = Number(
      product.productQuantity ??
        product.stock ??
        product.qty ??
        product.product_qty ??
        0
    );

    // Tab-based filters (case-insensitive, format-insensitive)
    const tabKey = (tab || "").toString().trim().toLowerCase();

    if (tabKey === "outofstock") {
      // match status "OUTOFSTOCK", "Out of stock", "out-of-stock", etc.
      if (prodStatusNorm !== "outofstock") return false;
    }

    if (tabKey === "lowstock") {
      // match "lowstock", "Low Stock", "LOW-STOCK", etc.
      if (prodStatusNorm !== "lowstock") return false;
    }

    if (tabKey === "draft") {
      if (prodStatusNorm !== "draft") return false;
    }

    // Dropdown date filter (Last 7 or 30 days)
   if (filterStatus === "7days") {
  if (!createdDate) return false;
  const days = (now - createdDate) / (1000 * 60 * 60 * 24);
  if (days > 7) return false;
}
if (filterStatus === "30days") {
  if (!createdDate) return false;
  const days = (now - createdDate) / (1000 * 60 * 60 * 24);
  if (days > 30) return false;
}


    // Custom date range
    if (filterStartDate) {
      const s = new Date(filterStartDate);
      if (!createdDate || createdDate < s) return false;
    }
    if (filterEndDate) {
      const e = new Date(filterEndDate);
      if (!createdDate || createdDate > e) return false;
    }

    // Status filter (if user selected an explicit status string other than 7days/30days)
    if (filterStatus && !["7days", "30days"].includes(filterStatus)) {
      const fsNorm = normalizeStatus(filterStatus);
      if (prodStatusNorm !== fsNorm) return false;
    }

    // Category filter (case-insensitive)
    if (selectedCategory) {
      const selCat = selectedCategory.toString().trim().toLowerCase();
      if (prodCategory !== selCat) return false;
    }

    // Stock filter from modal (based on quantity)
    if (stockFilter === "low") {
      if (!(Number.isFinite(qty) && qty > 0 && qty < LOW_STOCK_THRESHOLD)) {
        return false;
      }
    }
    if (stockFilter === "instock") {
      if (!(Number.isFinite(qty) && qty >= LOW_STOCK_THRESHOLD)) {
        return false;
      }
    }

    // Price filter
    const basicPrice = Number(product.basicPricing);
    if (minPrice !== "" && !Number.isNaN(basicPrice)) {
      if (basicPrice < parseFloat(minPrice)) return false;
    }
    if (maxPrice !== "" && !Number.isNaN(basicPrice)) {
      if (basicPrice > parseFloat(maxPrice)) return false;
    }

    return true;
  });

  // compute active filter count for badge
  const activeFilterCount = [
    selectedCategory ? 1 : 0,
    stockFilter !== "all" ? 1 : 0,
    minPrice ? 1 : 0,
    maxPrice ? 1 : 0,
    filterStartDate ? 1 : 0,
    filterEndDate ? 1 : 0,
    filterStatus && !["7days", "30days"].includes(filterStatus) ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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
                  <button className="btn-outline" onClick={handleExport}>
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
                    className={`tab ${tab === "instock" ? "active" : ""}`}
                    onClick={() => setTab("instock")}
                  >
                    In Stock
                  </button>
                  <button
                    className={`tab ${tab === "lowstock" ? "active" : ""}`}
                    onClick={() => setTab("lowstock")}
                  >
                    Low Stock
                  </button>
                  <button
                    className={`tab ${tab === "outofstock" ? "active" : ""}`}
                    onClick={() => setTab("outofstock")}
                  >
                    Out of Stock
                  </button>
                  <button
                    className={`tab ${tab === "discontinued" ? "active" : ""}`}
                    onClick={() => setTab("discontinued")}
                  >
                    Discontinued
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
                  
                  {/* Select date with icon */}
                  <div className="select-wrapper">
                    <FaCalendarAlt className="select-icon" />
                    <select
                      className="filter-select"
                      onChange={handleDateSelectChange}
                      value={
                        filterStatus === "7days"
                          ? "7"
                          : filterStatus === "30days"
                          ? "30"
                          : ""
                      }
                    >
                      <option value="">Select Date</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>

                  {/* Filters button with icon + active-count badge */}
                  <button
                    className="btn-outline filter-btn"
                    onClick={handleOpenFilters}
                  >
                    <FaFilter style={{ marginRight: "6px" }} /> Filters
                    <span
                      className={`filter-badge ${
                        activeFilterCount === 0 ? "zero" : ""
                      }`}
                    >
                      {activeFilterCount}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Main area */}
            <div className="product-main-area">
              {showAddForm ? (
                <div className="add-product-inline">
                  <AddProductForm
                    onCancel={handleCloseAdd}
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
                      products={filteredProducts}
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

      {/* Filter Modal (uses CSS classes from Product.css) */}
      {showFilterModal && (
        <div className="filter-modal-overlay">
          <div className="filter-modal">
            <h3>Filters</h3>

            <div style={{ marginBottom: 12 }}>
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: 6 }}
              >
                <option value="">All categories</option>
                {/* Static options; you can switch to categoryOptions.map(...) if you want dynamic */}
                <option value="HairBows">Hair Bows</option>
                <option value="Claws">Claws</option>
                <option value="Earrings">Earrings</option>
                <option value="Scrunchies">Scrunchies</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Min Price</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  style={{ width: "100%", padding: "8px", marginTop: 6 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Max Price</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="9999.99"
                  style={{ width: "100%", padding: "8px", marginTop: 6 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label>Start Date</label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: 6 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>End Date</label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: 6 }}
                />
              </div>
            </div>

            <div
              className="modal-actions"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 10,
              }}
            >
              <button className="btn-outline" onClick={handleClearFilters}>
                Clear
              </button>
              <button className="btn-primary" onClick={handleApplyFilters}>
                Apply
              </button>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="close-x"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
