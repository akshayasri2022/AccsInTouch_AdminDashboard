// src/components/ProductTable.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Product.css";

/* sample data — replace with API data later */
const SAMPLE = [
  { id: 1, title: "Handmade Pouch", sku: "302012", category: "Bag & Pouch", stock: 10, price: "$121.00", status: "Low Stock", added: "29 Dec 2022", variants: 3 },
  { id: 2, title: "Smartwatch E2", sku: "302011", category: "Watch", stock: 204, price: "$590.00", status: "Published", added: "24 Dec 2022", variants: 2 },
  { id: 3, title: "Smartwatch E1", sku: "302002", category: "Watch", stock: 48, price: "$125.00", status: "Draft", added: "12 Dec 2022", variants: 3 },
  { id: 4, title: "Headphone G1 Pro", sku: "301901", category: "Audio", stock: 401, price: "$348.00", status: "Published", added: "21 Oct 2022", variants: 1 },
  { id: 5, title: "Iphone X", sku: "301900", category: "Smartphone", stock: 120, price: "$607.00", status: "Published", added: "21 Oct 2022", variants: 4 },
  { id: 6, title: "Puma Shoes", sku: "301881", category: "Shoes", stock: 432, price: "$234.00", status: "Published", added: "21 Oct 2022", variants: 3 },
  { id: 7, title: "Logic+ Wireless Mouse", sku: "301848", category: "Mouse", stock: 0, price: "$760.00", status: "Low Stock", added: "19 Sep 2022", variants: 1 },
  { id: 8, title: "Nike Shoes", sku: "301800", category: "Shoes", stock: 347, price: "$400.00", status: "Published", added: "19 Sep 2022", variants: 3 },
  { id: 9, title: "Lego Car", sku: "301555", category: "Toys", stock: 299, price: "$812.00", status: "Published", added: "19 Sep 2022", variants: 2 },
  { id: 10, title: "PS Wireless Controller", sku: "301002", category: "Beauty", stock: 38, price: "$123.00", status: "Draft", added: "10 Aug 2022", variants: 3 },
];

function StatusBadge({ status }) {
  if (status === "Published") return <span className="badge published">{status}</span>;
  if (status === "Draft") return <span className="badge draft">{status}</span>;
  return <span className="badge lowstock">{status}</span>;
}

export default function ProductTable({ search = "", tab = "all", rightSearch = "" }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 8;

  // filter sample data by props
  const filtered = useMemo(() => {
    let data = SAMPLE.slice();
    if (tab === "published") data = data.filter(d => d.status === "Published");
    if (tab === "lowstock") data = data.filter(d => d.status === "Low Stock");
    if (tab === "draft") data = data.filter(d => d.status === "Draft");
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(d => d.title.toLowerCase().includes(q) || d.sku.toLowerCase().includes(q));
    }
    if (rightSearch) {
      const q = rightSearch.toLowerCase();
      data = data.filter(d => d.title.toLowerCase().includes(q) || d.sku.toLowerCase().includes(q));
    }
    return data;
  }, [search, tab, rightSearch]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = (e) => e.target.checked ? setSelected(filtered.map(f => f.id)) : setSelected([]);

  // navigate to edit page (kebab-case route)
  const handleEdit = (id) => {
    navigate(`/productManagement/edit/${id}`);
  };

  const handleView = (id) => {
    // if you have a view route, navigate to it. For now we'll console and you can implement later.
    // navigate(`/product-management/view/${id}`);
    console.log("View product", id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // Replace with API call or state update. For now show alert.
      alert("Deleted (mock) product " + id);
    }
  };

  return (
    <div className="product-table-panel panel">
      <table className="product-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} /></th>
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
          {paged.map(p => (
            <tr key={p.id}>
              <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} /></td>

              <td className="prod-cell">
                <div className="prod-thumb" />
                <div className="prod-meta">
                  <div className="prod-title">{p.title}</div>
                  <div className="prod-sub">{p.variants} Variants</div>
                </div>
              </td>

              <td className="mono">{p.sku}</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>
              <td>{p.price}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="mono">{p.added}</td>

              <td className="actions" style={{ justifyContent: "flex-end" }}>
                <button type="button" title="View" className="icon-btn" onClick={() => handleView(p.id)}><FaEye /></button>
                <button type="button" title="Edit" className="icon-btn" onClick={() => handleEdit(p.id)}><FaEdit /></button>
                <button type="button" title="Delete" className="icon-btn danger" onClick={() => handleDelete(p.id)}><FaTrash /></button>
              </td>
            </tr>
          ))}

          {paged.length === 0 && (
            <tr><td colSpan="9" style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>No products found</td></tr>
          )}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="pager-info">Showing { (page-1)*perPage + 1 }–{ Math.min(page*perPage, filtered.length) } of {filtered.length}</div>
        <div className="pager">
          <button className="page" onClick={() => setPage(p => Math.max(1, p-1))}>«</button>
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={`page ${page === i+1 ? "active" : ""}`} onClick={() => setPage(i+1)}>{i+1}</button>
          ))}
          <button className="page" onClick={() => setPage(p => Math.min(pages, p+1))}>»</button>
        </div>
      </div>
    </div>
  );
}
