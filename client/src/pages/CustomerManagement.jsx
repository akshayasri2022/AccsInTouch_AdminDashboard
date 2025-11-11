import React, { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomerTopbar from "../components/CustomerTopbar";
import "../styles/CustomerManagement.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const axiosAPI = axios.create({
  baseURL: "https://acc-in-touch-1.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

async function postWithRetry(url, payload, attempts = 3, initialDelay = 1000) {
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await axiosAPI.post(url, payload);
      return res;
    } catch (err) {
      lastErr = err;
      // if it's a client error (4xx) we shouldn't retry
      const status = err?.response?.status;
      if (status && status >= 400 && status < 500) break;
      // exponential backoff: 1s, 2s, 4s
      const delay = initialDelay * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
function unwrap(res) {
  if (!res) return null;
  if (res.data === undefined) return null;
  if (res.data && typeof res.data === "object" && "data" in res.data) return res.data.data;
  return res.data;
}

const LS_KEY = "cm_unsynced_customers_v1";

function loadUnsyncedFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read unsynced from localStorage", e);
    return [];
  }
}
function saveUnsyncedToStorage(arr) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(arr || []));
  } catch (e) {
    console.warn("Failed to save unsynced to localStorage", e);
  }
}
function addUnsyncedToStorage(item) {
  const arr = loadUnsyncedFromStorage();
  arr.unshift(item);
  saveUnsyncedToStorage(arr);
}
function removeUnsyncedFromStorage(tempId) {
  const arr = loadUnsyncedFromStorage().filter(x => String(x.id) !== String(tempId));
  saveUnsyncedToStorage(arr);
}
// upsert: add or replace an entry in the unsynced array
function upsertUnsyncedToStorage(item) {
  try {
    const arr = loadUnsyncedFromStorage();
    const idx = arr.findIndex(x => String(x.id) === String(item.id));
    if (idx === -1) {
      arr.unshift(item);
    } else {
      arr[idx] = item;
    }
    saveUnsyncedToStorage(arr);
  } catch (e) {
    console.warn("Failed to upsert unsynced to localStorage", e);
  }
}
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
function flagForCode(code) {
  const map = {
    "+1": "🇺🇸",
    "+44": "🇬🇧",
    "+91": "🇮🇳",
    "+234": "🇳🇬",
  };
  return map[code] || "🌐";
}
function normalizeCustomer(raw) {
  if (!raw) return null;
  const id = raw.id ?? raw.customerId ?? raw._id ?? raw.Id ?? null;
  const name = raw.name
    || raw.fullName
    || (raw.firstName && raw.lastName ? `${raw.firstName} ${raw.lastName}` : null)
    || raw.customerName
    || raw.Username
    || "Unnamed";
  const avatar = raw.avatar ?? raw.avatarUrl ?? raw.image ?? raw.photo ?? null;
  const orders = raw.orders ?? raw.orderCount ?? raw.totalOrders ?? 0;
  const balanceVal = raw.balance ?? raw.accountBalance ?? raw.wallet ?? 0;
  const balance = typeof balanceVal === "number" ? `$${balanceVal}` : (balanceVal || "$0");

  const status = raw.status ?? raw.state ?? "Active";
  const email = raw.email ?? raw.e_mail ?? raw.emailAddress ?? "";
  const address = raw.address ?? raw.addr ?? raw.location ?? "";
  const phone = raw.phone ?? raw.phoneNumber ?? raw.mobile ?? "";
  const lastTransaction = raw.lastTransaction ?? raw.last_txn ?? raw.lastOrderDate ?? "-";
  const lastOnline = raw.lastOnline ?? raw.lastSeen ?? raw.onlineStatus ?? "-";

  return {
    id,
    name,
    avatar,
    orders,
    balance,
    status,
    email,
    address,
    phone,
    lastTransaction,
    lastOnline,
    __raw: raw,
  };
}
function ToggleSwitch({ checked, onChange, ariaLabel }) {
  const wrapStyle = {
    display: "inline-block",
    width: 44,
    height: 24,
    position: "relative",
    verticalAlign: "middle",
    marginLeft: 8,
  };
  const inputStyle = {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  };
  const sliderStyle = {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: checked ? "#6b46b6" : "#d1d5db",
    transition: "background-color 0.18s ease",
    borderRadius: 30,
  };
  const knobStyle = {
    position: "absolute",
    content: '""',
    height: 18,
    width: 18,
    left: checked ? 22 : 2,
    bottom: 3,
    backgroundColor: "#fff",
    transition: "left 0.18s ease",
    borderRadius: "50%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
  };

  return (
    <label style={wrapStyle} aria-label={ariaLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={inputStyle}
        aria-label={ariaLabel}
      />
      <span style={sliderStyle} />
      <span style={knobStyle} />
    </label>
  );
}

function CustomerModal({ id, initialCustomer, onClose, onUpdated, onDeleted }) {
  const [customer, setCustomer] = useState(initialCustomer || null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);

 
  useEffect(() => {
    if (initialCustomer) {
      setCustomer(initialCustomer);
      setForm({
        name: initialCustomer.name || "",
        email: initialCustomer.email || "",
        phone: initialCustomer.phone || "",
        address: initialCustomer.address || "",
      });
    }
  }, [initialCustomer]);
  useEffect(() => {
    if (id == null) return;
    if (String(id).startsWith("temp-")) {
      return;
    }
    if (initialCustomer) {
      return;
    }

    let canceled = false;
    async function fetchOne() {
      setLoading(true);
      try {
        const unsynced = loadUnsyncedFromStorage() || [];
        const override = unsynced.find(u => String(u.id) === String(id));
        if (override) {
          if (canceled) return;
          setCustomer(override);
          setForm({
            name: override.name || "",
            email: override.email || "",
            phone: override.phone || "",
            address: override.address || "",
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Failed to read unsynced overrides before GET:", err);
      }

      try {
        const res = await axiosAPI.get(`/customer/${id}`);
        if (canceled) return;
        const data = unwrap(res);
        if (data) {
          const normalized = Array.isArray(data) ? normalizeCustomer(data[0]) : normalizeCustomer(data);
          if (normalized) {
            setCustomer(normalized);
            setForm({
              name: normalized.name || "",
              email: normalized.email || "",
              phone: normalized.phone || "",
              address: normalized.address || "",
            });
          }
        }
      } catch (err) {
        console.error("GET /customer/:id failed:", err);
        console.warn("Failed to load customer details from server; using local fallback if available.");
        const fallback = MOCK_CUSTOMERS.find((c) => String(c.id) === String(id));
        if (fallback) {
          setCustomer(fallback);
          setForm({
            name: fallback.name || "",
            email: fallback.email || "",
            phone: fallback.phone || "",
            address: fallback.address || "",
          });
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    fetchOne();
    return () => { canceled = true; };
  }, [id, initialCustomer]);

  if (!id) return null;

  if (loading && !customer) return (
    <div className="cm-modal-backdrop" role="dialog" aria-modal="true">
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cm-body">Loading...</div>
      </div>
    </div>
  );

  if (!customer) return null;

  async function handleDelete() {
    if (!window.confirm("Delete this customer?")) return;

    if (String(customer.id).startsWith("temp-")) {
      try { removeUnsyncedFromStorage(customer.id); } catch (e) { /* ignore */ }
      onDeleted(customer.id);
      onClose();
      toast.success("Customer removed locally.");
      return;
    }

    try {
      const res = await axiosAPI.delete(`/customer/${customer.id}`);
      const status = res && res.status ? res.status : (res && res.data && res.data.status ? res.data.status : null);

      if (status && Math.floor(status / 100) === 2) {
        onDeleted(customer.id);
        onClose();
        toast.success("Customer deleted successfully.");
        return;
      }

      console.warn("DELETE returned non-2xx status:", res);
      onDeleted(customer.id);
      onClose();
      toast.success("Customer removed.");
    } catch (err) {
      console.error("DELETE failed:", err);

      const maybeDeleted =
        err?.response?.status === 404
        || (err?.response?.status >= 200 && err?.response?.status < 300);

      if (maybeDeleted) {
        onDeleted(customer.id);
        onClose();
        toast.success("Customer deleted (server indicated not found).");
        return;
      }

      if (window.confirm("Failed to delete on server. Remove locally anyway?")) {
        if (String(customer.id).startsWith("temp-")) removeUnsyncedFromStorage(customer.id);
        onDeleted(customer.id);
        onClose();
        toast.success("Customer removed locally.");
      } else {
        toast.info("Delete cancelled.");
      }
    }
  }

  async function handleUpdate(ev) {
  ev.preventDefault();
  if (!form.name.trim() || !form.email.includes("@")) {
    toast.error("Please provide a valid name and email.");
    return;
  }

  const payload = {
    ...customer,
    name: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
  };

  // Fast UX: update UI immediately and close modal
  setCustomer(payload);
  onUpdated(payload);
  setEditMode(false);
  onClose();
  toast.success("Customer updated (local).");

  // Background sync: attempt PUT with retries and reconcile when response arrives
  const maxAttempts = 3;
  let attempt = 0;
  let lastErr = null;

  async function tryPut() {
    attempt++;
    try {
      const res = await axiosAPI.put(`/customer/${customer.id}`, payload);
      const serverRaw = unwrap(res) || res.data;
      if (serverRaw) {
        const serverNormalized = normalizeCustomer(serverRaw) || serverRaw;
        onUpdated(serverNormalized);
        toast.success("Customer updated on server.");
        return true;
      } else if (res && typeof res.status === "number" && res.status >= 200 && res.status < 300) {
        
        toast.success("Customer update acknowledged by server.");
        return true;
      } else {
        console.warn("PUT returned unexpected shape on attempt", attempt, res);
        lastErr = new Error("Unexpected PUT response");
        return false;
      }
    } catch (err) {
      lastErr = err;
      if (err && err.code === "ECONNABORTED") {
        console.warn(`PUT attempt ${attempt} timed out (ECONNABORTED).`);
      } else {
        console.warn(`PUT attempt ${attempt} failed:`, err);
      }
      return false;
    }
  }
  while (attempt < maxAttempts) {
    const ok = await tryPut();
    if (ok) return;
    const wait = 500 * (2 ** (attempt - 1));
    await new Promise(r => setTimeout(r, wait));
  }
  console.warn("PUT failed in background after retries — keeping local changes and marking as unsynced.", lastErr);
  const localCopy = { ...payload, __syncError: true };
  onUpdated(localCopy);

  try {
    upsertUnsyncedToStorage(localCopy);
  } catch (e) {
    console.warn("Failed to persist unsynced update", e);
  }

}


  return (
    <div className="cm-modal-backdrop" role="dialog" aria-modal="true" onClick={() => { if (!submitting) onClose(); }}>
      <div className="cm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cm-close" onClick={() => { if (!submitting) onClose(); }} aria-label="Close">✕</button>

        <div className="cm-header">
          <div className="cm-banner" />
          <div className="cm-avatar-large-wrap">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="cm-avatar-large" />
            ) : (
              <div className="cm-avatar-large cm-avatar-empty" />
            )}
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
                <button
                  className="cm-btn ghost cancel"
                  onClick={() => {
                    setEditMode(true);
                    setForm({
                      name: customer.name || "",
                      email: customer.email || "",
                      phone: customer.phone || "",
                      address: customer.address || "",
                    });
                  }}
                >
                  Edit
                </button>
                <button className="cm-btn add-action" onClick={handleDelete}>Delete</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <h3 className="cm-name">Edit Customer</h3>

              <div style={{ textAlign: "left", marginTop: 10 }}>
                <label className="label">Name</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} disabled={submitting}/>

                <label className="label" style={{ marginTop: 8 }}>Email</label>
                <input className="form-input" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} disabled={submitting}/>

                <label className="label" style={{ marginTop: 8 }}>Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} disabled={submitting}/>

                <label className="label" style={{ marginTop: 8 }}>Address</label>
                <input className="form-input" value={form.address} onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} disabled={submitting}/>

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <button type="button" className="cm-btn ghost cancel" onClick={() => setEditMode(false)} disabled={submitting}>Cancel</button>
                  <button type="submit" className="cm-btn add-action" disabled={submitting}>{submitting ? "Saving..." : "Save"}</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Add Customer Modal (optimistic add + persisted) ---------------- */
function AddCustomerModal({ onClose, onAdd, onSync }) {
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
      avatar: null,
      orders: 0,
      balance: "$0",
      status: "Active",
      email: email.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      address: addAddress ? `${street} ${city} ${stateVal} ${country}` : "",
      lastTransaction: "-",
      lastOnline: "Now",
    };

    const tempId = `temp-${Date.now()}`;
    const tempItem = { id: tempId, ...payload, __local: true, __createdAt: Date.now() };

    onAdd(tempItem);
    addUnsyncedToStorage(tempItem);
    onClose();
    toast.success("Customer added locally.", {
      containerId: "center",
      toastClassName: "react-toastify-center",
      autoClose: 2000,
    });

    try {
      const res = await postWithRetry("/customer", payload, 3, 1000);

      const created = unwrap(res) || res.data || null;
      const normalized = created ? (normalizeCustomer(created) || created) : null;

      if (normalized && (normalized.id || normalized._id)) {
        if (onSync) onSync(tempId, normalized);
        removeUnsyncedFromStorage(tempId);
        console.log("Customer created on server:", created);
        toast.success("Customer created on server.", {
          containerId: "center",
          toastClassName: "react-toastify-center",
          autoClose: 1800,
        });
      } else if (res && typeof res.status === "number" && res.status >= 200 && res.status < 300) {
        removeUnsyncedFromStorage(tempId);
        console.log("Server acknowledged create request for temp:", tempId, "status:", res.status);
        toast.success("Server acknowledged request.", {
          containerId: "center",
          toastClassName: "react-toastify-center",
          autoClose: 1600,
        });
      } else {
        console.warn("Unexpected POST response while creating:", res);
        const mark = { ...tempItem, __syncError: true };
        if (onSync) onSync(tempId, mark);
        upsertUnsyncedToStorage(mark);
        toast.info("Saved locally — server returned unexpected response.", {
          containerId: "center",
          toastClassName: "react-toastify-center",
          autoClose: 3500,
        });
      }
    } catch (err) {
      console.error("POST failed after retries (optimistic flow):", err, err?.response?.data || err?.message);
      if (onSync) onSync(tempId, { ...tempItem, __syncError: true });
      const arr = loadUnsyncedFromStorage().map(x => x.id === tempId ? { ...x, __syncError: true } : x);
      saveUnsyncedToStorage(arr);
      toast.info("Saved locally — will retry syncing in background.", {
        containerId: "center",
        toastClassName: "react-toastify-center",
        autoClose: 3500,
      });
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
            <div className="country-select-wrap" role="presentation" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="flag-icon" aria-hidden="true">{flagForCode(countryCode)}</span>
              <select
                className="country-select"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                aria-label="Country code"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+234">+234</option>
              </select>
            </div>

            <input className="form-input phone-input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="PhoneNumber" />
          </div>

          <label className="label toggle-row add-address-toggle" style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 14, color: "rgba(94, 96, 99, 1)" }}>Add Address</span>
            <ToggleSwitch checked={addAddress} onChange={(v) => setAddAddress(v)} ariaLabel="Add address" />
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

              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8, fontWeight: 600 }}>Billing Address</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Same as Customer Address</div>
                  <ToggleSwitch checked={sameBilling} onChange={(v) => setSameBilling(v)} ariaLabel="Same as customer address" />
                </div>
              </div>
            </>
          )}

          {!addAddress && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>Billing Address</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 14, color: "#6b7280" }}>Same as Customer Address</div>
                <ToggleSwitch checked={sameBilling} onChange={(v) => setSameBilling(v)} ariaLabel="Same as customer address" />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cm-btn ghost cancel" onClick={onClose} disabled={submitting}>Cancel</button>
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
  const [ordersFilter, setOrdersFilter] = useState("Any");
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(false);
  const ordersMenuRef = useRef(null);
  const gridRef = useRef(null);
  async function fetchCustomers() {
    try {
      const res = await axiosAPI.get("/customer");
      console.log("API /customer raw response:", res);
      const data = unwrap(res);
      const serverList = Array.isArray(data) ? data : [];
      const normalizedServer = serverList.map(item => {
        const n = normalizeCustomer(item) || item;
        if (!n.id) {
          console.warn("normalizeCustomer produced no id for item:", item);
        }
        return n;
      });
      const unsynced = loadUnsyncedFromStorage() || [];
      const unsyncedMap = new Map(unsynced.map(u => [String(u.id), u]));
      const mergedServer = normalizedServer.map(s => {
        const override = unsyncedMap.get(String(s.id));
        return override ? override : s;
      });
      const pendingTemps = unsynced.filter(u => String(u.id).startsWith("temp-"))
      setCustomers([...pendingTemps, ...mergedServer]);
    } catch (err) {
      console.error("GET /customer failed:", err);
      toast.info("Failed to load customers from server — showing local data.");
      const unsynced = loadUnsyncedFromStorage() || [];
      setCustomers([...unsynced, ...MOCK_CUSTOMERS]);
    }
  }

  useEffect(() => {
    fetchCustomers();
    (async function trySyncStored() {
      const unsynced = loadUnsyncedFromStorage();
      if (!unsynced || !unsynced.length) return;
      for (const temp of unsynced) {
        try {
          const payload = {
            name: temp.name, email: temp.email, phone: temp.phone, address: temp.address,
            avatar: temp.avatar, orders: temp.orders, balance: temp.balance, status: temp.status,
            lastTransaction: temp.lastTransaction, lastOnline: temp.lastOnline,
          };
          const r = await postWithRetry("/customer", payload, 3, 1000);
          const created = unwrap(r) || r.data || null;
          const normalized = created ? (normalizeCustomer(created) || created) : null;
          if (normalized && (normalized.id || normalized._id)) {
            setCustomers(prev => {
              const idx = prev.findIndex(c => String(c.id) === String(temp.id));
              if (idx === -1) return [normalized, ...prev];
              const next = [...prev]; next[idx] = normalized; return next;
            });
            removeUnsyncedFromStorage(temp.id);
            toast.success(`Synced queued customer: ${temp.name}`, {
              containerId: "center",
              toastClassName: "react-toastify-center",
              autoClose: 1900,
            });
          } else if (r && typeof r.status === "number" && r.status >= 200 && r.status < 300) {
            removeUnsyncedFromStorage(temp.id);
            console.log("Server acknowledged queued create for temp:", temp.id, "status:", r.status);
            toast.success("Server acknowledged queued customer.", {
              containerId: "center",
              toastClassName: "react-toastify-center",
              autoClose: 1600,
            });
          } else {
            console.warn("Unexpected response while syncing queued customer:", r);
            const mark = { ...temp, __syncError: true };
            upsertUnsyncedToStorage(mark);
          }
        } catch (err) {
          console.warn("Sync retry failed for", temp.id, err, err?.response?.data || err?.message);
        }
      }
    })();
  }, []);
  useEffect(() => {
    function onDocClick(e) {
      if (!ordersMenuRef.current) return;
      if (!ordersMenuRef.current.contains(e.target)) setOrdersMenuOpen(false);
    }
    if (ordersMenuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [ordersMenuOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    function ordersMatch(c) {
      if (ordersFilter === "Any") return true;
      if (ordersFilter === "0-10") return c.orders >= 0 && c.orders <= 10;
      if (ordersFilter === "11-25") return c.orders >= 11 && c.orders <= 25;
      if (ordersFilter === "26+") return c.orders >= 26;
      return true;
    }
    return customers.filter((c) => {
      if (tab === "Active" && c.status !== "Active") return false;
      if (tab === "Blocked" && c.status !== "Blocked") return false;
      if (!ordersMatch(c)) return false;
      if (!q) return true;
      return (
        String(c.id).includes(q) ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });
  }, [customers, tab, query, ordersFilter]);

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
  function handleAdd(tempOrCreated) {
    setCustomers(prev => {
      return [tempOrCreated, ...prev];
    });
    setPage(1);
  }
  function handleSync(tempId, serverObj) {
    setCustomers(prev => {
      const idx = prev.findIndex(c => String(c.id) === String(tempId));
      if (idx === -1) {
        return [serverObj, ...prev];
      }
      const next = [...prev];
      next[idx] = serverObj;
      return next;
    });
    if (serverObj && !serverObj.__syncError) {
      removeUnsyncedFromStorage(tempId);
      toast.success("Local item replaced with server record.", {
        containerId: "center",
        toastClassName: "react-toastify-center",
        autoClose: 1800,
      });
    }
  }

  function handleUpdatedCustomer(updated) {
    setCustomers(prev => prev.map(c => String(c.id) === String(updated.id) ? updated : c));
  }

  function handleDeletedCustomer(id) {
    if (String(id).startsWith("temp-")) removeUnsyncedFromStorage(id);
    setCustomers(prev => prev.filter(c => String(c.id) !== String(id)));
  }
  function handleExportVisible() {
    const keysSet = new Set();
    filtered.forEach(item => {
      if (!item || typeof item !== "object") return;
      Object.keys(item).forEach(k => {
        if (k.startsWith("__")) return;
        if (typeof item[k] === "function") return;
        keysSet.add(k);
      });
    });
    const preferredOrder = [
      "id", "name", "email", "phone", "address", "status",
      "orders", "balance", "lastTransaction", "lastOnline", "avatar"
    ];

    const remaining = Array.from(keysSet).filter(k => !preferredOrder.includes(k));
    remaining.sort(); 

    const columns = [...preferredOrder.filter(k => keysSet.has(k)), ...remaining];

    if (columns.length === 0) {
      toast.info("No data to export.");
      return;
    }
    const headerMap = {
      id: "ID",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      status: "Status",
      orders: "Orders",
      balance: "Balance",
      lastTransaction: "Last Transaction",
      lastOnline: "Last Online",
      avatar: "Avatar",
    };

    const header = columns.map(c => headerMap[c] || c.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()));
    const rows = [
      header,
      ...filtered.map(rowObj => columns.map(col => {
        let val = rowObj[col];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") {
          try { return JSON.stringify(val); } catch (e) { return String(val); }
        }
        return String(val);
      })),
    ];
    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click(); URL.revokeObjectURL(url);
    toast.success("Export started.");
  }

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <CustomerTopbar />
        <div className="dashboard-content cm-page-root">
          <div className="cm-container">
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
                    <button className="cm-btn cm-filter-btn" onClick={() => setOrdersMenuOpen(o => !o)}>⚙️ Filters</button>
                  </div>
                </div>
              </div>
              <div className="cm-tabs-row">
                <div className="tabs-compact">
                  {["All","Active","Blocked"].map(t => (
                    <button key={t} className={`cm-tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setPage(1); }}>{t}</button>
                  ))}
                </div>

                <div style={{ position: "relative" }} ref={ordersMenuRef}>
                  {ordersMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "42px",
                        background: "#fff",
                        border: "1px solid rgba(16,24,40,0.06)",
                        boxShadow: "0 12px 30px rgba(11,15,25,0.08)",
                        borderRadius: 12,
                        padding: 10,
                        zIndex: 60,
                        minWidth: 130,
                      }}
                      role="menu"
                    >
                      {[
                        { key: "Any", label: "Order" },
                        { key: "0-10", label: "0–10" },
                        { key: "11-25", label: "11–25" },
                        { key: "26+", label: "26+" },
                      ].map((opt, idx) => (
                        <button
                          key={opt.key}
                          onClick={() => { setOrdersFilter(opt.key); setOrdersMenuOpen(false); setPage(1); }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 12px",
                            background: ordersFilter === opt.key ? "linear-gradient(180deg,#fff1ff,#fef6ff)" : "transparent",
                            color: ordersFilter === opt.key ? "#6b46b6" : "#222",
                            border: "none",
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 16,
                            cursor: "pointer",
                            marginBottom: idx === 3 ? 0 : 8,
                          }}
                          role="menuitem"
                          aria-checked={ordersFilter === opt.key}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CARD GRID */}
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
                      <label className="card-checkbox"
                       onClick={(e) => { e.stopPropagation(); }}      // keep click from bubbling to card
                      >
                       <input
                         type="checkbox"
                         checked={isSelected}
                         onChange={() => toggleSelect(c.id)}           // actually toggle when clicked
                         aria-label={`Select ${c.name}`}
                        />
                        <span className="checkbox-fake" />
                    </label>
                      <button className="card-more" onClick={(e)=>{ e.stopPropagation(); /* implement more menu if needed */ }}>⋮</button>
                    </div>

                    <div className="cm-avatar-wrap">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} className="cm-avatar" />
                      ) : (
                        <div className="cm-avatar cm-avatar-empty" />
                      )}
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
      {profileOpenId && (
        <CustomerModal
          id={profileOpenId}
          initialCustomer={customers.find(c => String(c.id) === String(profileOpenId))}
          onClose={() => setProfileOpenId(null)}
          onUpdated={handleUpdatedCustomer}
          onDeleted={handleDeletedCustomer}
        />
      )}
      {addOpen && <AddCustomerModal onClose={() => setAddOpen(false)} onAdd={handleAdd} onSync={handleSync} />}
      <ToastContainer
        containerId="center"
        position="top-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="react-toastify-center"
      />
    </div>
  );
}
