import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomerTopbar from "../components/CustomerTopbar";
import "../styles/CustomerManagement.css";

/* Mock customers for fallback */
const MOCK_CUSTOMERS = Array.from({ length: 20 }).map((_, i) => {
  const names = [
    "Linda Blair","John Bushmill","Laura Prichet",
    "Mohammad Karim","Tracy Williams","Bryan Barker"
  ];
  const name = names[i % names.length];
  const status = i % 7 === 0 ? "Blocked" : "Active";
  return {
    id: 1000 + i,
    name,
    avatar: `https://i.pravatar.cc/160?img=${(i % 70) + 1}`,
    orders: Math.floor(Math.random() * 50) + 1,
    balance: `$${(Math.random() * 10000).toFixed(0)}`,
    status,
    email: `${name.toLowerCase().replace(/\s+/g, "")}@mail.com`,
    address: "1833 Bel Meadow Drive, Fontana, California 92335, USA",
    phone: "050 414 8778",
    lastTransaction: "12 December 2022",
    lastOnline: "1 Day Ago",
  };
});

const API_BASE = "http://localhost:25186/api/customer";

/* ---------------- Profile Modal (GET one, PUT, DELETE via axios) ---------------- */
function CustomerModal({ id, onClose, onUpdated, onDeleted }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let mounted = true;
    async function fetchOne() {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        if (!mounted) return;
        const data = res.data;
        setCustomer(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error("GET /customer/:id failed:", err);
        const fallback = MOCK_CUSTOMERS.find((c) => String(c.id) === String(id));
        if (fallback && mounted) {
          setCustomer(fallback);
          setForm({
            name: fallback.name || "",
            email: fallback.email || "",
            phone: fallback.phone || "",
            address: fallback.address || "",
          });
        } else {
          alert("Failed to load customer details.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (id != null) fetchOne();
    return () => { mounted = false; };
  }, [id]);

  if (!id) return null;
  if (loading) return (
    <div className="cm-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-body">Loading...</div>
      </div>
    </div>
  );
  if (!customer) return null;

  async function handleDelete() {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await axios.delete(`${API_BASE}/${customer.id}`);
      onDeleted(customer.id);
      onClose();
    } catch (err) {
      console.error("DELETE failed:", err);
      // fallback: remove locally
      onDeleted(customer.id);
      onClose();
      alert("API delete failed — removed locally.");
    }
  }

  async function handleUpdate(ev) {
    ev.preventDefault();
    if (!form.name.trim() || !form.email.includes("@")) {
      alert("Please provide a valid name and email.");
      return;
    }

    try {
      const res = await axios.put(`${API_BASE}/${customer.id}`, {
        ...customer,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
      });
      const updated = res.data;
      setCustomer(updated);
      setEditMode(false);
      onUpdated(updated);
    } catch (err) {
      console.error("PUT failed:", err);
      // fallback: update locally
      const fallback = { ...customer, name: form.name, email: form.email, phone: form.phone, address: form.address };
      setCustomer(fallback);
      onUpdated(fallback);
      setEditMode(false);
      alert("Could not update via API — updated locally.");
    }
  }

  return (
    <div className="cm-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cm-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="cm-header">
          <div className="cm-banner" />
          <div className="cm-avatar-large-wrap">
            <img src={customer.avatar} alt={customer.name} className="cm-avatar-large" />
          </div>
        </div>

        <div className="cm-body">
          {!editMode ? (
            <>
              <h3 className="cm-name">{customer.name}</h3>
              <div className={`cm-status ${customer.status?.toLowerCase() || "active"}`}>{customer.status || "Active"}</div>

              <hr className="cm-sep" />

              <ul className="cm-info-list">
                <li>
                  <span className="cm-icon">📇</span>
                  <div>
                    <div className="cm-info-title">Customer ID</div>
                    <div className="cm-info-sub">ID-{String(customer.id).padStart(6, "0")}</div>
                  </div>
                </li>

                <li>
                  <span className="cm-icon">✉️</span>
                  <div>
                    <div className="cm-info-title">E-mail</div>
                    <div className="cm-info-sub">{customer.email}</div>
                  </div>
                </li>

                <li>
                  <span className="cm-icon">📍</span>
                  <div>
                    <div className="cm-info-title">Address</div>
                    <div className="cm-info-sub">{customer.address}</div>
                  </div>
                </li>

                <li>
                  <span className="cm-icon">📞</span>
                  <div>
                    <div className="cm-info-title">Phone Number</div>
                    <div className="cm-info-sub">{customer.phone}</div>
                  </div>
                </li>

                <li>
                  <span className="cm-icon">🧾</span>
                  <div>
                    <div className="cm-info-title">Last Transaction</div>
                    <div className="cm-info-sub">{customer.lastTransaction}</div>
                  </div>
                </li>

                <li>
                  <span className="cm-icon">⏱️</span>
                  <div>
                    <div className="cm-info-title">Last Online</div>
                    <div className="cm-info-sub">{customer.lastOnline}</div>
                  </div>
                </li>
              </ul>

              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14 }}>
                <button className="cm-btn ghost cancel" onClick={() => setEditMode(true)}>Edit</button>
                <button className="cm-btn add-action" onClick={handleDelete}>Delete</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <h3 className="cm-name">Edit Customer</h3>

              <div style={{ textAlign: "left", marginTop: 10 }}>
                <label className="label">Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />

                <label className="label" style={{ marginTop: 8 }}>Email</label>
                <input className="form-input" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />

                <label className="label" style={{ marginTop: 8 }}>Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />

                <label className="label" style={{ marginTop: 8 }}>Address</label>
                <input className="form-input" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button type="button" className="cm-btn ghost cancel" onClick={() => setEditMode(false)}>Cancel</button>
                  <button type="submit" className="cm-btn add-action">Save</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Add Customer Modal (axios.post) ---------------- */
function AddCustomerModal({ onClose, onAdd }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phone, setPhone] = useState("");
  const [addAddress, setAddAddress] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [sameBilling, setSameBilling] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!email.trim() || !email.includes("@")) e.email = "Valid email required";
    return e;
  }

  async function submit(ev) {
    ev.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      avatar: `https://i.pravatar.cc/160?img=${Math.floor(Math.random() * 70) + 1}`,
      orders: 0,
      balance: "$0",
      status: "Active",
      email: email.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      address: addAddress ? `${street} ${city} ${stateVal} ${country}` : "",
      lastTransaction: "-",
      lastOnline: "Now",
    };

    try {
      const res = await axios.post(API_BASE, payload);
      const created = res.data;
      onAdd(created);
      onClose();
    } catch (err) {
      console.error("POST failed:", err);
      const id = Math.floor(Math.random() * 100000) + 2000;
      const fallback = { id, ...payload };
      onAdd(fallback);
      onClose();
      alert("Could not reach API — customer added locally.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cm-add-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="cm-add-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cm-close" onClick={onClose} aria-label="Close">✕</button>
        <h3 className="add-modal-title">Add a New Customer</h3>

        <form className="add-modal-form" onSubmit={submit} noValidate>
          <label className="label">Customer Information</label>

          <div className="form-row">
            <input className={`form-input ${errors.name ? "input-error" : ""}`} value={name} onChange={(e)=>setName(e.target.value)} placeholder="Customer Name" />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-row">
            <input className={`form-input ${errors.email ? "input-error" : ""}`} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Customer Email" />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="phone-row">
            <select className="country-select" value={countryCode} onChange={(e)=>setCountryCode(e.target.value)}>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
              <option value="+234">+234</option>
            </select>
            <input className="form-input phone-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="8023456789" />
          </div>

          <label className="label toggle-row">
            <span>Add Address</span>
            <input type="checkbox" checked={addAddress} onChange={(e)=>setAddAddress(e.target.checked)} />
          </label>

          {addAddress && (
            <>
              <div className="form-row">
                <input className="form-input" value={street} onChange={(e)=>setStreet(e.target.value)} placeholder="Building No., Street Address" />
              </div>
              <div className="form-row">
                <input className="form-input" value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" />
              </div>
              <div className="form-row form-grid">
                <select className="form-input" value={country} onChange={(e)=>setCountry(e.target.value)}>
                  <option value="">Country</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>India</option>
                </select>
                <select className="form-input" value={stateVal} onChange={(e)=>setStateVal(e.target.value)}>
                  <option value="">State</option>
                  <option>CA</option>
                  <option>NY</option>
                </select>
              </div>
            </>
          )}

          <label className="label toggle-row small">
            <span>Billing Address</span>
            <label className="small-toggle">
              <input type="checkbox" checked={sameBilling} onChange={(e)=>setSameBilling(e.target.checked)} />
              <span>Same as Customer Address</span>
            </label>
          </label>

          <div className="modal-actions">
            <button type="button" className="cm-btn ghost cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="cm-btn add-action" disabled={submitting}>{submitting ? "Adding..." : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Main Page (card grid) ---------------- */
export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]); // loaded from API
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8; // 4 per row x 2 rows
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [profileOpenId, setProfileOpenId] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const gridRef = useRef(null);

  async function fetchCustomers() {
    try {
      const res = await axios.get(API_BASE);
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("GET /customer failed:", err);
      setCustomers(MOCK_CUSTOMERS);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (tab === "Active" && c.status !== "Active") return false;
      if (tab === "Blocked" && c.status !== "Blocked") return false;
      if (!q) return true;
      return (
        String(c.id).includes(q) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });
  }, [customers, tab, query]);

  useEffect(() => {
    const pages = Math.max(1, Math.ceil(filtered.length / perPage));
    if (page > pages) setPage(1);
  }, [filtered.length, perPage, page]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const start = (page - 1) * perPage;
  const paged = filtered.slice(start, start + perPage);

  function goPage(n) {
    const p = Math.max(1, Math.min(n, pages));
    setPage(p);
    if (gridRef.current) gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleSelect(id) {
    setSelectedIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function handleAdd(customer) {
    setCustomers(prev => [customer, ...prev]);
    setPage(1);
    fetchCustomers(); // sync
  }

  function handleUpdatedCustomer(updated) {
    setCustomers(prev => prev.map(c => String(c.id) === String(updated.id) ? updated : c));
  }

  function handleDeletedCustomer(id) {
    setCustomers(prev => prev.filter(c => String(c.id) !== String(id)));
  }

  function handleExportVisible() {
    const rows = [
      ["ID","Name","Orders","Balance","Status"],
      ...filtered.map(c => [c.id, c.name, c.orders, c.balance, c.status])
    ];
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <CustomerTopbar />
        <div className="dashboard-content cm-page-root">
          <div className="cm-container">

            {/* Top: search + actions */}
            <div className="cm-top">
              <div className="cm-top-row">
                <div className="cm-search-wrap">
                  <input
                    className="cm-search-input"
                    placeholder="Search customer..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  />
                </div>

                <div className="cm-right-controls">
                  <button className="cm-btn cm-export-btn" onClick={handleExportVisible}>⬇️ Export</button>

                  <div className="cm-add-column">
                    <button className="cm-btn cm-add-btn" onClick={() => setAddOpen(true)}>＋ Add Customer</button>
                    <button className="cm-btn cm-filter-btn" onClick={() => alert("Filters")}>⚙️ Filters</button>
                  </div>
                </div>
              </div>

              <div className="cm-tabs-row">
                <div className="tabs-compact">
                  {["All","Active","Blocked"].map(t => (
                    <button key={t} className={`cm-tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setPage(1); }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD GRID (keeps old visual) */}
            <div ref={gridRef} className="cm-grid" style={{ marginTop: 12 }}>
              {paged.map(c => {
                const isSelected = selectedIds.has(c.id);
                return (
                  <div
                    key={c.id}
                    className={`cm-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setProfileOpenId(c.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setProfileOpenId(c.id); }}
                  >
                    <div className="cm-card-top">
                      <label className="card-checkbox" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(c.id)} />
                        <span className="checkbox-fake" />
                      </label>
                      <button className="card-more" onClick={(e)=>{ e.stopPropagation(); /* implement more menu */ }}>⋮</button>
                    </div>

                    <div className="cm-avatar-wrap">
                      <img src={c.avatar} alt={c.name} className="cm-avatar" />
                    </div>

                    <div className="cm-card-body">
                      <div className="cm-card-name">{c.name}</div>
                      <div className={`cm-status-badge ${c.status?.toLowerCase()}`}>{c.status}</div>

                      <div className="card-stats">
                        <div>
                          <div className="stat-label">Orders</div>
                          <div className="stat-value">{c.orders}</div>
                        </div>
                        <div>
                          <div className="stat-label">Balance</div>
                          <div className="stat-value">{c.balance}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / pagination */}
            <div className="cm-footer">
              <div className="summary">
                Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
              </div>

              <div className="cm-pager" role="navigation" aria-label="Pagination">
                <button className="cm-page" onClick={() => goPage(page - 1)} disabled={page === 1}>«</button>
                {Array.from({ length: pages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      className={`cm-page ${page === p ? "active" : ""}`}
                      onClick={() => goPage(p)}
                      aria-current={page === p ? "page" : undefined}
                    >
                      {p}
                    </button>
                  );
                })}
                <button className="cm-page" onClick={() => goPage(page + 1)} disabled={page === pages}>»</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modals */}
      {profileOpenId && (
        <CustomerModal
          id={profileOpenId}
          onClose={() => setProfileOpenId(null)}
          onUpdated={handleUpdatedCustomer}
          onDeleted={handleDeletedCustomer}
        />
      )}
      {addOpen && <AddCustomerModal onClose={() => setAddOpen(false)} onAdd={handleAdd} />}
    </div>
  );
}
