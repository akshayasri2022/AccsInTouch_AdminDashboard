// src/components/ProductTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Product.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductTable({
  products: productsProp = null,
  search = "",
  tab = "all",
  rightSearch = "",
}) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // --- View details modal state ---
  const [viewProduct, setViewProduct] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    if (Array.isArray(productsProp)) {
      setProducts(productsProp);
      return;
    }
    let canceled = false;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/Product`
        );
        if (canceled) return;
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      canceled = true;
    };
  }, [productsProp]);

  const combinedTokens = useMemo(() => {
    const combined = `${search || ""} ${rightSearch || ""}`.trim().toLowerCase();
    return combined ? combined.split(/\s+/).filter(Boolean) : [];
  }, [search, rightSearch]);

  const getQuantityValue = (d) => {
    const candidates = [
      d.productQuantity,
      d.quantity,
      d.stock,
      d.qty,
      d.product_qty,
      d.count,
    ];
    for (const c of candidates) {
      if (c === undefined || c === null || c === "") continue;
      const n = Number(c);
      if (!Number.isNaN(n)) return n;
    }
    return 0;
  };

  const normalizeStatus = (raw) => {
    if (raw === undefined || raw === null) return "";
    if (typeof raw === "boolean") return raw ? "In Stock" : "Draft";
    if (typeof raw === "object") {
      if (raw.published === true) return "In Stock";
      if (raw.draft === true) return "Draft";
    }
    const s = String(raw).trim().toLowerCase();
    
    // Map backend status to display status
    if (s === "instock" || s === "in_stock" || s === "in stock") {
      return "In Stock";
    }
    if (s === "lowstock" || s === "low_stock" || s === "low stock") {
      return "Low Stock";
    }
    if (s === "outofstock" || s === "out_of_stock" || s === "out of stock") {
      return "Out of Stock";
    }
    if (s === "discontinued") {
      return "Discontinued";
    }
    if (s === "draft") {
      return "Draft";
    }
    
    // Return original with proper casing if no match
    return raw.toString().split(/(?=[A-Z])/).join(' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filtered = useMemo(() => {
    let data = (products || []).slice();

    const getName = (d) => String(d.productName ?? d.name ?? "").toLowerCase();
    const getSKU = (d) => String(d.productSKU ?? d.sku ?? "").toLowerCase();

    const wantTab = String(tab || "all").trim().toLowerCase();

    data = data.filter((d) => {
      const quantity = getQuantityValue(d);
      const statusNormalized = normalizeStatus(
        d.productStatus ?? d.status ?? d.state ?? d
      );

      if (wantTab === "instock" || wantTab === "in stock" || wantTab === "in_stock") {
        if (statusNormalized !== "In Stock") return false;
      } else if (
        wantTab === "lowstock" ||
        wantTab === "low-stock" ||
        wantTab === "low stock"
      ) {
        if (statusNormalized !== "Low Stock") return false;
      } else if (wantTab === "outofstock" || wantTab === "out of stock" || wantTab === "out_of_stock") {
        if (statusNormalized !== "Out of Stock") return false;
      } else if (wantTab === "discontinued") {
        if (statusNormalized !== "Discontinued") return false;
      } else if (wantTab === "draft") {
        if (statusNormalized !== "Draft") return false;
      }
      return true;
    });

    if (combinedTokens.length > 0) {
      data = data.filter((d) =>
        combinedTokens.every((t) => {
          return getName(d).includes(t) || getSKU(d).includes(t);
        })
      );
    }

    return data;
  }, [products, tab, combinedTokens]);

  useEffect(() => {
    setPage(1);
  }, [search, rightSearch, tab, productsProp]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]);

  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = (e) =>
    e.target.checked
      ? setSelected(filtered.map((f) => f.id ?? f._id ?? f.productSKU))
      : setSelected([]);

  const handleEdit = (id) => {
    navigate(`/productManagement/edit/${id}`);
  };

  // handleView: open modal with full product details (uses local product if available)
  const handleView = (id) => {
    const found = products.find(
      (p) => String(p.id ?? p._id ?? p.productSKU) === String(id)
    );
    if (found) {
      setViewProduct(found);
      setShowViewModal(true);
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/Product/${id}`)
        .then((res) => {
          setViewProduct(res.data || null);
          setShowViewModal(true);
        })
        .catch((err) => {
          console.error("Failed to fetch product details:", err);
          toast.error("Failed to load product details.");
        });
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/Product/${deleteId}`
      );
      setProducts((prev) =>
        prev.filter((p) => {
          const pid = p.id ?? p._id ?? p.productSKU;
          return String(pid) !== String(deleteId);
        })
      );
      toast.success("✅ Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete product.");
    } finally {
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  // helper to format numbers or show '—'
  const displayOrDash = (v) => (v === undefined || v === null || v === "" ? "—" : v);

  return (
    <div className="product-table-panel panel">
      {loading ? (
        <p style={{ padding: 20, textAlign: "center" }}>Loading products...</p>
      ) : error ? (
        <p style={{ padding: 20, textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <>
          <table
            className="product-table improved"
            role="table"
            aria-label="Products table"
          >
            <thead>
              <tr>
                <th className="col-check" scope="col">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={toggleAll}
                      checked={
                        selected.length > 0 &&
                        filtered.length > 0 &&
                        selected.length === filtered.length
                      }
                      aria-label="Select all visible"
                    />
                  </div>
                </th>

                <th className="col-product" scope="col">
                  <span className="th-title">Product</span>
                </th>

                <th className="col-sku" scope="col">
                  <span className="th-title">SKU</span>
                </th>

                <th className="col-category" scope="col">
                  <span className="th-title">Category</span>
                </th>

                <th className="col-stock" scope="col">
                  <span className="th-title">Stock</span>
                </th>

                <th className="col-price" scope="col">
                  <span className="th-title">Price</span>
                </th>

                <th className="col-status" scope="col">
                  <span className="th-title">Status</span>
                </th>

                <th className="col-added" scope="col">
                  <span className="th-title">Added</span>
                </th>

                <th className="col-action" scope="col">
                  <div style={{ textAlign: "right" }}>
                    <span className="th-title">Action</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {paged.map((p) => {
                const pid =
                  p.id ?? p._id ?? p.productSKU ?? `${p.productName}-${Math.random()}`;
                const quantity = getQuantityValue(p);
                const statusNormalized = normalizeStatus(
                  p.productStatus ?? p.status ?? p.state ?? p
                );
                const thumb =
                  Array.isArray(p.image_url) && p.image_url.length ? p.image_url[0] : null;

                return (
                  <tr key={pid} className="product-row" role="row">
                    <td className="col-check" role="cell" style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selected.includes(pid)}
                        onChange={() => toggle(pid)}
                        aria-label={`Select product ${p.productName}`}
                      />
                    </td>

                    <td className="col-product prod-cell" role="cell">
                      <div
                        className="prod-thumb"
                        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                        aria-hidden
                      />
                      <div className="prod-meta">
                        <div className="prod-title" title={p.productName}>
                          {p.productName}
                        </div>
                        <div className="prod-sku">{p.productSKU ? `SKU: ${p.productSKU}` : "—"}</div>
                      </div>
                    </td>

                    <td className="col-sku mono" role="cell">
                      {p.productSKU || "—"}
                    </td>
                    <td className="col-category" role="cell">
                      {p.productCategory || "—"}
                    </td>
                    <td className="col-stock" role="cell">
                      {Number.isFinite(quantity) ? quantity : "—"}
                    </td>
                    <td className="col-price" role="cell">
                      {p.basicPricing !== undefined ? `₹${p.basicPricing}` : "—"}
                    </td>
                    <td className="col-status" role="cell">
                      <span className={`status-badge ${statusNormalized.toLowerCase().replace(/\s+/g, '-')}`}>
                        {statusNormalized || (p.productStatus ?? "—")}
                      </span>
                    </td>
                    <td className="col-added mono" role="cell">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>

                    <td
                      className="col-action actions"
                      role="cell"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <div style={{ display: "inline-flex", gap: 8 }}>
                        <button
                          type="button"
                          title="View"
                          className="icon-btn"
                          onClick={() => handleView(pid)}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          className="icon-btn"
                          onClick={() => handleEdit(pid)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          className="icon-btn danger"
                          onClick={() => handleDelete(pid)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paged.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            <div className="pager-info">
              Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </div>
            <div className="pager">
              <button
                className="page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                «
              </button>
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  className={`page ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page"
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete confirm modal */}
      {showModal && (
        <div className="productmodal-overlay">
          <div className="productmodal-content">
            <h4>Are you sure you want to delete this product?</h4>
            <div className="productmodal-actions">
              <button className="productbtn confirm" onClick={confirmDelete}>
                Yes
              </button>
              <button className="productbtn cancel" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal — now with only one Close button (no Edit) */}
      {showViewModal && viewProduct && (
        <div
          className="productmodal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Details for ${viewProduct.productName}`}
        >
          <div
            className="productmodal-content"
            style={{ maxWidth: 900, width: "94%", borderRadius: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{viewProduct.productName || "Product details"}</h3>
              {/* header area intentionally left without a Close button */}
              <div aria-hidden />
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ minWidth: 180, maxWidth: 360 }}>
                <div
                  style={{
                    width: 320,
                    maxWidth: "100%",
                    height: 220,
                    borderRadius: 8,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: "#f3f3f3",
                    border: "1px solid rgba(15,23,42,0.04)",
                  }}
                >
                  <img
                    src={
                      Array.isArray(viewProduct.image_url) && viewProduct.image_url.length
                        ? viewProduct.image_url[0]
                        : "https://cdn-icons-png.flaticon.com/512/7486/7486744.png"
                    }
                    alt={viewProduct.productName || "product image"}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";
                    }}
                  />
                </div>

                {Array.isArray(viewProduct.image_url) && viewProduct.image_url.length > 1 && (
                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {viewProduct.image_url.slice(0, 6).map((u, i) => (
                      <img
                        key={i}
                        src={u}
                        alt={`thumb-${i}`}
                        style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(0,0,0,0.04)" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ marginBottom: 12, color: "#6b7280" }}>
                  {viewProduct.productDescription || "No description provided."}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>SKU</div>
                    <div style={{ fontWeight: 700 }}>{displayOrDash(viewProduct.productSKU)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Barcode</div>
                    <div style={{ fontWeight: 700 }}>{displayOrDash(viewProduct.productBarcode)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Category</div>
                    <div style={{ fontWeight: 700 }}>{displayOrDash(viewProduct.productCategory)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Stock</div>
                    <div style={{ fontWeight: 700 }}>{displayOrDash(viewProduct.productQuantity ?? viewProduct.stock ?? "—")}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Price</div>
                    <div style={{ fontWeight: 700 }}>{viewProduct.basicPricing !== undefined ? `₹${viewProduct.basicPricing}` : "—"}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Status</div>
                    <div style={{ fontWeight: 700 }}>{normalizeStatus(viewProduct.productStatus ?? viewProduct.status ?? "—")}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Weight</div>
                    <div style={{ fontWeight: 700 }}>{displayOrDash(viewProduct.productWeight)}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Dimensions (H×L×W cm)</div>
                    <div style={{ fontWeight: 700 }}>
                      {`${displayOrDash(viewProduct.productHeight)} × ${displayOrDash(viewProduct.productLength)} × ${displayOrDash(viewProduct.productWidth)}`}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Tags</div>
                    <div style={{ fontWeight: 700 }}>
                      {Array.isArray(viewProduct.productTags) ? viewProduct.productTags.join(", ") : (viewProduct.productTags || "—")}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Created</div>
                    <div style={{ fontWeight: 700 }}>{viewProduct.createdAt ? new Date(viewProduct.createdAt).toLocaleString() : "—"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Single Close button (only one) */}
            <div
              style={{
                marginTop: 18,
                color: "#6b7280",
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                style={{
                  background: "linear-gradient(180deg,#5b6bff,#6b4fff)",
                  color: "#ffffff",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(75,107,255,0.12)",
                }}
                onClick={() => {
                  setShowViewModal(false);
                  setViewProduct(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}