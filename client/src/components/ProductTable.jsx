// src/components/ProductTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Product.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductTable({
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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          "https://acc-in-touch-1.onrender.com/api/Product"
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Apply filters
  const filtered = useMemo(() => {
    let data = products.slice();

    if (tab === "published")
      data = data.filter((d) => d.status === "Published");
    if (tab === "lowstock")
      data = data.filter((d) => d.stock < 10 || d.status === "Low Stock");
    if (tab === "draft") data = data.filter((d) => d.status === "Draft");

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) || d.sku?.toLowerCase().includes(q)
      );
    }

    if (rightSearch) {
      const q = rightSearch.toLowerCase();
      data = data.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) || d.sku?.toLowerCase().includes(q)
      );
    }

    return data;
  }, [products, search, tab, rightSearch]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggle = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  const toggleAll = (e) =>
    e.target.checked ? setSelected(filtered.map((f) => f.id)) : setSelected([]);

  // navigate to edit page (kebab-case route)
  const handleEdit = (id) => {
    navigate(`/productManagement/edit/${id}`);
  };

  const handleView = (id) => {
    console.log("View product:", id);
    // navigate(`/productManagement/view/${id}`);
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this product?")) {
  //     try {
  //       await axios.delete(
  //         `https://acc-in-touch-1.onrender.com/api/Product/${id}`
  //       );
  //       setProducts((prev) => prev.filter((p) => p.id !== id));
  //       alert("Product deleted successfully!");
  //     } catch (err) {
  //       console.error("Delete failed:", err);
  //       alert("Failed to delete product.");
  //     }
  //   }
  // };

  const handleDelete = (id) => {
  setDeleteId(id);
  setShowModal(true);
};

const confirmDelete = async () => {
  try {
    await axios.delete(`https://acc-in-touch-1.onrender.com/api/Product/${deleteId}`);
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
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

  return (
    <div className="product-table-panel panel">
      {/* {loading ? (
        <p style={{ padding: 20, textAlign: "center" }}>Loading products...</p>
      )
       : error ? (
        <p style={{ padding: 20, textAlign: "center", color: "red" }}>
          {error}
        </p>
      ) : ( */}
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                  />
                </th>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Added</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {paged.map((p) => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggle(p.id)}
                    />
                  </td>

                  <td className="prod-cell">
                    <div className="prod-thumb" />
                    <div className="prod-meta">
                      <div className="prod-title">{p.productName}</div>
                      {/* <div className="prod-sub">{p.variants || 1} Variants</div> */}
                    </div>
                  </td>

                  <td className="mono">{p.productSKU}</td>
                  <td>{p.productCategory || "—"}</td>
                  <td>{p.productQuantity}</td>
                  <td>${p.basicPricing}</td>
                  <td>
                    {/* <StatusBadge productStatus= */}
                    {p.productStatus} 
                    {/* /> */}  
                  </td>
                  <td className="mono">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  <td
                    className="actions"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <button
                      type="button"
                      title="View"
                      className="icon-btn"
                      onClick={() => handleView(p.id)}
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      title="Edit"
                      className="icon-btn"
                      onClick={() => handleEdit(p.id)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="icon-btn danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    style={{
                      padding: 24,
                      textAlign: "center",
                      color: "#6b7280",
                    }}
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="table-footer">
            <div className="pager-info">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </div>
            <div className="pager">
              <button
                className="page"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              >
                »
              </button>
            </div>
          </div>
        </>
      {/* )} */}
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
<ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
