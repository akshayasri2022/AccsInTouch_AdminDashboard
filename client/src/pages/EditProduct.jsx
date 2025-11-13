import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProductTopbar from "../components/ProductTopbar";
import axios from "axios";
import "../styles/AddProductForm.css";
import "../styles/EditProduct.css";

const LS_PROD_KEY = "pm_cached_products_v1";

function loadCachedProducts() {
  try {
    const raw = localStorage.getItem(LS_PROD_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to load cached products", e);
    return [];
  }
}
function saveCachedProducts(arr) {
  try {
    localStorage.setItem(LS_PROD_KEY, JSON.stringify(arr || []));
  } catch (e) {
    console.warn("Failed to save cached products", e);
  }
}
function upsertCachedProduct(item) {
  try {
    const arr = loadCachedProducts();
    const idx = arr.findIndex(p => String(p.id) === String(item.id));
    if (idx === -1) arr.unshift(item);
    else arr[idx] = { ...arr[idx], ...item };
    saveCachedProducts(arr);
  } catch (e) {
    console.warn("Failed to upsert cached product", e);
  }
}
function removeCachedProduct(id) {
  try {
    const arr = loadCachedProducts().filter(p => String(p.id) !== String(id));
    saveCachedProducts(arr);
  } catch (e) {
    console.warn("Failed to remove cached product", e);
  }
}
function sanitizeImageUrls(urls = []) {
  return (urls || []).filter(u => typeof u === "string" && (/^https?:\/\//i).test(u));
}

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const objectUrlsRef = useRef([]); // track object URLs to revoke on unmount

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
    image_url: [],
    discountType: "0%",
  });

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      try {
        const resp = await axios.get(
          `https://acc-in-touch-1.onrender.com/api/Product/${id}`,
          { timeout: 12000, signal: controller.signal }
        );
        const data = resp.data || {};

        // prefer locally cached pending update if present
        const cached = loadCachedProducts().find(p => String(p.id) === String(id));
        const final = cached && cached.__pendingUpdate ? { ...data, ...cached } : data;

        setForm({
          productName: final.productName || "",
          productDescription: final.productDescription || "",
          basicPricing:
            final.basicPricing !== undefined && final.basicPricing !== null
              ? String(final.basicPricing)
              : "",
          productSKU: final.productSKU || "",
          productBarcode: final.productBarcode || "",
          productQuantity:
            final.productQuantity !== undefined && final.productQuantity !== null
              ? String(final.productQuantity)
              : "",
          productCategory: final.productCategory || "",
          productStatus: final.productStatus || "draft",
          productWeight:
            final.productWeight !== undefined && final.productWeight !== null
              ? String(final.productWeight)
              : "",
          productHeight:
            final.productHeight !== undefined && final.productHeight !== null
              ? String(final.productHeight)
              : "",
          productLength:
            final.productLength !== undefined && final.productLength !== null
              ? String(final.productLength)
              : "",
          productWidth:
            final.productWidth !== undefined && final.productWidth !== null
              ? String(final.productWidth)
              : "",
          productTags:
            typeof final.productTags === "string"
              ? final.productTags
              : Array.isArray(final.productTags)
              ? final.productTags.join(", ")
              : "",
          image_url: Array.isArray(final.image_url) ? final.image_url : [],
          discountType: "0%",
        });
      } catch (err) {
        if (axios.isCancel(err) || err.name === "CanceledError") {
          console.log("Fetch canceled.");
        } else {
          console.error("Fetch product error:", err);
          // fallback to cached version if network fetch fails
          const cached = loadCachedProducts().find(p => String(p.id) === String(id));
          if (cached) {
            setForm({
              productName: cached.productName || "",
              productDescription: cached.productDescription || "",
              basicPricing: cached.basicPricing ? String(cached.basicPricing) : "",
              productSKU: cached.productSKU || "",
              productBarcode: cached.productBarcode || "",
              productQuantity: cached.productQuantity ? String(cached.productQuantity) : "",
              productCategory: cached.productCategory || "",
              productStatus: cached.productStatus || "draft",
              productWeight: cached.productWeight ? String(cached.productWeight) : "",
              productHeight: cached.productHeight ? String(cached.productHeight) : "",
              productLength: cached.productLength ? String(cached.productLength) : "",
              productWidth: cached.productWidth ? String(cached.productWidth) : "",
              productTags: typeof cached.productTags === "string" ? cached.productTags : "",
              image_url: Array.isArray(cached.image_url) ? cached.image_url : [],
              discountType: "0%",
            });
          } else {
            alert("Failed to load product. See console for details.");
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const list = (form.productTags || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setTags(list);
  }, [form.productTags]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => {
        try { URL.revokeObjectURL(url); } catch {}
      });
      objectUrlsRef.current = [];
    };
  }, []);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleImageError(e) {
    if (!e?.target) return;
    e.target.onerror = null;
    e.target.src = "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";
  }

  function onAddImageClick() {
    fileInputRef.current?.click();
  }

  function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files
      .map((f) => {
        try {
          const url = URL.createObjectURL(f);
          objectUrlsRef.current.push(url);
          return url;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    setForm((p) => ({ ...p, image_url: [...(p.image_url || []), ...previews] }));
    e.target.value = ""; // allow re-selecting same file
  }

  function handleRemoveImage(index) {
    setForm((p) => {
      const newUrls = (p.image_url || []).filter((_, i) => i !== index);
      return { ...p, image_url: newUrls };
    });
  }

  function removeTag(index) {
    const arr = tags.filter((_, i) => i !== index);
    setTags(arr);
    updateField("productTags", arr.join(", "));
  }

  const validateBeforeSend = () => {
    if (!form.productName?.trim()) {
      alert("Product name is required.");
      return false;
    }
    return true;
  };

 // ...existing code...
  async function handleSave(e) {
    e?.preventDefault?.();
    if (saving) return;
    if (!validateBeforeSend()) return;

    setSaving(true);

    // If user added local blob previews, warn and stop — blob:// URLs cannot be POSTed as-is
    const hasLocalBlobs = (form.image_url || []).some(u => typeof u === "string" && u.startsWith("blob:"));
    if (hasLocalBlobs) {
      alert(
        "You have local image previews selected. These are not uploaded automatically. " +
        "Remove them or upload real image URLs before saving."
      );
      setSaving(false);
      return;
    }

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
      // only send remote URLs
      image_url: sanitizeImageUrls(form.image_url),
    };

    // optimistic local cache so refresh shows edits
    upsertCachedProduct({ id, ...payload, __pendingUpdate: true, __updatedAt: Date.now() });

    console.log("Sending payload:", payload);

    try {
      const resp = await axios.put(
        `https://acc-in-touch-1.onrender.com/api/Product/${id}`,
        payload,
        { headers: { "Content-Type": "application/json" }, timeout: 20000 }
      );

      console.log("Update response:", resp?.status, resp?.data);

      if (resp && (resp.status === 200 || resp.status === 201)) {
        if (resp.data && typeof resp.data === "object") {
          const d = resp.data;
          setForm((prev) => ({
            ...prev,
            productName: d.productName ?? prev.productName,
            productDescription: d.productDescription ?? prev.productDescription,
            basicPricing:
              d.basicPricing !== undefined && d.basicPricing !== null
                ? String(d.basicPricing)
                : prev.basicPricing,
            productSKU: d.productSKU ?? prev.productSKU,
            productBarcode: d.productBarcode ?? prev.productBarcode,
            productQuantity:
              d.productQuantity !== undefined && d.productQuantity !== null
                ? String(d.productQuantity)
                : prev.productQuantity,
            productCategory: d.productCategory ?? prev.productCategory,
            productStatus: d.productStatus ?? prev.productStatus,
            productWeight:
              d.productWeight !== undefined && d.productWeight !== null
                ? String(d.productWeight)
                : prev.productWeight,
            productHeight:
              d.productHeight !== undefined && d.productHeight !== null
                ? String(d.productHeight)
                : prev.productHeight,
            productLength:
              d.productLength !== undefined && d.productLength !== null
                ? String(d.productLength)
                : prev.productLength,
            productWidth:
              d.productWidth !== undefined && d.productWidth !== null
                ? String(d.productWidth)
                : prev.productWidth,
            productTags:
              typeof d.productTags === "string"
                ? d.productTags
                : Array.isArray(d.productTags)
                ? d.productTags.join(", ")
                : prev.productTags,
            image_url: Array.isArray(d.image_url) ? d.image_url : prev.image_url,
          }));
        }

        // success — remove pending local cache and navigate
        removeCachedProduct(id);
        alert("Product updated successfully!");
        navigate("/ProductManagement");
        return;
      } else {
        alert(`Unexpected response: ${resp?.status}`);
      }
    } catch (err) {
      console.error("Update error (full):", err);

      if (err.response) {
        console.error("Server response data:", err.response.data);
        console.error("Server response status:", err.response.status);
        alert(`Update failed (${err.response.status}): ${JSON.stringify(err.response.data)} — changes saved locally.`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("No response from server. Changes saved locally and will remain until server sync.");
      } else {
        console.error("Request setup error:", err.message);
        alert(`Error: ${err.message}`);
      }
    } finally {
      // ensure UI state is always reset
      setSaving(false);
    }
  }
// ...existing code...

  function handleCancel() {
    if (saving) return;
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

  const PlaceholderSVG = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          <div className="editproductadd-product-container full-page">
            <div className="editproductedit-top-header" style={{ marginBottom: 12 }}>
              <div className="editproductedit-top-info">
                <h2 className="editproductedit-top-title" style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                  {form.productName || "Edit Product"}
                </h2>
                <p className="editproductedit-top-desc" style={{ margin: "6px 0 0 0", fontSize: 13, color: "#6b7280" }}>
                  {form.productDescription}
                </p>
              </div>
            </div>

            <div className="editproductadd-product-top top-v2">
              <div className="editproductbreadcrumb">
                <span
                  className="editproductcrumb-link"
                  style={{ color: "#4f46e5", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => navigate("/ProductManagement")}
                >
                  Product
                </span>
                <span className="editproductcrumb-sep">›</span>
                <span className="editproductcrumb-current">Edit Product</span>
              </div>

              <div className="editproducttop-buttons">
                <button type="button" className="editproductbtn cancel outlined" onClick={handleCancel} disabled={saving}>
                  <span className="editproducticon-circle">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="editproductbtn-text">Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="editproductbtn add-product filled"
                  disabled={saving}
                >
                  <span className="icon-box" aria-hidden>
                    {saving ? <span style={{ fontSize: 12 }}>●</span> : (
                      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
                        <path d="M7 10a5 5 0 0 1 10 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="4" y="10" width="16" height="10" rx="2" stroke="none" fill="currentColor" opacity="0.06" />
                        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
                      </svg>
                    )}
                  </span>

                  <span className="editproductbtn-text">{saving ? "Saving..." : "Save Product"}</span>
                </button>
              </div>
            </div>

            <form id="edit-product-form" onSubmit={handleSave} className="editproductadd-product-layout" style={{ gap: 20 }}>
              <div className="editproductadd-left">
                <section className="editproductcard">
                  <h3 className="editproductcard-title">General Information</h3>
                  <div className="editproductform-row">
                    <label className="editproductlabel">Product Name</label>
                    <input className="editproductinput" placeholder="Product Name" value={form.productName} onChange={(e) => updateField("productName", e.target.value)} disabled={saving} />
                  </div>

                  <div className="editproductform-row">
                    <label className="editproductlabel">Product Description</label>
                    <textarea className="editproducttextarea" placeholder="Type product description here…" value={form.productDescription} onChange={(e) => updateField("productDescription", e.target.value)} rows={5} disabled={saving} />
                  </div>
                </section>

                <section className="editproductcard">
                  <h3 className="editproductcard-title">Media</h3>

                  <div className="editproductmedia-dropzone" role="region" aria-label="Product media">
                    {form.image_url && form.image_url.length > 0 ? (
                      <div className="editproductthumbnails">
                        {form.image_url.map((src, i) => (
                          <div className="editproductthumb" key={i}>
                            <img src={src} alt={`product-${i}`} onError={handleImageError} />
                            <button type="button" className="editproductthumb-remove" onClick={() => handleRemoveImage(i)} aria-label={`Remove image ${i + 1}`}>
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="editproductmedia-inner" aria-hidden="true">
                        <PlaceholderSVG />
                      </div>
                    )}

                    <div className="editproductmedia-note">Drag and drop image here, or click add image</div>

                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} multiple onChange={handleFilesSelected} />
                    <button type="button" className="editproductmedia-add-btn" onClick={onAddImageClick} disabled={saving}>
                      Add Image
                    </button>
                  </div>
                </section>

                <div className="editproductcard">
                  <h3 className="editproductcard-title">Pricing</h3>
                  <div style={{ display: "flex", flexDirection: "row", gap: "3vw", alignItems: "flex-start" }}>
                    <div className="editproductform-row" style={{ minWidth: 200 }}>
                      <label className="editproductlabel">Basic Pricing</label>
                      <input className="editproductinput" placeholder="$ Type base price here…" value={form.basicPricing} onChange={(e) => updateField("basicPricing", e.target.value)} disabled={saving} />
                    </div>

                    <div className="editproductform-row two" style={{ minWidth: 160 }}>
                      <label className="editproductlabel">Discount</label>
                      <select className="editproductselect" value={form.discountType} onChange={(e) => updateField("discountType", e.target.value)} disabled={saving}>
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

                <section className="editproductcard">
                  <h3 className="editproductcard-title">Inventory</h3>
                  <div className="editproductform-row three">
                    <div style={{ display: "flex", flexDirection: "column", width: "25vw" }}>
                      <label className="editproductlabel">Product SKU</label>
                      <input className="editproductinput" placeholder="SKU" value={form.productSKU} readOnly />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", width: "25vw" }}>
                      <label className="editproductlabel">Product Barcode</label>
                      <input className="editproductinput" placeholder="Barcode" value={form.productBarcode} readOnly />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", width: "25vw" }}>
                      <label className="editproductlabel">Product Quantity</label>
                      <input className="editproductinput" placeholder="Quantity" value={form.productQuantity} onChange={(e) => updateField("productQuantity", e.target.value)} disabled={saving} />
                    </div>
                  </div>
                </section>

                <section className="editproductcard">
                  <h3 className="editproductcard-title">Shipping</h3>
                  <div className="editproductshipping-toggle">
                    <input type="checkbox" id="physical" defaultChecked />
                    <label htmlFor="physical">This is a physical product</label>
                  </div>

                  <div className="editproductform-row four" style={{ marginTop: 12 }}>
                    <div style={{ width: "13vw" }}>
                      <input className="editproductinput" placeholder="Weight" value={form.productWeight} onChange={(e) => updateField("productWeight", e.target.value)} disabled={saving} />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input className="editproductinput" placeholder="Height (cm)" value={form.productHeight} onChange={(e) => updateField("productHeight", e.target.value)} disabled={saving} />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input className="editproductinput" placeholder="Length (cm)" value={form.productLength} onChange={(e) => updateField("productLength", e.target.value)} disabled={saving} />
                    </div>
                    <div style={{ width: "13vw" }}>
                      <input className="editproductinput" placeholder="Width (cm)" value={form.productWidth} onChange={(e) => updateField("productWidth", e.target.value)} disabled={saving} />
                    </div>
                  </div>
                </section>
              </div>

              <div className="editproductadd-right">
                <div>
                  <section className="editproductcard sidebar-card">
                    <h3 className="editproductcard-title">Category</h3>
                    <label className="editproductlabel">Product Category</label>
                    <select className="editproductselect" value={form.productCategory} onChange={(e) => updateField("productCategory", e.target.value)} disabled={saving}>
                      <option value="">Select category</option>
                      <option value="earrings">Earrings</option>
                      <option value="scrunchies">Scrunchies</option>
                      <option value="claws">Claws</option>
                      <option value="hairBows">Hair Bows</option>
                    </select>

                    <label className="editproductlabel" style={{ marginTop: 12 }}>Product Tags</label>
                    <input className="editproductinput" placeholder="tag1, tag2" value={form.productTags} onChange={(e) => updateField("productTags", e.target.value)} disabled={saving} />

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {tags.map((t, i) => (
                        <div key={i} style={{ background: "#f3f0ff", padding: "6px 8px", borderRadius: 8, fontWeight: 700, color: "#6d28d9", display: "flex", alignItems: "center", gap: 6 }}>
                          {t}
                          <button type="button" onClick={() => removeTag(i)} style={{ border: "none", background: "transparent", cursor: "pointer", fontWeight: 700, color: "#6d28d9", padding: 0 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div>
                  <section className="editproductcard sidebar-card" style={{ marginTop: 12 }}>
                    <h3 className="editproductcard-title">Status</h3>
                    <label className="editproductlabel">Product Status</label>
                    <select className="editproductselect" value={form.productStatus} onChange={(e) => updateField("productStatus", e.target.value)} disabled={saving}>
                      <option value="inStock">In Stock</option>
                      <option value="lowStock">Low Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                      <option value="discontinued">Discontinued</option>
                      <option value="draft">Draft</option>
                    </select>
                  </section>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}