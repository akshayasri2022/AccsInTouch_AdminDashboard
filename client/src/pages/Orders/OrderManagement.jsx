// src/pages/OrderManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Filter,
  Edit2,
  Eye,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import './OrderManagement.css';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import OrderTopbar from '../../components/OrderTopbar';

const transformToDbEnum = (displayValue, type) => {
  const mappings = {
    paymentType: {
      'Cash on Delivery': 'CashOnDelivery',
      UPI: 'UPI',
      'Credit Card': 'CreditCard',
      'Debit Card': 'DebitCard',
      'Net Banking': 'NetBanking'
    },
    orderType: {
      'Marketplace Order': 'MarketplaceOrder',
      'Website Order': 'WebsiteOrder',
      'In-Store Purchase': 'InStorePurchase'
    },
    orderStatus: {
      Pending: 'Pending',
      Confirmed: 'Confirmed',
      Packed: 'Packed',
      Shipped: 'Shipped',
      'Out for Delivery': 'OutForDelivery',
      Delivered: 'Delivered',
      Completed: 'Completed'
    }
  };
  return mappings[type]?.[displayValue] || displayValue;
};

const displayEnumValue = (dbValue) => {
  if (!dbValue) return dbValue;
  const reverseMap = {
    CashOnDelivery: 'Cash on Delivery',
    UPI: 'UPI',
    CreditCard: 'Credit Card',
    DebitCard: 'Debit Card',
    NetBanking: 'Net Banking',
    MarketplaceOrder: 'Marketplace Order',
    WebsiteOrder: 'Website Order',
    InStorePurchase: 'In-Store Purchase',
    Pending: 'Pending',
    Confirmed: 'Confirmed',
    Packed: 'Packed',
    Shipped: 'Shipped',
    OutForDelivery: 'Out for Delivery',
    Delivered: 'Delivered',
    Completed: 'Completed'
  };
  return reverseMap[dbValue] || dbValue;
};

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
  const [newCustomerDetails, setNewCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [searchedTerm, setSearchedTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: '', message: '' });

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [tempCustomerId, setTempCustomerId] = useState(null);

  const API_URL = 'https://acc-in-touch-1.onrender.com/api';

  // Helper: normalize id to string (null-safe)
  const normalizeId = (v) => (v === null || v === undefined ? null : String(v));

  // Broadcast helper for cross-page / cross-tab order change notifications
 // Broadcast helper for cross-page / cross-tab order change notifications
// Broadcast helper for cross-page / cross-tab order change notifications
function broadcastOrderChange(type, order) {
  try {
    const payload = { type, order };
    window.dispatchEvent(new CustomEvent("order-changed", { detail: payload }));
    localStorage.setItem(
      "om_last_order_change",
      JSON.stringify({ ts: Date.now(), payload })
    );
  } catch (err) {
    console.warn("broadcastOrderChange failed", err);
  }
}


  const [newOrder, setNewOrder] = useState({
    custID: '',
    prodID: '',
    paymentType: '',
    orderStatus: '',
    orderType: '',
    orderDate: '',
    orderTime: ''
  });

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ show: false, type: '', message: '' }), 3000);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/Product`, getAuthHeaders());
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      showPopup('error', 'Failed to fetch products');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customer`, getAuthHeaders());
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showPopup('error', 'Failed to fetch customers');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Order`, getAuthHeaders());
      setOrdersData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showPopup('error', 'Failed to fetch orders');
      setOrdersData([]);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async () => {
    try {
      if (
        !newCustomerDetails.name ||
        !newCustomerDetails.email ||
        !newCustomerDetails.phone ||
        !newCustomerDetails.address
      ) {
        showPopup('error', 'Please fill all customer details');
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append('customerName', newCustomerDetails.name);
      formData.append('customerEmail', newCustomerDetails.email);
      formData.append('phoneNumber', newCustomerDetails.phone);
      formData.append('customerAddress', newCustomerDetails.address);

      const response = await axios.post(`${API_URL}/Customer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders().headers
        }
      });

      setTempCustomerId(response.data?.newCustomer?.id || response.data?.id);
      showPopup('success', 'Customer added successfully!');
      await fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      showPopup(
        'error',
        'Failed to create customer: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, []);

  // -------------------------------
  // Listen for customer updates from CustomerManagement
  // -------------------------------
  useEffect(() => {
    function applyCustomerUpdate(detailOrPayload) {
      if (!detailOrPayload) return;
      const updated = detailOrPayload.payload
        ? detailOrPayload.payload
        : detailOrPayload;
      const updatedId = normalizeId(updated.id ?? updated._id);
      if (!updatedId) return;

      // update customers list
      setCustomers((prev) => {
        let found = false;
        const next = prev.map((c) => {
          if (normalizeId(c.id) === updatedId) {
            found = true;
            return { ...c, ...updated };
          }
          return c;
        });
        if (!found) {
          return [updated, ...prev];
        }
        return next;
      });

      // update ordersData so displayed customer name updates
      setOrdersData((prev) =>
        prev.map((o) => {
          const custIdFromOrder = normalizeId(
            o.custID ??
              o.orderCustomer?.id ??
              o.orderCustomer?.customerId ??
              o.orderCustomer?._id
          );
          if (custIdFromOrder === updatedId) {
            const newOrderObj = { ...o };
            if (newOrderObj.orderCustomer && typeof newOrderObj.orderCustomer === 'object') {
              newOrderObj.orderCustomer = {
                ...newOrderObj.orderCustomer,
                ...updated
              };
            } else {
              newOrderObj.orderCustomer = { ...updated };
            }
            return newOrderObj;
          }
          return o;
        })
      );
    }

    function onCustomerUpdated(e) {
      try {
        const detail = e?.detail ?? null;
        if (detail) applyCustomerUpdate(detail);
      } catch (err) {
        console.warn('onCustomerUpdated error', err);
      }
    }

    function onStorage(e) {
      try {
        if (!e.key) return;
        if (e.key !== 'cm_last_customer_update' || !e.newValue) return;
        const parsed = JSON.parse(e.newValue);
        if (!parsed) return;
        applyCustomerUpdate(parsed);
      } catch (err) {
        // ignore parse errors
      }
    }

    window.addEventListener('customer-updated', onCustomerUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('customer-updated', onCustomerUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    (p.productName || '').toLowerCase().includes(searchedTerm.toLowerCase())
  );

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = ordersData
    .filter((order) => {
      const matchesTab =
        activeTab === 'all' ||
        (order.orderStatus ?? '').toLowerCase() ===
          activeTab.replace(/-/g, '').toLowerCase();

      const customerNameSearch =
  (order.orderCustomer?.customerName ||
    order.orderCustomer?.name ||
    '').toLowerCase();

const matchesSearch =
  !searchQuery ||
  (order.OrderedProduct?.productName || '')
    .toLowerCase()
    .includes(searchQuery.toLowerCase()) ||
  customerNameSearch.includes(searchQuery.toLowerCase()) ||
  (order.orderID || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
  (order.paymentType || '').toLowerCase().includes(searchQuery.toLowerCase());


      let matchesDate = true;
      if (dateFilter.start || dateFilter.end) {
        const orderDate = new Date(order.orderDate);
        if (dateFilter.start)
          matchesDate =
            matchesDate && orderDate >= new Date(dateFilter.start);
        if (dateFilter.end)
          matchesDate = matchesDate && orderDate <= new Date(dateFilter.end);
      }

      // 🔹 use basicPricing instead of price
      const priceValue = Number(order.OrderedProduct?.basicPricing ?? 0);
      let matchesPrice = true;
      if (priceFilter.min)
        matchesPrice =
          matchesPrice && priceValue >= parseFloat(priceFilter.min || 0);
      if (priceFilter.max)
        matchesPrice =
          matchesPrice &&
          priceValue <= parseFloat(priceFilter.max || Infinity);

      const matchesPayment =
        paymentFilter.length === 0 ||
        paymentFilter.some(
          (pf) =>
            transformToDbEnum(pf, 'paymentType') === order.paymentType
        );
      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.some(
          (sf) =>
            transformToDbEnum(sf, 'orderStatus') === order.orderStatus
        );

      return (
        matchesTab &&
        matchesSearch &&
        matchesDate &&
        matchesPrice &&
        matchesPayment &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === 'total') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      if (aVal < bVal)
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal)
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSelectAll = () => {
    if (
      selectedOrders.length === filteredOrders.length &&
      filteredOrders.length > 0
    ) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const getStatusClass = (status) => {
    const lower = (status || '').toLowerCase();
    if (['delivered', 'completed'].includes(lower))
      return 'status-delivered';
    if (lower === 'cancelled') return 'status-cancelled';
    return 'status-processing';
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc')
      direction = 'desc';
    setSortConfig({ key, direction });
  };

  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, dateFilter, priceFilter, paymentFilter, statusFilter]);

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      if (orderToDelete?.id === 'multiple') {
        const deletedOrders = selectedOrders
          .map((id) => ordersData.find((o) => String(o.id) === String(id)))
          .filter(Boolean);

        await Promise.all(
          selectedOrders.map((id) =>
            axios.delete(`${API_URL}/Order/${id}`, getAuthHeaders())
          )
        );

        deletedOrders.forEach((o) => {
          const payloadOrder = {
            id: o.id,
            custID:
              o.custID ??
              o.orderCustomer?.id ??
              o.orderCustomer?.customerId
          };
          broadcastOrderChange('deleted', payloadOrder);
        });

        showPopup(
          'success',
          `${selectedOrders.length} orders deleted successfully`
        );
        setSelectedOrders([]);
      } else if (orderToDelete?.id) {
        await axios.delete(
          `${API_URL}/Order/${orderToDelete.id}`,
          getAuthHeaders()
        );
        const payloadOrder = {
          id: orderToDelete.id,
          custID:
            orderToDelete.custID ??
            orderToDelete.orderCustomer?.id ??
            orderToDelete.orderCustomer?.customerId
        };
        broadcastOrderChange('deleted', payloadOrder);
        showPopup('success', 'Order deleted successfully');
      }
      await fetchOrders();
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      showPopup('error', 'Failed to delete order');
    } finally {
      setLoading(false);
    }
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
    setEditOrder({
      ...order,
      custID: order.custID ?? order.orderCustomer?.id,
      prodID: order.prodID ?? order.OrderedProduct?.id,
      paymentType: displayEnumValue(order.paymentType),
      orderType: displayEnumValue(order.orderType),
      orderStatus: displayEnumValue(order.orderStatus)
    });
    setShowEditModal(true);
  };

  const saveEditOrder = async () => {
    if (!editOrder) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('custID', editOrder.custID);
      formData.append('prodID', editOrder.prodID);
      formData.append(
        'paymentType',
        transformToDbEnum(editOrder.paymentType, 'paymentType')
      );
      formData.append(
        'orderType',
        transformToDbEnum(editOrder.orderType, 'orderType')
      );
      formData.append(
        'orderStatus',
        transformToDbEnum(editOrder.orderStatus, 'orderStatus')
      );
      formData.append('orderDate', editOrder.orderDate);
      formData.append('orderTime', editOrder.orderTime);

      const res = await axios.put(
        `${API_URL}/Order/${editOrder.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders().headers
          }
        }
      );

      const updatedOrder = res && res.data ? res.data : { id: editOrder.id, custID: editOrder.custID };
      broadcastOrderChange('updated', updatedOrder);

      showPopup('success', 'Order updated successfully');
      await fetchOrders();
      setShowEditModal(false);
      setEditOrder(null);
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      showPopup(
        'error',
        'Failed to update order: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    try {
      if (!newOrder.prodID) {
        showPopup('error', 'Please select a product');
        return;
      }
      if (!isNewCustomer && !newOrder.custID) {
        showPopup('error', 'Please select a customer');
        return;
      }
      if (isNewCustomer && !tempCustomerId) {
        showPopup(
          'error',
          'Please add customer first by clicking "Add Customer"'
        );
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append(
        'custID',
        isNewCustomer ? tempCustomerId : newOrder.custID
      );
      formData.append('prodID', newOrder.prodID);
      formData.append(
        'paymentType',
        transformToDbEnum(
          newOrder.paymentType || 'Cash on Delivery',
          'paymentType'
        )
      );
      formData.append(
        'orderType',
        transformToDbEnum(
          newOrder.orderType || 'Website Order',
          'orderType'
        )
      );
      formData.append(
        'orderStatus',
        transformToDbEnum(newOrder.orderStatus || 'Pending', 'orderStatus')
      );
      formData.append(
        'orderDate',
        newOrder.orderDate ||
          new Date().toISOString().split('T')[0]
      );
      formData.append(
        'orderTime',
        newOrder.orderTime ||
          new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          })
      );

      const res = await axios.post(`${API_URL}/Order`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders().headers
        }
      });

      const createdOrder =
        res && res.data
          ? res.data
          : { custID: isNewCustomer ? tempCustomerId : newOrder.custID };
      if (!createdOrder.custID && createdOrder.orderCustomer?.id)
        createdOrder.custID = createdOrder.orderCustomer.id;

      broadcastOrderChange('created', createdOrder);

      showPopup('success', 'Order created successfully');
      await fetchOrders();

      setShowAddModal(false);
      setIsNewCustomer(false);
      setNewCustomerDetails({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
      setTempCustomerId(null);
      setNewOrder({
        custID: '',
        prodID: '',
        paymentType: '',
        orderStatus: '',
        orderType: '',
        orderDate: '',
        orderTime: ''
      });
      setSearchedTerm('');
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error);
      showPopup(
        'error',
        'Failed to create order: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (e) => {
    setNewOrder({ ...newOrder, custID: e.target.value });
  };

  const clearFilters = () => {
    setDateFilter({ start: '', end: '' });
    setPriceFilter({ min: '', max: '' });
    setStatusFilter([]);
    setPaymentFilter([]);
    setShowFilterModal(false);
  };

  const applyFilters = () => setShowFilterModal(false);

  const handleExport = () => {
    const headers = [
      'Order ID',
      'Product',
      'Date',
      'Time',
      'Customer',
      'Email',
      'Phone',
      'Total',
      'Payment',
      'Status',
      'Order Type'
    ];
    const csvData = filteredOrders.map((order) => [
      order.orderID || '',
      order.OrderedProduct?.productName || '',
      order.orderDate || '',
      order.orderTime || '',
      order.orderCustomer?.customerName || '',
      order.orderCustomer?.customerEmail || '',
      order.orderCustomer?.phoneNumber || '',
      order.OrderedProduct?.basicPricing ?? '',
      displayEnumValue(order.paymentType) || '',
      displayEnumValue(order.orderStatus) || '',
      displayEnumValue(order.orderType) || ''
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `orders_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paymentOptions = [
    'Cash on Delivery',
    'UPI',
    'Credit Card',
    'Debit Card',
    'Net Banking'
  ];
  const orderTypeOptions = [
    'Marketplace Order',
    'Website Order',
    'In-Store Purchase'
  ];
  const statusOptions = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Completed'
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-main">
        <OrderTopbar />

        {popup.show && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 10000,
              background:
                popup.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: popup.type === 'success' ? '#16a34a' : '#dc2626',
              padding: '16px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              fontWeight: '600'
            }}
          >
            {popup.message}
          </div>
        )}

        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                fontWeight: '600'
              }}
            >
              Loading...
            </div>
          </div>
        )}

        <div className="order-management">
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
              <button
                className="btn-icon"
                onClick={() => setShowFilterModal(true)}
              >
                <Filter size={16} /> Filters
                {(dateFilter.start ||
                  dateFilter.end ||
                  priceFilter.min ||
                  priceFilter.max ||
                  statusFilter.length > 0 ||
                  paymentFilter.length > 0) && (
                  <span className="filter-badge">•</span>
                )}
              </button>
            </div>

            <div className="action-buttons">
              <button className="btn-export" onClick={handleExport}>
                <Download size={16} /> Export
              </button>
              <button
                className="btn-add-order"
                onClick={() => setShowAddModal(true)}
              >
                + Add Order
              </button>
            </div>
          </div>

          <div className="order-tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Orders
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                className={`tab ${
                  activeTab === status.toLowerCase().replace(/ /g, '')
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setActiveTab(status.toLowerCase().replace(/ /g, ''))
                }
              >
                {status}
              </button>
            ))}
          </div>

          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={
                        selectedOrders.length === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                    />
                  </th>
                  <th
                    onClick={() => handleSort('orderID')}
                    style={{ cursor: 'pointer' }}
                  >
                    Order ID{' '}
                    {sortConfig.key === 'orderID' &&
                      (sortConfig.direction === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </th>
                  <th>Product</th>
                  <th
                    onClick={() => handleSort('orderDate')}
                    style={{ cursor: 'pointer' }}
                  >
                    Date{' '}
                    {sortConfig.key === 'orderDate' &&
                      (sortConfig.direction === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </th>
                  <th>Customer</th>
                  <th
                    onClick={() => handleSort('total')}
                    style={{ cursor: 'pointer' }}
                  >
                    Total{' '}
                    {sortConfig.key === 'total' &&
                      (sortConfig.direction === 'asc' ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      ))}
                  </th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                      }}
                    >
                      {loading ? 'Loading orders...' : 'No orders found'}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td>
                        <span className="order-id">{order.orderID}</span>
                      </td>
                      <td>
                        <div className="product-cell">
                          <div className="product-image-placeholder" />
                          <div>
                            <div className="product-name">
                              {order.OrderedProduct?.productName || 'N/A'}
                            </div>
                            <div className="product-variants">
                              {order.OrderedProduct?.variants ?? 0} Variants
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{order.orderDate || 'N/A'}</td>
                     <td>{order.orderCustomer?.customerName || order.orderCustomer?.name || "N/A"}</td>

                      <td>
                        ₹
                        {order.OrderedProduct?.basicPricing != null
                          ? Number(
                              order.OrderedProduct.basicPricing
                            ).toFixed(2)
                          : '0.00'}
                      </td>
                      <td>
                        {displayEnumValue(order.paymentType) || 'N/A'}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {displayEnumValue(order.orderStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="action-icons">
                          <button
                            className="icon-btn"
                            onClick={() => handleViewOrder(order)}
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleEditOrder(order)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn"
                            onClick={() => handleDeleteOrder(order)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{' '}
                {filteredOrders.length}
              </div>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((p) => Math.max(1, p - 1))
                  }
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${
                      currentPage === i + 1 ? 'active' : ''
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  →
                </button>
              </div>
            </div>
          )}

          {selectedOrders.length > 0 && (
            <button
              className="btn-bulk-delete"
              onClick={handleBulkDelete}
              style={{ marginTop: '20px' }}
            >
              <Trash2 size={16} /> Delete Selected (
              {selectedOrders.length})
            </button>
          )}

          {/* View Modal */}
          {showViewModal && viewOrder && (
            <div
              className="modal-overlay"
              onClick={() => setShowViewModal(false)}
            >
              <div
                className="modal-content modal-large"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>View Order - {viewOrder.orderID}</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowViewModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="order-details-grid">
                    <div className="detail-item">
                      <label>Product</label>
                      <p>{viewOrder.OrderedProduct?.productName || 'N/A'}</p>
                    </div>
                   <div className="detail-item">
  <label>Customer</label>
  <p>
    {viewOrder.orderCustomer?.customerName ||
      viewOrder.orderCustomer?.name ||
      "N/A"}
  </p>
</div>

                    <div className="detail-item">
                      <label>Email</label>
                      <p>{viewOrder.orderCustomer?.customerEmail || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>{viewOrder.orderCustomer?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Total</label>
                      <p>
                        ₹
                        {viewOrder.OrderedProduct?.basicPricing != null
                          ? Number(
                              viewOrder.OrderedProduct.basicPricing
                            ).toFixed(2)
                          : '0.00'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <label>Payment</label>
                      <p>{displayEnumValue(viewOrder.paymentType) || 'N/A'}</p>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <p
                        className={`status-badge ${getStatusClass(
                          viewOrder.orderStatus
                        )}`}
                      >
                        {displayEnumValue(viewOrder.orderStatus)}
                      </p>
                    </div>
                    <div className="detail-item full-width">
                      <label>Address</label>
                      <p>
                        {viewOrder.orderCustomer?.customerAddress || 'N/A'}
                      </p>
                    </div>
                    {viewOrder.orderType && (
                      <div className="detail-item">
                        <label>Order Type</label>
                        <p>{displayEnumValue(viewOrder.orderType)}</p>
                      </div>
                    )}
                    {viewOrder.orderTime && (
                      <div className="detail-item">
                        <label>Time</label>
                        <p>{viewOrder.orderTime}</p>
                      </div>
                    )}
                    {viewOrder.orderDate && (
                      <div className="detail-item">
                        <label>Date</label>
                        <p>{viewOrder.orderDate}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && editOrder && (
            <div
              className="modal-overlay"
              onClick={() => setShowEditModal(false)}
            >
              <div
                className="modal-content modal-large"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Edit Order - {editOrder.orderID}</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowEditModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product *</label>
                      <select
                        value={editOrder.prodID || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            prodID: e.target.value
                          })
                        }
                      >
                        <option value="">Select Product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.productName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Customer *</label>
                      <select
  value={editOrder.custID || ""}
  onChange={(e) =>
    setEditOrder({ ...editOrder, custID: e.target.value })
  }
>
  <option value="">Select Customer</option>
  {customers.map((c) => (
    <option key={c.id} value={c.id}>
      {c.customerName || c.name}
    </option>
  ))}
</select>


                    </div>
                    <div className="form-group">
                      <label>Payment Type *</label>
                      <select
                        value={editOrder.paymentType || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            paymentType: e.target.value
                          })
                        }
                      >
                        <option value="">Select</option>
                        {paymentOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Order Status *</label>
                      <select
                        value={editOrder.orderStatus || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            orderStatus: e.target.value
                          })
                        }
                      >
                        <option value="">Select</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Order Type *</label>
                      <select
                        value={editOrder.orderType || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            orderType: e.target.value
                          })
                        }
                      >
                        <option value="">Select</option>
                        {orderTypeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Order Date *</label>
                      <input
                        type="date"
                        value={editOrder.orderDate || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            orderDate: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Order Time *</label>
                      <input
                        type="time"
                        value={editOrder.orderTime || ''}
                        onChange={(e) =>
                          setEditOrder({
                            ...editOrder,
                            orderTime: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={saveEditOrder}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Modal */}
          {showAddModal && (
            <div
              className="modal-overlay"
              onClick={() => {
                setShowAddModal(false);
                setSearchedTerm('');
              }}
            >
              <div
                className="modal-content modal-add-order"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Create New Order</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="order-details-form">
                    <div className="form-group full-width">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}
                      >
                        <label>New Customer</label>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={isNewCustomer}
                            onChange={(e) =>
                              setIsNewCustomer(e.target.checked)
                            }
                          />
                          <span className="slider" />
                        </label>
                      </div>

                      {isNewCustomer ? (
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Name *</label>
                            <input
                              type="text"
                              value={newCustomerDetails.name}
                              onChange={(e) =>
                                setNewCustomerDetails({
                                  ...newCustomerDetails,
                                  name: e.target.value
                                })
                              }
                              placeholder="Customer name"
                            />
                          </div>
                          <div className="form-group">
                            <label>Email *</label>
                            <input
                              type="email"
                              value={newCustomerDetails.email}
                              onChange={(e) =>
                                setNewCustomerDetails({
                                  ...newCustomerDetails,
                                  email: e.target.value
                                })
                              }
                              placeholder="customer@example.com"
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone *</label>
                            <input
                              type="tel"
                              value={newCustomerDetails.phone}
                              onChange={(e) =>
                                setNewCustomerDetails({
                                  ...newCustomerDetails,
                                  phone: e.target.value
                                })
                              }
                              placeholder="+1234567890"
                            />
                          </div>
                          <div className="form-group full-width">
                            <label>Address *</label>
                            <input
                              type="text"
                              value={newCustomerDetails.address}
                              onChange={(e) =>
                                setNewCustomerDetails({
                                  ...newCustomerDetails,
                                  address: e.target.value
                                })
                              }
                              placeholder="Full address"
                            />
                          </div>
                          <div className="form-group full-width">
                            <button
                              className="btn-primary"
                              onClick={createCustomer}
                              disabled={loading}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                justifyContent: 'center'
                              }}
                            >
                              <Plus size={16} />{' '}
                              {loading ? 'Adding...' : 'Add Customer'}
                            </button>
                            {tempCustomerId && (
                              <p
                                style={{
                                  color: '#27ae60',
                                  fontSize: '13px',
                                  marginTop: '8px'
                                }}
                              >
                                ✓ Customer added successfully! ID:{' '}
                                {tempCustomerId}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <select
  value={newOrder.custID}
  onChange={handleCustomerSelect}
  className="select-customer"
>
  <option value="">Select Customer</option>
  {customers.map((c) => (
    <option key={c.id} value={c.id}>
      {c.customerName || c.name}
    </option>
  ))}
</select>

                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Search Product Name</label>
                      <div className="search-product-container">
                        <Search size={18} />
                        <input
                          type="text"
                          placeholder="Search product name"
                          className="search-product-input"
                          value={searchedTerm}
                          onChange={(e) =>
                            setSearchedTerm(e.target.value)
                          }
                        />
                        {searchedTerm && filteredProducts.length > 0 && (
                          <div className="search-results">
                            {filteredProducts.map((p) => (
                              <div
                                key={p.id}
                                className="product-item"
                                onClick={() => {
                                  setNewOrder({
                                    ...newOrder,
                                    prodID: p.id
                                  });
                                  setSearchedTerm('');
                                }}
                              >
                                {p.productName} - ₹
                                {p.basicPricing || 0}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {searchedTerm && filteredProducts.length === 0 && (
                        <p
                          style={{
                            color: '#999',
                            fontSize: '12px',
                            marginTop: '4px'
                          }}
                        >
                          No products found
                        </p>
                      )}
                    </div>

                    {newOrder.prodID && (
                      <div className="selected-product">
                        <div className="product-image-placeholder" />
                        <div className="product-info-mini">
                          <div className="product-name">
                            {products.find(
                              (p) =>
                                String(p.id) ===
                                String(newOrder.prodID)
                            )?.productName || 'Selected Product'}
                          </div>
                        </div>
                        <div className="product-price">
                          ₹
                          {products.find(
                            (p) =>
                              String(p.id) ===
                              String(newOrder.prodID)
                          )?.basicPricing ?? '0'}
                        </div>
                      </div>
                    )}

                    <div className="manual-entry-section full-width">
                      <h4 style={{ marginBottom: '16px' }}>
                        Or Select Product Manually
                      </h4>
                      <div className="form-group">
                        <label>Product *</label>
                        <select
                          value={newOrder.prodID}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              prodID: e.target.value
                            })
                          }
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.productName} - ₹
                              {p.basicPricing ?? 0}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Payment Type *</label>
                        <select
                          value={newOrder.paymentType}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              paymentType: e.target.value
                            })
                          }
                        >
                          <option value="">Select</option>
                          {paymentOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Order Type *</label>
                        <select
                          value={newOrder.orderType}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              orderType: e.target.value
                            })
                          }
                        >
                          <option value="">Select</option>
                          {orderTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Order Date</label>
                        <input
                          type="date"
                          value={newOrder.orderDate}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              orderDate: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Order Time</label>
                        <input
                          type="time"
                          value={newOrder.orderTime}
                          onChange={(e) =>
                            setNewOrder({
                              ...newOrder,
                              orderTime: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Order Status *</label>
                      <select
                        value={newOrder.orderStatus}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            orderStatus: e.target.value
                          })
                        }
                      >
                        <option value="">Select</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer modal-footer-add">
                  <button
                    className="btn-cancel-outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-create-order"
                    onClick={handleAddOrder}
                    disabled={
                      loading ||
                      !newOrder.prodID ||
                      (!isNewCustomer && !newOrder.custID) ||
                      (isNewCustomer && !tempCustomerId)
                    }
                  >
                    {loading ? 'Creating...' : 'Create Order'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete modal */}
          {showDeleteModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowDeleteModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Delete Order</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete{' '}
                    {orderToDelete?.id === 'multiple'
                      ? `${orderToDelete.count} orders`
                      : `order ${orderToDelete?.orderID}`}{' '}
                    ?
                  </p>
                  <p className="modal-warning">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-delete"
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter modal */}
          {showFilterModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowFilterModal(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Advanced Filters</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowFilterModal(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="filter-section">
                    <h4>Date Range</h4>
                    <div className="date-filter-grid">
                      <input
                        type="date"
                        value={dateFilter.start}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            start: e.target.value
                          })
                        }
                      />
                      <input
                        type="date"
                        value={dateFilter.end}
                        onChange={(e) =>
                          setDateFilter({
                            ...dateFilter,
                            end: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-filter-grid">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceFilter.min}
                        onChange={(e) =>
                          setPriceFilter({
                            ...priceFilter,
                            min: e.target.value
                          })
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceFilter.max}
                        onChange={(e) =>
                          setPriceFilter({
                            ...priceFilter,
                            max: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="filter-section">
                    <h4>Status</h4>
                    <div className="checkbox-group">
                      {statusOptions.map((status) => (
                        <label
                          key={status}
                          className="checkbox-label"
                        >
                          <input
                            type="checkbox"
                            checked={statusFilter.includes(status)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setStatusFilter([...statusFilter, status]);
                              else
                                setStatusFilter(
                                  statusFilter.filter((s) => s !== status)
                                );
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
                      {paymentOptions.map((method) => (
                        <label
                          key={method}
                          className="checkbox-label"
                        >
                          <input
                            type="checkbox"
                            checked={paymentFilter.includes(method)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setPaymentFilter([...paymentFilter, method]);
                              else
                                setPaymentFilter(
                                  paymentFilter.filter((m) => m !== method)
                                );
                            }}
                          />
                          {method}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-cancel"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                  <button
                    className="btn-primary"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderManagement;
