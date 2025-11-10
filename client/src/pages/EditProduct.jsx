// src/pages/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProductTopbar from "../components/ProductTopbar";
import axios from "axios";
import "../styles/AddProductForm.css";
import "../styles/EditProduct.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

const [form, setForm] = useState({
    productName: "",
    productDescription: "",
    basicPricing: "",
    productSKU: "",
    productBarcode: "",
    productQuantity: "",
    productCategory: "",
    productStatus: "draft",
    productWeight: "",
    productHeight: "",
    productLength: "",
    productWidth: "",
    productTags: "",
    image_url: [],               // <-- matches DB field
    discountType: "0%",          // UI-only (not sent to server)
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch product details by ID
  // ✅ Fetch product details by ID
  useEffect(() => {
    fetchProduct();
  }, [id]);

const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:25186/api/Product/${id}`   // <-- your local backend
      );

      setForm({
        productName: data.productName || "",
        productDescription: data.productDescription || "",
        basicPricing: data.basicPricing || "",
        productSKU: data.productSKU || "",
        productBarcode: data.productBarcode || "",
        productQuantity: data.productQuantity || "",
        productCategory: data.productCategory || "",
        productStatus: data.productStatus || "draft",
        productWeight: data.productWeight || "",
        productHeight: data.productHeight || "",
        productLength: data.productLength || "",
        productWidth: data.productWidth || "",
        productTags: data.productTags || "",
        image_url: Array.isArray(data.image_url) ? data.image_url : [],
        discountType: "0%",               // default – will be overwritten if you store it
      });
    } catch (err) {
      console.error("Error fetching product:", err);
      alert("Failed to load product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // handle field change
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save button clicked! ID:", id);

    // Build payload **exactly** as the backend expects
    const payload = {
      productName: form.productName,
      productDescription: form.productDescription,
      basicPricing: Number(form.basicPricing) || 0,
      productSKU: form.productSKU,
      productBarcode: form.productBarcode,
      productQuantity: Number(form.productQuantity) || 0,
      productCategory: form.productCategory,
      productStatus: form.productStatus,
      productWeight: Number(form.productWeight) || 0,
      productHeight: Number(form.productHeight) || 0,
      productLength: Number(form.productLength) || 0,
      productWidth: Number(form.productWidth) || 0,
      productTags: form.productTags,
      image_url: form.image_url,
      // discountType is **not** sent – it is only UI
    };

    console.log("Sending payload:", payload);

    try {
      const { data, status } = await axios.put(
        `http://localhost:25186/api/Product/${id}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 12_000,
        }
      );

      console.log("Update response:", { status, data });

      if (status === 200 || status === 201) {
        alert("Product updated successfully!");
        navigate("/ProductManagement");
      } else {
        throw new Error(`Unexpected status ${status}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      if (err.code === "ERR_NETWORK") {
        alert("Network error – is the backend running on http://localhost:25186 ?");
      } else if (err.response) {
        const msg = err.response.data?.message || err.response.statusText;
        alert(`Update failed (${err.response.status}): ${msg}`);
      } else {
        alert("Failed to update product. See console.");
      }
    } finally {
      setSaving(false);
    }
  };

  function handleCancel() {
    navigate("/ProductManagement");
  }

 if (loading) {
    return (
      <div className="dashboard-root">
        <Sidebar />
        <div className="dashboard-main">
          <ProductTopbar />
          <div className="dashboard-content">
            <p style={{ padding: 40 }}>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Replace with a local import if you'd rather (import placeholder from "../assets/placeholder.png")
  const placeholderUrl =
    "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";

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
      <path
        d="M17 7h.01"
        stroke="#6b7280"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <ProductTopbar />

        <div className="dashboard-content">
          <div className="editproductadd-product-container full-page">
            {/* TOP HEADER */}
            <div
              className="editproductedit-top-header"
              style={{ marginBottom: 12 }}
            >
              <div className="editproductedit-top-info">
                <h2
                  className="editproductedit-top-title"
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#0b1220",
                    lineHeight: 1.1,
                  }}
                >
                  {form.productName}
                </h2>
                <p
                  className="editproductedit-top-desc"
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
                  {form.productDescription}
                </p>
              </div>
            </div>

            {/* top breadcrumb + actions */}
            <div className="editproductadd-product-top top-v2">
              <div className="editproductbreadcrumb">
                <span
                  className="editproductcrumb-link"
                  style={{
                    color: "#4f46e5",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/ProductManagement")}
                >
                  Product
                </span>
                <span className="editproductcrumb-sep">›</span>
                <span className="editproductcrumb-current">Edit Product</span>
              </div>

              <div className="editproducttop-buttons">
                {/* Cancel */}
                <button
                  type="button"
                  className="editproductbtn cancel outlined"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <span className="editproducticon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="editproductbtn-text">Cancel</span>
                </button>

                {/* Save */}
                <button
                  type="submit"
                  className="editproductbtn add-product filled"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <span className="icon-box">
                    {saving ? (
                      <span style={{ fontSize: 12 }}>Saving...</span>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M7 10a5 5 0 0 1 10 0v2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                    )}
                  </span>
                  <span className="editproductbtn-text">
                    {saving ? "Saving..." : "Save Product"}
                  </span>
                </button>
              </div>
            </div>

            {/* Main content 2-column layout (left form, right sidebar) */}
            <div className="editproductadd-product-layout">
              <div className="editproductadd-left">
                {/* General Information */}
                <section className="editproductcard">
                  <h3 className="editproductcard-title">General Information</h3>
                  <div className="editproductform-row">
                    <lable className="editproductlabel">Product Name</lable>
                    <input
                      className="editproductinput"
                      placeholder="Product Name"
                      value={form.productName}
                      onChange={(e) =>
                        updateField("productName", e.target.value)
                      }
                    />
                  </div>

                  <div className="editproductform-row">
                    <lable className="editproductlabel">
                      Product Description
                    </lable>
                    <textarea
                      className="editproducttextarea"
                      placeholder="Type product description here…"
                      value={form.productDescription}
                      onChange={(e) =>
                        updateField("productDescription", e.target.value)
                      }
                      rows={5}
                    />
                  </div>
                </section>

                {/* Media (updated: default placeholder + centered Add Image) */}
                <section className="editproductcard">
                  <h3 className="editproductcard-title">Media</h3>

                  <div
                    className="editproductmedia-dropzone"
                    role="region"
                    aria-label="Product media"
                  >
                    {/* thumbnails (if present) */}
                    {form.images && form.images.length > 0 ? (
                      <div className="editproductthumbnails">
                        {form.images.map((src, i) => (
                          <div className="editproductthumb" key={i}>
                            <img
                              src={src}
                              alt={`product-${i}`}
                              onError={handleImageError}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        className="editproductmedia-inner"
                        aria-hidden="true"
                      >
                        {/* show an inline SVG placeholder when no images */}
                        <PlaceholderSVG />
                      </div>
                    )}

                    <div className="editproductmedia-note">
                      Drag and drop image here, or click add image
                    </div>

                    <button
                      type="editproductbutton"
                      className="editproductmedia-add-btn"
                      onClick={() => alert("Add image - implement file picker")}
                    >
                      Add Image
                    </button>
                  </div>
                </section>

                {/* Pricing */}
                <div className="editproductcard">
                  <h3 className="editproductcard-title">Pricing</h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: "3vw",
                    }}
                  >
                    <div className="editproductform-row">
                      <lable className="editproductlabel">Bacis Pricing</lable>
                      <input
                        className="editproductinput"
                        placeholder="$ Type base price here…"
                        value={form.basicPricing}
                        onChange={(e) =>
                          updateField("basicPricing", e.target.value)
                        }
                      />
                    </div>
                    <div className="editproductform-row two">
                      <lable className="editproductlabel">Discount</lable>
                      <select
                        className="editproductselect"
                        value={form.discountType}
                        onChange={(e) =>
                          updateField("discountType", e.target.value)
                        }
                      >
                        <option>Select Discount</option>
                        <option value="0%">0%</option>
                        <option value="10%">10%</option>
                        <option value="20%">20%</option>
                        <option value="30%">30%</option>
                        <option value="40%">40%</option>
                        <option value="50%">50%</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <section className="editproductcard">
                  <h3 className="editproductcard-title">Inventory</h3>
                  <div className="editproductform-row three">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "25vw",
                      }}
                    >
                      <lable className="editproductlabel">Product SKU</lable>
                      <input
                        className="editproductinput"
                        placeholder="SKU"
                        value={form.productSKU}
                        // onChange={(e) => updateField("productSKU", e.target.value)}
                        readOnly
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "25vw",
                      }}
                    >
                      <lable className="editproductlabel">
                        Product Barcode
                      </lable>

                      <input
                        className="editproductinput"
                        placeholder="Barcode"
                        value={form.productBarcode}
                        readOnly
                        // onChange={(e) => updateField("productBarcode", e.target.value)}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "25vw",
                      }}
                    >
                      <lable className="editproductlabel">
                        Product Quantity
                      </lable>
                      <input
                        className="editproductinput"
                        placeholder="Quantity"
                        value={form.productQuantity}
                        onChange={(e) =>
                          updateField("productQuantity", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </section>

                {/* Shipping */}
                <section className="editproductcard">
                  <h3 className="editproductcard-title">Shipping</h3>
                  <div className="editproductshipping-toggle">
                    <input type="checkbox" id="physical" defaultChecked />
                    <label htmlFor="physical">This is a physical product</label>
                  </div>

                  <div
                    className="editproductform-row four"
                    style={{ marginTop: 12 }}
                  >
                    <div style={{ width: "13vw" }}>
                      <input
                        className="editproductinput"
                        placeholder="Weight"
                        value={form.productWeight}
                        onChange={(e) =>
                          updateField("productWeight", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input
                        className="editproductinput"
                        placeholder="Height (cm)"
                        value={form.productHeight}
                        onChange={(e) =>
                          updateField("productHeight", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input
                        className="editproductinput"
                        placeholder="Length (cm)"
                        value={form.productLength}
                        onChange={(e) =>
                          updateField("productLength", e.target.value)
                        }
                      />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input
                        className="editproductinput"
                        placeholder="Width (cm)"
                        value={form.productWidth}
                        onChange={(e) =>
                          updateField("productWidth", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Right sidebar */}
              <div className="editproductadd-right">
                <div>
                  <section className="editproductcard sidebar-card">
                    <h3 className="editproductcard-title">Category</h3>
                    <label className="editproductlabel">Product Category</label>
                    <select
                      className="editproductselect"
                      value={form.productCategory}
                      onChange={(e) =>
                        updateField("productCategory", e.target.value)
                      }
                    >
                      <option>Earrings</option>
                      <option value="scrunchies">Scrunchies</option>
                      <option value="claws">Claws</option>
                      <option value="hairBows">Hair Bows</option>
                    </select>

                    <label
                      className="editproductlabel"
                      style={{ marginTop: 12 }}
                    >
                      Product Tags
                    </label>
                    <input
                      className="editproductinput"
                      placeholder="Product Tgas"
                      value={form.productTags}
                      onChange={(e) =>
                        updateField("productTags", e.target.value)
                      }
                    />
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
                </div>
                <div>
                  <section
                    className="editproductcard sidebar-card"
                    style={{ marginTop: 12 }}
                  >
                    <h3 className="editproductcard-title">Status</h3>
                    <label className="editproductlabel">Product Status</label>
                    <select
                      className="editproductselect"
                      value={form.productStatus}
                      onChange={(e) =>
                        updateField("productStatus", e.target.value)
                      }
                    >
                      <option value="inStock">In Stock</option>
                      <option value="lowStack">Low Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                      <option value="disscontinued">Discontinued</option>
                      <option value="draft">Draft</option>
                    </select>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
