import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/TopbarShared.css";

import StatsCard from "../components/StatsCard";
import OrdersList from "../components/OrdersList";
import SummaryChart from "../components/SummaryChart";

/* Modular CSS imports */
import "../styles/Sidebar.css";
import "../styles/Dashboard.css";
import "../styles/StatsCard.css";
import "../styles/Panels.css";

// 🔹 NEW
import { useNavigate } from "react-router-dom";

const API_URL = 'https://acc-in-touch-1.onrender.com/api';

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderFilter, setOrderFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7');
  
  // Individual time filters for each stats card
  const [cartTimeFilter, setCartTimeFilter] = useState('all');
  const [customersTimeFilter, setCustomersTimeFilter] = useState('all');
  const [ordersTimeFilter, setOrdersTimeFilter] = useState('all');

  // 🔹 NEW – for navigation
  const navigate = useNavigate();

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  // Date filtering
  const filterByTimePeriod = (data, timeFilter, dateField = 'orderDate') => {
    if (timeFilter === 'all' || !data || data.length === 0) return data;

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    return data.filter(item => {
      let dateValue = item[dateField];
      
      if (!dateValue && dateField === 'orderDate') {
        dateValue = item.createdAt || item.date || item.created_at;
      } else if (!dateValue && dateField === 'createdAt') {
        dateValue = item.orderDate || item.date || item.created_at;
      }
      
      if (!dateValue) return false;
      
      let itemDate;
      try {
        itemDate = new Date(dateValue);
        if (isNaN(itemDate.getTime())) return false;
      } catch (e) {
        return false;
      }
      
      const itemDateStart = new Date(itemDate);
      itemDateStart.setHours(0, 0, 0, 0);
      
      const nowEnd = new Date(now);
      nowEnd.setHours(23, 59, 59, 999);
      
      if (timeFilter === 'week') {
        return itemDateStart >= sevenDaysAgo && itemDateStart <= nowEnd;
      } else if (timeFilter === 'month') {
        return itemDateStart >= thirtyDaysAgo && itemDateStart <= nowEnd;
      }
      
      return true;
    });
  };

  // Fetch customers from backend and merge with localStorage status
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customer`, getAuthHeaders());
      let customerData = Array.isArray(response.data) ? response.data : [];
      
      console.log('📊 CUSTOMERS FETCHED:', customerData.length);
      
      // Load unsynced customer data from localStorage (contains status updates)
      const LS_KEY = "cm_unsynced_customers_v1";
      let unsyncedCustomers = [];
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          unsyncedCustomers = JSON.parse(raw);
          console.log('💾 Loaded localStorage customer data:', unsyncedCustomers.length);
        }
      } catch (e) {
        console.warn("Failed to read unsynced from localStorage", e);
      }
      
      // Merge status from localStorage into fetched data
      customerData = customerData.map(customer => {
        // Find matching customer in localStorage by ID
        const localCustomer = unsyncedCustomers.find(
          u => String(u.id) === String(customer.id)
        );
        
        // If found in localStorage and has status, use that status
        if (localCustomer && localCustomer.status) {
          return {
            ...customer,
            name: customer.customerName || customer.name,
            email: customer.customerEmail || customer.email,
            phone: customer.phoneNumber || customer.phone,
            status: localCustomer.status, // Use status from localStorage
            orders: customer.orders || 0,
            balance: customer.balance || '$0'
          };
        }
        
        // Otherwise, default to "Active"
        return {
          ...customer,
          name: customer.customerName || customer.name,
          email: customer.customerEmail || customer.email,
          phone: customer.phoneNumber || customer.phone,
          status: 'Active', // Default status
          orders: customer.orders || 0,
          balance: customer.balance || '$0'
        };
      });
      
      console.log('✅ Customers with status merged:', customerData);
      if (customerData.length > 0) {
        console.log('🔍 First customer after merge:', customerData[0]);
      }
      
      setCustomers(customerData);
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/Order`, getAuthHeaders());
      const orderData = Array.isArray(response.data) ? response.data : [];
      console.log('📦 Orders fetched:', orderData.length);
      setOrders(orderData);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([fetchCustomers(), fetchOrders()]);
      } catch (err) {
        console.error('Data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Normalize order status
  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase().replace(/\s+/g, '');
  };

  const isCompletedStatus = (status) => {
    const normalized = normalizeStatus(status);
    return ['completed', 'delivered'].includes(normalized);
  };

  // Calculate stats from fetched data with time filters
  const calculateStats = () => {
    const filteredCustomers = filterByTimePeriod(customers, customersTimeFilter, 'createdAt');
    const filteredOrdersForCart = filterByTimePeriod(orders, cartTimeFilter, 'orderDate');
    const filteredOrdersForStats = filterByTimePeriod(orders, ordersTimeFilter, 'orderDate');

    const totalCustomers = filteredCustomers.length;
    
    console.log('=== ACTIVE CUSTOMER CALCULATION ===');
    console.log('Total customers:', totalCustomers);
    
    // SUPER DETAILED DEBUGGING - Log ALL customer data
    console.log('🔥 RAW CUSTOMER DATA:', JSON.stringify(filteredCustomers, null, 2));
    
    // Count active customers based on status field
    const activeCustomers = filteredCustomers.filter(c => {
      // Get status (should now be available from localStorage merge)
      const statusValue = c.status || c.customerStatus || c.Status || c.state || '';
      const statusStr = String(statusValue).toLowerCase().trim();
      
      // Check if explicitly "active"
      const isExplicitlyActive = statusStr === 'active';
      
      // Check if explicitly "blocked"  
      const isExplicitlyBlocked = statusStr === 'blocked';
      
      // ALWAYS log for debugging
      console.log(`🔍 Customer "${c.name || c.customerName}" (ID: ${c.id}):`, {
        rawStatus: c.status,
        statusValue,
        statusStr,
        isExplicitlyActive,
        isExplicitlyBlocked,
        '✅ IS ACTIVE?': isExplicitlyActive
      });
      
      return isExplicitlyActive;
    }).length;
    
    console.log(`✅ Active customers: ${activeCustomers} / ${totalCustomers}`);
    
    // Calculate customer growth
    let customerGrowth = '0%';
    if (customersTimeFilter !== 'all') {
      const allTimeCustomers = customers.length;
      if (allTimeCustomers > 0) {
        const growthPercent = ((totalCustomers / allTimeCustomers) * 100).toFixed(2);
        customerGrowth = `+${growthPercent}%`;
      }
    }
    
    // Order stats
    const totalOrders = filteredOrdersForStats.length;
    const completedOrders = filteredOrdersForStats.filter(o => 
      isCompletedStatus(o.orderStatus)
    ).length;
    const pendingOrders = filteredOrdersForStats.filter(o => 
      !isCompletedStatus(o.orderStatus)
    ).length;

    // Calculate abandoned cart
    const cartPendingOrders = filteredOrdersForCart.filter(o => 
      !isCompletedStatus(o.orderStatus)
    ).length;
    const cartTotalOrders = filteredOrdersForCart.length;
    const abandonedCartPercentage = cartTotalOrders > 0 
      ? Math.round((cartPendingOrders / cartTotalOrders) * 100) 
      : 0;

    // Calculate order completion growth
    let completedGrowth = '0%';
    if (ordersTimeFilter !== 'all' && orders.length > 0) {
      const allTimeCompleted = orders.filter(o => isCompletedStatus(o.orderStatus)).length;
      if (allTimeCompleted > 0) {
        const growthPercent = ((completedOrders / allTimeCompleted) * 100).toFixed(2);
        completedGrowth = `+${growthPercent}%`;
      }
    }

    return {
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        growth: customerGrowth
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        completedGrowth: completedGrowth
      },
      abandonedCart: {
        percentage: `${abandonedCartPercentage}%`,
        count: cartPendingOrders,
        growth: '+0.00%'
      }
    };
  };

  const stats = calculateStats();

  // Stats cards configuration
  const statsCards = [
  {
    title: "Abandoned Cart",
    value: stats.abandonedCart.percentage,
    subtitle: stats.abandonedCart.growth,
    topMeta: "Customers",
    meta: [{ label: "Customers", value: String(stats.abandonedCart.count) }],
    variant: "cart",
    timeFilter: cartTimeFilter,
    onTimeFilterChange: setCartTimeFilter,
    onClick: () => navigate("/orderManagement"),          // ✅ correct route
  },
  {
    title: "Customers",
    value: String(stats.customers.total),
    subtitle: stats.customers.growth,
    topMeta: "Active",
    meta: [{ label: "Active", value: String(stats.customers.active) }],
    variant: "customers",
    timeFilter: customersTimeFilter,
    onTimeFilterChange: setCustomersTimeFilter,
    onClick: () => navigate("/customerManagement"),       // ✅ correct route
  },
  {
    title: "All Orders",
    value: String(stats.orders.total),
    subtitle: "—",
    topMeta: "",
    meta: [
      { label: "Pending", value: String(stats.orders.pending) },
      { label: "Completed", value: String(stats.orders.completed), extra: stats.orders.completedGrowth },
    ],
    variant: "orders",
    timeFilter: ordersTimeFilter,
    onTimeFilterChange: setOrdersTimeFilter,
    onClick: () => navigate("/orderManagement"),          // ✅ correct route
  },
];


  if (loading) {
    return (
      <div className="dashboard-root">
        <Sidebar />
        <div className="dashboard-main">
          <Topbar />
          <div className="dashboard-content" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '60vh'
          }}>
            <div style={{
              background: 'white',
              padding: '24px 48px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              Loading dashboard data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-root">
        <Sidebar />
        <div className="dashboard-main">
          <Topbar />
          <div className="dashboard-content" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            height: '60vh',
            gap: '16px'
          }}>
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '24px 48px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#4f46e5',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="stats-row">
              {statsCards.map((s, i) => (
                <StatsCard key={i} {...s} />
              ))}
            </div>

            <div className="cols">
              <div className="left-col">
                <div className="panel chart-panel">
                  <div className="panel-head">
                    <h3>Summary</h3>
                    <div className="panel-actions">
                      <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <SummaryChart orders={orders} timeRange={timeRange} />
                  </div>
                </div>
              </div>

              <div className="right-col">
                <div className="panel orders-panel" style={{width:'25.3vw'}}>
                  <div className="panel-head">
                    <h3>Recent Orders</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setOrderFilter('all')}
                        style={{
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: orderFilter === 'all' ? '600' : '400',
                          color: orderFilter === 'all' ? '#6366f1' : '#94a3b8',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s'
                        }}
                      >
                        All
                      </button>
                    </div>
                  </div>
                  <OrdersList orders={orders} filter={orderFilter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
