import React from "react";
import "../styles/AddProductForm.css";

export default function AddProductForm({ onCancel }) {
  return (
    <div className="add-product-page">
      {/* Top breadcrumb and buttons */}
      <div className="add-product-actions">
        <div className="breadcrumb">Product &gt; Add Product</div>
        <div className="action-buttons">
          <button className="btn cancel" onClick={onCancel}>Cancel</button>
          <button className="btn add-product">+ Add Product</button>
        </div>
      </div>

      {/* General Information */}
      <section className="card">
        <h3 className="card-title">General Information</h3>
        <div className="form-row">
          <input className="input" placeholder="Product Name" />
        </div>
        <div className="form-row">
          <textarea className="textarea" placeholder="Type product description here…" />
        </div>
      </section>

      {/* Media */}
      <section className="card">
        <h3 className="card-title">Media</h3>
        <div className="media-dropzone large">
          <img
            src="/mnt/data/1d8e1f8b-c03e-4822-b9de-7bf61b866cf9.png"
            alt="media preview"
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
        <button className="btn ghost small" style={{ marginTop: 12 }}>+ Add Variant</button>
      </section>

      {/* Shipping */}
      <section className="card">
        <h3 className="card-title">Shipping</h3>
        <div className="shipping-toggle">
          <input type="checkbox" id="physical" defaultChecked />
          <label htmlFor="physical">This is a physical product</label>
        </div>
        <div className="form-row three" style={{ marginTop: 12 }}>
          <input className="input" placeholder="Weight" />
          <input className="input" placeholder="Height (cm)" />
          <input className="input" placeholder="Length (cm)" />
        </div>
      </section>
    </div>
  );
}
