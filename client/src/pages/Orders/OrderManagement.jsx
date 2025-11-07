import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Edit2, Eye, Trash2, X, Bell, ChevronDown, ChevronUp, Menu, Package, Users, Settings, LogOut, ShoppingBag, BarChart3 } from 'lucide-react';
import './OrderManagement.css';
import Sidebar from '../../components/Sidebar';
const OrderManagement = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerDetails, setNewCustomerDetails] = useState({ name: '', email: '', phone: '', address: '' });
  const [searchedTerm, setSearchedTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sampleProducts = [
    { name: 'Organza Bow', variants: 3, price: 121 },
    { name: 'Purple Claw Clip', variants: 2, price: 950 },
    { name: 'Hair Bow Classic', variants: 3, price: 325 },
    { name: 'Gold Bow', variants: 3, price: 348 },
    { name: 'Red Bow', variants: 4, price: 607 },
    { name: 'Velvet Scrunchie', variants: 3, price: 234 },
    { name: 'Diamond Earring', variants: 1, price: 710 },
    { name: 'White Claw Clip', variants: 3, price: 400 },
    { name: 'Fluffy Scrunchie', variants: 2, price: 812 },
    { name: 'Pearl Earring', variants: 3, price: 123 },
  ];

  const [ordersData, setOrdersData] = useState([
    {
      id: 'SO1002',
      product: 'Organza Bow',
      variants: 3,
      date: '28 Oct 2025',
      customer: 'John Bushnell',
      total: 121.00,
      payment: 'Mastercard',
      status: 'Delivered',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, New York, NY',
      orderType: 'Website Order',
      orderNote: '',
      time: '2:00 PM'
    },
    {
      id: 'SO1011',
      product: 'Purple Claw Clip',
      variants: 2,
      date: '24 Oct 2025',
      customer: 'Linda Blair',
      total: 950.00,
      payment: 'Visa',
      status: 'Shipped',
      email: 'linda@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, Los Angeles, CA',
      orderType: 'Marketplace Order',
      orderNote: 'Fragile item',
      time: '3:00 PM'
    },
    {
      id: 'SO1015',
      product: 'Gold Bow',
      variants: 3,
      date: '28 Aug 2025',
      customer: 'Mike Ross',
      total: 348.00,
      payment: 'UPI',
      status: 'Out for Delivery',
      email: 'mike@example.com',
      phone: '+1234567892',
      address: '789 Pine Rd, Chicago, IL',
      orderType: 'In-Store Purchase',
      orderNote: 'Gift wrap',
      time: '11:00 AM'
    },
    {
      id: 'SO1020',
      product: 'Red Bow',
      variants: 4,
      date: '2 Oct 2025',
      customer: 'Sarah Connor',
      total: 607.00,
      payment: 'Cash on Delivery (COD)',
      status: 'Cancelled',
      email: 'sarah@example.com',
      phone: '+1234567893',
      address: '101 Elm St, Boston, MA',
      orderType: 'Website Order',
      orderNote: 'Customer cancelled',
      time: '4:30 PM'
    },
    {
      id: 'SO1025',
      product: 'Velvet Scrunchie',
      variants: 3,
      date: '1 Jan 2025',
      customer: 'Tom Hardy',
      total: 234.00,
      payment: 'Net Banking',
      status: 'Completed',
      email: 'tom@example.com',
      phone: '+1234567894',
      address: '202 Maple Dr, Seattle, WA',
      orderType: 'Marketplace Order',
      orderNote: '',
      time: '1:00 PM'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    product: '',
    variants: 0,
    customer: '',
    total: '',
    payment: '',
    status: '',
    orderType: '',
    orderNote: '',
    date: '',
    time: ''
  });

  const filteredProducts = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(searchedTerm.toLowerCase())
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const getStatusClass = (status) => {
    const lower = status.toLowerCase();
    if (['delivered', 'completed'].includes(lower)) return 'status-delivered';
    if (lower === 'cancelled') return 'status-cancelled';
    return 'status-processing';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredOrders = ordersData.filter(order => {
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab.replace(/-/g, ' ');
    const matchesSearch = !searchQuery ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.payment.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (dateFilter.start || dateFilter.end) {
      const orderDate = new Date(order.date);
      if (dateFilter.start) matchesDate = matchesDate && orderDate >= new Date(dateFilter.start);
      if (dateFilter.end) matchesDate = matchesDate && orderDate <= new Date(dateFilter.end);
    }

    let matchesPrice = true;
    if (priceFilter.min) matchesPrice = matchesPrice && order.total >= parseFloat(priceFilter.min);
    if (priceFilter.max) matchesPrice = matchesPrice && order.total <= parseFloat(priceFilter.max);

    const matchesPayment = paymentFilter.length === 0 || paymentFilter.includes(order.payment);
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);

    return matchesTab && matchesSearch && matchesDate && matchesPrice && matchesPayment && matchesStatus;
  }).sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    if (sortConfig.key === 'total') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, dateFilter, priceFilter, paymentFilter, statusFilter]);

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (orderToDelete.id === 'multiple') {
      setOrdersData(ordersData.filter(o => !selectedOrders.includes(o.id)));
      setSelectedOrders([]);
    } else {
      setOrdersData(ordersData.filter(o => o.id !== orderToDelete.id));
      setSelectedOrders(selectedOrders.filter(id => id !== orderToDelete.id));
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const handleBulkDelete = () => {
    if (selectedOrders.length === 0) return;
    setOrderToDelete({ id: 'multiple', count: selectedOrders.length });
    setShowDeleteModal(true);
  };

  const handleViewOrder = (order) => {
    setViewOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    setEditOrder({ ...order });
    setShowEditModal(true);
  };

  const saveEditOrder = () => {
    setOrdersData(ordersData.map(o => o.id === editOrder.id ? editOrder : o));
    setShowEditModal(false);
    setEditOrder(null);
  };

  const handleAddOrder = () => {
    // Validation for new customer
    if (isNewCustomer) {
      if (!newCustomerDetails.name || !newCustomerDetails.email || !newCustomerDetails.phone || !newCustomerDetails.address) {
        alert('Please fill all customer details');
        return;
      }
    }

    const today = new Date();
    const formattedDate = newOrder.date || today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    let finalOrder = {
      id: 'SO' + Math.floor(Math.random() * 10000),
      date: formattedDate,
      time: newOrder.time || today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...newOrder,
      total: parseFloat(newOrder.total),
      variants: parseInt(newOrder.variants) || 0
    };

    if (isNewCustomer) {
      finalOrder.customer = newCustomerDetails.name;
      finalOrder.email = newCustomerDetails.email;
      finalOrder.phone = newCustomerDetails.phone;
      finalOrder.address = newCustomerDetails.address;
    } else {
      const existing = ordersData.find(o => o.customer === newOrder.customer);
      if (existing) {
        finalOrder.email = existing.email;
        finalOrder.phone = existing.phone;
        finalOrder.address = existing.address;
      }
    }

    setOrdersData([finalOrder, ...ordersData]);
    setShowAddModal(false);
    setIsNewCustomer(false);
    setNewCustomerDetails({ name: '', email: '', phone: '', address: '' });
    setNewOrder({
      product: '', variants: 0, customer: '', total: '', payment: '',
      status: '', orderType: '', orderNote: '', date: '', time: ''
    });
    setSearchedTerm('');
  };

  const handleCustomerSelect = (e) => {
    setNewOrder({ ...newOrder, customer: e.target.value });
  };

  const clearFilters = () => {
    setDateFilter({ start: '', end: '' });
    setPriceFilter({ min: '', max: '' });
    setStatusFilter([]);
    setPaymentFilter([]);
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  // Export to CSV function - FIXED
  const handleExport = () => {
    const headers = ['Order ID', 'Product', 'Variants', 'Date', 'Time', 'Customer', 'Email', 'Phone', 'Total', 'Payment', 'Status', 'Order Type', 'Address', 'Notes'];
    
    const csvData = filteredOrders.map(order => [
      order.id,
      order.product,
      order.variants,
      order.date,
      order.time || '',
      order.customer,
      order.email || '',
      order.phone || '',
      order.total,
      order.payment,
      order.status,
      order.orderType || '',
      order.address || '',
      order.orderNote || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled'];

  return (
    <div className="dashboard-layout">
     <Sidebar />
      {/* Main Content */}
      <div className="order-management">
        {/* Header */}
        <div className="order-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            
            <h1 className="order-title">Order Management</h1>
          </div>
          <div className="header-actions">
            <select className="shop-select">
              <option>Accs In Touch</option>
            </select>
            <div className="notification-badge">
              <Bell size={18} />
              <span className="badge">3</span>
            </div>
            <div className="user-avatar"></div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="order-actions-bar">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="tab-actions">
            <button className="btn-icon" onClick={() => setShowFilterModal(true)}>
              <Filter size={16} /> Filters
              {(dateFilter.start || dateFilter.end || priceFilter.min || priceFilter.max || statusFilter.length > 0 || paymentFilter.length > 0) && (
                <span className="filter-badge">•</span>
              )}
            </button>
          </div>
          <div className="action-buttons">
            <button className="btn-export" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>
            <button className="btn-add-order" onClick={() => setShowAddModal(true)}>
              + Add Order
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="order-tabs">
          <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All Orders
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              className={`tab ${activeTab === status.toLowerCase().replace(/ /g, '-') ? 'active' : ''}`}
              onClick={() => setActiveTab(status.toLowerCase().replace(/ /g, '-'))}
            >
              {status}
            </button>
          ))}
        
        </div>

        {/* Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th><input type="checkbox" onChange={toggleSelectAll} checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} /></th>
                <th onClick={() => handleSort('id')}>
                  Order ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th>Product</th>
                <th onClick={() => handleSort('date')}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th>Customer</th>
                <th onClick={() => handleSort('total')}>
                  Total {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map(order => (
                <tr key={order.id}>
                  <td><input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => toggleOrderSelection(order.id)} /></td>
                  <td><span className="order-id">{order.id}</span></td>
                  <td>
                    <div className="product-cell">
                      <div className="product-image-placeholder"></div>
                      <div>
                        <div className="product-name">{order.product}</div>
                        <div className="product-variants">{order.variants} Variants</div>
                      </div>
                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.customer}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>{order.payment}</td>
                  <td><span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                  <td>
                    <div className="action-icons">
                      <button className="icon-btn" onClick={() => handleViewOrder(order)}><Eye size={16} /></button>
                      <button className="icon-btn" onClick={() => handleEditOrder(order)}><Edit2 size={16} /></button>
                      <button className="icon-btn" onClick={() => handleDeleteOrder(order)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
          </div>
          <div className="pagination-controls">
            <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>←</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>→</button>
          </div>
        </div>

        {selectedOrders.length > 0 && (
          <button className="btn-bulk-delete" onClick={handleBulkDelete}>
            <Trash2 size={16} /> Delete Selected ({selectedOrders.length})
          </button>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Order</h3>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete {orderToDelete.id === 'multiple' ? `${orderToDelete.count} orders` : `order ${orderToDelete.id}`}?</p>
                <p className="modal-warning">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn-delete" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewOrder && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>View Order - {viewOrder.id}</h3>
                <button className="modal-close" onClick={() => setShowViewModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="order-details-grid">
                  {viewOrder.product && <div className="detail-item"><label>Product</label><p>{viewOrder.product}</p></div>}
                  {viewOrder.variants > 0 && <div className="detail-item"><label>Variants</label><p>{viewOrder.variants} Variants</p></div>}
                  {viewOrder.customer && <div className="detail-item"><label>Customer</label><p>{viewOrder.customer}</p></div>}
                  {viewOrder.email && <div className="detail-item"><label>Email</label><p>{viewOrder.email}</p></div>}
                  {viewOrder.phone && <div className="detail-item"><label>Phone</label><p>{viewOrder.phone}</p></div>}
                  <div className="detail-item"><label>Total</label><p>₹{viewOrder.total?.toFixed(2) || '-'}</p></div>
                  {viewOrder.payment && <div className="detail-item"><label>Payment</label><p>{viewOrder.payment}</p></div>}
                  {viewOrder.status && <div className="detail-item"><label>Status</label><p className={`status-badge ${getStatusClass(viewOrder.status)}`}>{viewOrder.status}</p></div>}
                  {viewOrder.address && <div className="detail-item full-width"><label>Address</label><p>{viewOrder.address}</p></div>}
                  {viewOrder.orderNote && <div className="detail-item full-width"><label>Notes</label><p>{viewOrder.orderNote}</p></div>}
                  {viewOrder.orderType && <div className="detail-item"><label>Order Type</label><p>{viewOrder.orderType}</p></div>}
                  {viewOrder.time && <div className="detail-item"><label>Time</label><p>{viewOrder.time}</p></div>}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editOrder && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Order - {editOrder.id}</h3>
                <button className="modal-close" onClick={() => setShowEditModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product</label>
                    <input type="text" value={editOrder.product || ''} onChange={e => setEditOrder({ ...editOrder, product: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Variants</label>
                    <input type="number" min="0" value={editOrder.variants || ''} onChange={e => setEditOrder({ ...editOrder, variants: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label>Customer</label>
                    <input type="text" value={editOrder.customer || ''} onChange={e => setEditOrder({ ...editOrder, customer: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={editOrder.email || ''} onChange={e => setEditOrder({ ...editOrder, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" value={editOrder.phone || ''} onChange={e => setEditOrder({ ...editOrder, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Total (₹)</label>
                    <input type="number" step="0.01" value={editOrder.total || ''} onChange={e => setEditOrder({ ...editOrder, total: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="form-group">
                    <label>Payment</label>
                    <select value={editOrder.payment || ''} onChange={e => setEditOrder({ ...editOrder, payment: e.target.value })}>
                      <option value="">Select</option>
                      <option>Cash on Delivery (COD)</option>
                      <option>UPI</option>
                      <option>Credit Card</option>
                      <option>Debit Card</option>
                      <option>Net Banking</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={editOrder.status || ''} onChange={e => setEditOrder({ ...editOrder, status: e.target.value })}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input type="text" value={editOrder.address || ''} onChange={e => setEditOrder({ ...editOrder, address: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={saveEditOrder}>Save Changes</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Order Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => { setShowAddModal(false); setSearchedTerm(''); }}>
            <div className="modal-content modal-add-order" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New Order</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="order-details-form">
                  {/* New Customer Toggle */}
                  <div className="form-group full-width">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label>New Customer</label>
                      <label className="switch">
                        <input type="checkbox" checked={isNewCustomer} onChange={e => setIsNewCustomer(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                    {isNewCustomer ? (
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Name *</label>
                          <input type="text" value={newCustomerDetails.name} onChange={e => setNewCustomerDetails({ ...newCustomerDetails, name: e.target.value })} placeholder="Customer name" />
                        </div>
                        <div className="form-group">
                          <label>Email *</label>
                          <input type="email" value={newCustomerDetails.email} onChange={e => setNewCustomerDetails({ ...newCustomerDetails, email: e.target.value })} placeholder="customer@example.com" />
                        </div>
                        <div className="form-group">
                          <label>Phone *</label>
                          <input type="tel" value={newCustomerDetails.phone} onChange={e => setNewCustomerDetails({ ...newCustomerDetails, phone: e.target.value })} placeholder="+1234567890" />
                        </div>
                        <div className="form-group full-width">
                          <label>Address *</label>
                          <input type="text" value={newCustomerDetails.address} onChange={e => setNewCustomerDetails({ ...newCustomerDetails, address: e.target.value })} placeholder="Full address" />
                        </div>
                      </div>
                    ) : (
                      <select value={newOrder.customer} onChange={handleCustomerSelect} className="select-customer full-width">
                        <option value="">Select Customer</option>
                        {[...new Set(ordersData.map(o => o.customer))].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                  </div>

                  {/* Product Search */}
                  <div className="form-group full-width">
                    <label>Search Product Name</label>
                    <div className="search-product-container">
                      <Search size={18} />
                      <input
                        type="text"
                        placeholder="Search product name"
                        className="search-product-input"
                        value={searchedTerm}
                        onChange={e => setSearchedTerm(e.target.value)}
                      />
                      {searchedTerm && filteredProducts.length > 0 && (
                        <div className="search-results">
                          {filteredProducts.map(p => (
                            <div
                              key={p.name}
                              className="product-item"
                              onClick={() => {
                                setNewOrder({ ...newOrder, product: p.name, variants: p.variants, total: p.price.toString() });
                                setSearchedTerm('');
                              }}
                            >
                              {p.name} - ₹{p.price} ({p.variants} Variants)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {searchedTerm && filteredProducts.length === 0 && <p style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>No products found</p>}
                  </div>

                  {/* Selected Product */}
                  {newOrder.product && (
                    <div className="selected-product full-width">
                      <div className="product-image-placeholder"></div>
                      <div className="product-info-mini">
                        <div className="product-name">{newOrder.product}</div>
                        <div className="product-variants">{newOrder.variants} Variants</div>
                      </div>
                      <div className="product-price">₹{newOrder.total}</div>
                    </div>
                  )}

                  {/* Manual Entry */}
                  <div className="manual-entry-section full-width">
                    <h4 style={{ marginBottom: '16px' }}>Or Add Manually</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text" value={newOrder.product} onChange={e => setNewOrder({ ...newOrder, product: e.target.value })} placeholder="e.g., Organza Bow" />
                      </div>
                      <div className="form-group">
                        <label>Variants *</label>
                        <input type="number" min="0" value={newOrder.variants} onChange={e => setNewOrder({ ...newOrder, variants: parseInt(e.target.value) || 0 })} placeholder="e.g., 3" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Total Amount (₹) *</label>
                      <input type="number" step="0.01" value={newOrder.total} onChange={e => setNewOrder({ ...newOrder, total: e.target.value })} placeholder="0.00" />
                    </div>
                  </div>

                  {/* Other Fields */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>Payment Type</label>
                      <select value={newOrder.payment} onChange={e => setNewOrder({ ...newOrder, payment: e.target.value })}>
                        <option value="">Select</option>
                        <option>Cash on Delivery (COD)</option>
                        <option>UPI</option>
                        <option>Credit Card</option>
                        <option>Debit Card</option>
                        <option>Net Banking</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Order Type</label>
                      <select value={newOrder.orderType} onChange={e => setNewOrder({ ...newOrder, orderType: e.target.value })}>
                        <option value="">Select</option>
                        <option>Marketplace Order</option>
                        <option>Website Order</option>
                        <option>In-Store Purchase</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Order Date</label>
                      <input type="date" value={newOrder.date} onChange={e => setNewOrder({ ...newOrder, date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Order Time</label>
                      <input type="time" value={newOrder.time} onChange={e => setNewOrder({ ...newOrder, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Order Status</label>
                    <select value={newOrder.status} onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}>
                      <option value="">Select</option>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Order Note</label>
                    <textarea
                      value={newOrder.orderNote}
                      onChange={e => setNewOrder({ ...newOrder, orderNote: e.target.value })}
                      placeholder="Add any special instructions..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer modal-footer-add">
                <button className="btn-cancel-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button
                  className="btn-create-order"
                  onClick={handleAddOrder}
                  disabled={!newOrder.product || !newOrder.total || (!isNewCustomer && !newOrder.customer) || (isNewCustomer && (!newCustomerDetails.name || !newCustomerDetails.email || !newCustomerDetails.phone || !newCustomerDetails.address))}
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Advanced Filters</h3>
                <button className="modal-close" onClick={() => setShowFilterModal(false)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="filter-section">
                  <h4>Date Range</h4>
                  <div className="date-filter-grid">
                    <input type="date" value={dateFilter.start} onChange={e => setDateFilter({ ...dateFilter, start: e.target.value })} />
                    <input type="date" value={dateFilter.end} onChange={e => setDateFilter({ ...dateFilter, end: e.target.value })} />
                  </div>
                </div>
                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="price-filter-grid">
                    <input type="number" placeholder="Min" value={priceFilter.min} onChange={e => setPriceFilter({ ...priceFilter, min: e.target.value })} />
                    <input type="number" placeholder="Max" value={priceFilter.max} onChange={e => setPriceFilter({ ...priceFilter, max: e.target.value })} />
                  </div>
                </div>
                <div className="filter-section">
                  <h4>Status</h4>
                  <div className="checkbox-group">
                    {statusOptions.map(status => (
                      <label key={status} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes(status)}
                          onChange={e => {
                            if (e.target.checked) setStatusFilter([...statusFilter, status]);
                            else setStatusFilter(statusFilter.filter(s => s !== status));
                          }}
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <h4>Payment Method</h4>
                  <div className="checkbox-group">
                    {['Cash on Delivery (COD)', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
                      <label key={method} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={paymentFilter.includes(method)}
                          onChange={e => {
                            if (e.target.checked) setPaymentFilter([...paymentFilter, method]);
                            else setPaymentFilter(paymentFilter.filter(m => m !== method));
                          }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={clearFilters}>Clear All</button>
                <button className="btn-primary" onClick={applyFilters}>Apply Filters</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;