// src/components/AddProductForm.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProductForm.css";

export default function AddProductForm({ onCancel }) {
  const navigate = useNavigate();

  function goToProductManagement() {
    navigate("/ProductManagement");
  }

  // Default placeholder image
  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";

  return (
    <div className="add-product-container full-page">
      {/* ===== Top bar (Breadcrumb + Action Buttons) ===== */}
      <div className="add-product-top top-v2">
        <div className="breadcrumb">
          <span
            className="crumb-link"
            style={{
              color: "#4f46e5",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={goToProductManagement}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") goToProductManagement();
            }}
          >
            Product
          </span>
          <span className="crumb-sep">›</span>
          <span className="crumb-current">Add Product</span>
        </div>

        <div className="top-buttons">
          {/* Cancel Button */}
          <button className="btn cancel outlined" onClick={onCancel}>
            <span className="icon-circle" aria-hidden="true">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#6b7280"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="btn-text">Cancel</span>
          </button>

          {/* Add Product Button */}
          <button className="btn add-product filled" type="button">
            <span className="icon-box" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="14"
                height="14"
                fill="none"
              >
                <path
                  d="M21 19V8a2 2 0 0 0-2-2h-3.2l-1.2-1.6A2 2 0 0 0 13.8 3H10.2a2 2 0 0 0-1.8 1.4L7.2 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h17z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="14"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 7h.01"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="btn-text">Add Product</span>
          </button>
        </div>
      </div>

      {/* ===== Main Content (2 Columns Layout) ===== */}
      <div className="add-product-layout">
        {/* ===== Left Content ===== */}
        <div className="add-left">
          {/* General Info */}
          <section className="card">
            <h3 className="card-title">General Information</h3>
            <div className="form-row">
              <input className="input" placeholder="Type product name here…" />
            </div>
            <div className="form-row">
              <textarea
                className="textarea"
                placeholder="Type product description here…"
              />
            </div>
          </section>

          {/* ===== Media Section ===== */}
          <section className="card">
            <h3 className="card-title">Media</h3>
            <div
              className="media-dropzone"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 16px",
                textAlign: "center",
                gap: "14px",
              }}
            >
              {/* Default Image Box */}
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px dashed rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={defaultImage}
                  alt="Default Preview"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    opacity: 0.9,
                  }}
                />
              </div>

              <div
                className="media-note"
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                  marginTop: 4,
                  marginBottom: 0,
                }}
              >
                Drag and drop image here, or click add image
              </div>

              {/* Centered Add Image Button */}
              <button
                className="btn outline small"
                style={{
                  marginTop: 8,
                  width: 120,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // centers text horizontally
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#4f46e5",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Add Image
              </button>
            </div>
          </section>

          {/* Pricing */}
          <section className="card">
            <h3 className="card-title">Pricing</h3>
            <div className="form-row">
              <input className="input" placeholder="$ Type base price here…" />
            </div>
            <div className="form-row two">
              <select className="select">
                <option>Discount Type</option>
              </select>
              <input
                className="input"
                placeholder="Discount Percentage (%)"
              />
            </div>
            <div className="form-row two">
              <select className="select">
                <option>Tax Class</option>
              </select>
              <input className="input" placeholder="VAT Amount (%)" />
            </div>
          </section>

          {/* Inventory */}
          <section className="card">
            <h3 className="card-title">Inventory</h3>
            <div className="form-row three">
              <input className="input" placeholder="SKU" />
              <input className="input" placeholder="Barcode" />
              <input className="input" placeholder="Quantity" />
            </div>
          </section>

          {/* Variation */}
          <section className="card">
            <h3 className="card-title">Variation</h3>
            <div className="form-row two">
              <select className="select">
                <option>Select variation type</option>
              </select>
              <input className="input" placeholder="Variation…" />
            </div>
            <button className="btn ghost small" style={{ marginTop: 12 }}>
              + Add Variant
            </button>
          </section>

          {/* Shipping */}
          <section className="card">
            <h3 className="card-title">Shipping</h3>
            <div className="shipping-toggle">
              <input type="checkbox" id="physical" defaultChecked />
              <label htmlFor="physical">This is a physical product</label>
            </div>
            <div className="form-row four" style={{ marginTop: 12 }}>
              <input className="input" placeholder="Weight" />
              <input className="input" placeholder="Height (cm)" />
              <input className="input" placeholder="Length (cm)" />
              <input className="input" placeholder="Width (cm)" />
            </div>
          </section>
        </div>

        {/* ===== Right Sidebar ===== */}
        <div className="add-right">
          <section className="card sidebar-card">
            <h3 className="card-title">Category</h3>
            <label className="label">Product Category</label>
            <select className="select">
              <option>Select a category</option>
            </select>

            <label className="label">Product Tags</label>
            <select className="select">
              <option>Select tags</option>
            </select>
          </section>

          <section className="card sidebar-card">
            <h3 className="card-title">Status</h3>
            <label className="label">Product Status</label>
            <select className="select">
              <option>Draft</option>
            </select>
          </section>
        </div>
      </div>
    </div>
  );
}
