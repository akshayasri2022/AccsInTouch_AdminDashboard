// src/pages/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProductTopbar from "../components/ProductTopbar";
import "../styles/AddProductForm.css";
import "../styles/EditProduct.css";

// Mock products - replace with your real data source or fetch by id
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Elegant Watch",
    description: "Slim, water-resistant watch with leather strap.",
    price: "400.00",
    sku: "302002",
    barcode: "0984939101123",
    quantity: "124",
    category: "Watch",
    tags: ["Watch", "Gadget"],
    status: "Published",
    weight: "0.25",
    height: "10",
    length: "10",
    width: "7",
    variations: [
      { type: "Color", value: "Black" },
      { type: "Color", value: "Gray" },
    ],
    // you can put a valid image path here to test thumbnails
    images: ["/mnt/data/b607bf28-b9c5-4c39-a1f5-9ae753db2a9e.png"],
  },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find product (mock). Replace with fetch(...) if needed.
  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  // form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    barcode: "",
    quantity: "",
    category: "",
    tags: [],
    status: "Draft",
    weight: "",
    height: "",
    length: "",
    width: "",
    variations: [],
    images: [],
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        quantity: product.quantity || "",
        category: product.category || "",
        tags: product.tags || [],
        status: product.status || "Draft",
        weight: product.weight || "",
        height: product.height || "",
        length: product.length || "",
        width: product.width || "",
        variations: product.variations || [],
        images: product.images || [],
      });
    }
  }, [product]);

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    // TODO: call API to save changes
    alert("Saved (mock). Replace with API call.");
    navigate("/ProductManagement");
  }

  function handleCancel() {
    navigate("/ProductManagement");
  }

  function handleGoToProduct() {
    navigate("/ProductManagement");
  }

  // Replace with a local import if you'd rather (import placeholder from "../assets/placeholder.png")
  const placeholderUrl = "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";

  // onError handler for images - swap to placeholder if original fails
  function handleImageError(e) {
    if (!e || !e.target) return;
    e.target.onerror = null;
    e.target.src = placeholderUrl;
  }

  // Inline SVG placeholder component (used when no images)
  const PlaceholderSVG = () => (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 19V8a2 2 0 0 0-2-2h-3.2l-1.2-1.6A2 2 0 0 0 13.8 3H10.2a2 2 0 0 0-1.8 1.4L7.2 6H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h17z"
        stroke="#6b7280"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="3" stroke="#6b7280" strokeWidth="1.2" />
      <path d="M17 7h.01" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <ProductTopbar />

        <div className="dashboard-content">
          <div className="add-product-container full-page">
            {/* TOP HEADER */}
            <div className="edit-top-header" style={{ marginBottom: 12 }}>
              <div className="edit-top-info">
                <h1
                  className="edit-top-title"
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0b1220",
                    lineHeight: 1.1,
                  }}
                >
                  {form.name || ""}
                </h1>
                <p
                  className="edit-top-desc"
                  style={{
                    margin: "6px 0 0 0",
                    fontSize: 13,
                    color: "#6b7280",
                    maxWidth: "72ch",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {form.description || ""}
                </p>
              </div>
            </div>

            {/* top breadcrumb + actions */}
            <div className="add-product-top top-v2">
              <div className="breadcrumb">
                <span
                  className="crumb-link"
                  style={{
                    color: "#4f46e5",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleGoToProduct}
                >
                  Product
                </span>
                <span className="crumb-sep">›</span>
                <span className="crumb-current">Edit Product</span>
              </div>

              <div className="top-buttons">
                {/* Cancel */}
                <button
                  type="button"
                  className="btn cancel outlined"
                  onClick={handleCancel}
                  aria-label="Cancel"
                >
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

                {/* Save */}
                <button
                  type="button"
                  className="btn add-product filled"
                  onClick={handleSave}
                >
                  <span className="icon-box" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 10a5 5 0 0 1 10 0v2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="1"
                      />
                      <rect
                        x="4"
                        y="10"
                        width="16"
                        height="10"
                        rx="2"
                        ry="2"
                        stroke="none"
                        fill="currentColor"
                        opacity="0.06"
                      />
                      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="btn-text">Save Product</span>
                </button>
              </div>
            </div>

            {/* Main content 2-column layout (left form, right sidebar) */}
            <div className="add-product-layout">
              <div className="add-left">
                {/* General Information */}
                <section className="card">
                  <h3 className="card-title">General Information</h3>
                  <div className="form-row">
                    <input
                      className="input"
                      placeholder="Product Name"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <textarea
                      className="textarea"
                      placeholder="Type product description here…"
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      rows={5}
                    />
                  </div>
                </section>

                {/* Media (updated: default placeholder + centered Add Image) */}
                <section className="card">
                  <h3 className="card-title">Media</h3>

                  <div
                    className="media-dropzone"
                    role="region"
                    aria-label="Product media"
                  >
                    {/* thumbnails (if present) */}
                    {form.images && form.images.length > 0 ? (
                      <div className="thumbnails">
                        {form.images.map((src, i) => (
                          <div className="thumb" key={i}>
                            <img
                              src={src}
                              alt={`product-${i}`}
                              onError={handleImageError}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="media-inner" aria-hidden="true">
                        {/* show an inline SVG placeholder when no images */}
                        <PlaceholderSVG />
                      </div>
                    )}

                    <div className="media-note">
                      Drag and drop image here, or click add image
                    </div>

                    <button
                      type="button"
                      className="media-add-btn"
                      onClick={() => alert("Add image - implement file picker")}
                    >
                      Add Image
                    </button>
                  </div>
                </section>

                {/* Pricing */}
                <section className="card">
                  <h3 className="card-title">Pricing</h3>
                  <div className="form-row">
                    <input
                      className="input"
                      placeholder="$ Type base price here…"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                    />
                  </div>

                  <div className="form-row two">
                    <select className="select">
                      <option>No Discount</option>
                      <option>Percentage</option>
                    </select>
                    <input
                      className="input"
                      placeholder="Discount Percentage (%)"
                    />
                  </div>

                  <div className="form-row two">
                    <select className="select">
                      <option>Tax Free</option>
                      <option>Standard</option>
                    </select>
                    <input className="input" placeholder="VAT Amount (%)" />
                  </div>
                </section>

                {/* Inventory */}
                <section className="card">
                  <h3 className="card-title">Inventory</h3>
                  <div className="form-row three">
                    <input
                      className="input"
                      placeholder="SKU"
                      value={form.sku}
                      onChange={(e) => updateField("sku", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Barcode"
                      value={form.barcode}
                      onChange={(e) => updateField("barcode", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Quantity"
                      value={form.quantity}
                      onChange={(e) => updateField("quantity", e.target.value)}
                    />
                  </div>
                </section>

                {/* Variation */}
                <section className="card">
                  <h3 className="card-title">Variation</h3>
                  {form.variations.map((v, idx) => (
                    <div className="form-row two" key={idx}>
                      <select
                        className="select"
                        value={v.type}
                        onChange={(e) => {
                          const copy = [...form.variations];
                          copy[idx].type = e.target.value;
                          updateField("variations", copy);
                        }}
                      >
                        <option>Color</option>
                        <option>Size</option>
                      </select>
                      <input
                        className="input"
                        placeholder="Variation…"
                        value={v.value}
                        onChange={(e) => {
                          const copy = [...form.variations];
                          copy[idx].value = e.target.value;
                          updateField("variations", copy);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    className="btn ghost small"
                    style={{ marginTop: 12 }}
                    onClick={() =>
                      updateField("variations", [
                        ...form.variations,
                        { type: "Color", value: "" },
                      ])
                    }
                  >
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
                    <input
                      className="input"
                      placeholder="Weight"
                      value={form.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Height (cm)"
                      value={form.height}
                      onChange={(e) => updateField("height", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Length (cm)"
                      value={form.length}
                      onChange={(e) => updateField("length", e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Width (cm)"
                      value={form.width}
                      onChange={(e) => updateField("width", e.target.value)}
                    />
                  </div>
                </section>
              </div>

              {/* Right sidebar */}
              <div className="add-right">
                <section className="card sidebar-card">
                  <h3 className="card-title">Category</h3>
                  <label className="label">Product Category</label>
                  <select
                    className="select"
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  >
                    <option>Watch</option>
                    <option>Audio</option>
                    <option>Clothing</option>
                  </select>

                  <label className="label" style={{ marginTop: 12 }}>
                    Product Tags
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(form.tags || []).map((t, i) => (
                      <div
                        key={i}
                        style={{
                          background: "#f3f0ff",
                          padding: "6px 8px",
                          borderRadius: 8,
                          fontWeight: 700,
                          color: "#6d28d9",
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card sidebar-card" style={{ marginTop: 12 }}>
                  <h3 className="card-title">Status</h3>
                  <label className="label">Product Status</label>
                  <select
                    className="select"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
