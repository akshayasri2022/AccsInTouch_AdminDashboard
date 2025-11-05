import React from "react";
import "../styles/AddProductForm.css";

export default function AddProductForm({ onCancel }) {
  return (
    <div className="add-product-container full-page">
      {/* ===== Top bar (Breadcrumb + Action Buttons) ===== */}
      <div className="add-product-top top-v2">
        <div className="breadcrumb">
          <span className="crumb-link">Product</span>
          <span className="crumb-sep">›</span>
          <span className="crumb-current">Add Product</span>
        </div>

        <div className="top-buttons">
          {/* Cancel Button */}
          <button className="btn cancel outlined" onClick={onCancel}>
            <span className="x-icon">✕</span>
            <span className="btn-text">Cancel</span>
          </button>

          {/* Add Product Button */}
          <button className="btn add-product filled">
            <span className="plus">+</span>
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
              <textarea className="textarea" placeholder="Type product description here…" />
            </div>
          </section>

          {/* Media */}
          <section className="card">
            <h3 className="card-title">Media</h3>
            <div className="media-dropzone">
              <img
                src="/mnt/data/b607bf28-b9c5-4c39-a1f5-9ae753db2a9e.png"
                alt="Preview"
                className="media-preview"
              />
              <div className="media-note">
                Drag and drop image here, or click add image
              </div>
              <button className="btn outline small">Add Image</button>
            </div>
          </section>

          {/* Pricing */}
          <section className="card">
            <h3 className="card-title">Pricing</h3>
            <div className="form-row">
              <input className="input" placeholder="$ Type base price here…" />
            </div>
            <div className="form-row two">
              <select className="select"><option>Discount Type</option></select>
              <input className="input" placeholder="Discount Percentage (%)" />
            </div>
            <div className="form-row two">
              <select className="select"><option>Tax Class</option></select>
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
              <select className="select"><option>Select variation type</option></select>
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
            <select className="select"><option>Select a category</option></select>

            <label className="label">Product Tags</label>
            <select className="select"><option>Select tags</option></select>
          </section>

          <section className="card sidebar-card">
            <h3 className="card-title">Status</h3>
            <label className="label">Product Status</label>
            <select className="select"><option>Draft</option></select>
          </section>
        </div>
      </div>
    </div>
  );
}
