import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";             // ← ADDED import
import "../styles/TopbarShared.css";

import StatsCard from "../components/StatsCard";
import OrdersList from "../components/OrdersList";
import SummaryChart from "../components/SummaryChart";

/* Modular CSS imports */
import "../styles/Sidebar.css";
import "../styles/Dashboard.css";
import "../styles/StatsCard.css";
import "../styles/Panels.css";

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

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  // FIXED: Improved date filtering with proper date handling
  const filterByTimePeriod = (data, timeFilter, dateField = 'orderDate') => {
    if (timeFilter === 'all' || !data || data.length === 0) return data;

    const now = new Date();
    
    // For week: last 7 days including today
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days ago + today = 7 days
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // For month: last 30 days including today
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 29 days ago + today = 30 days
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    return data.filter(item => {
      // Try multiple date field possibilities
      let dateValue = item[dateField];
      
      // Fallback chain for different date field names
      if (!dateValue && dateField === 'orderDate') {
        dateValue = item.createdAt || item.date || item.created_at;
      } else if (!dateValue && dateField === 'createdAt') {
        dateValue = item.orderDate || item.date || item.created_at;
      }
      
      if (!dateValue) {
        console.warn('No date found for item:', item);
        return false;
      }
      
      // Parse date - handle both ISO strings and date objects
      let itemDate;
      try {
        itemDate = new Date(dateValue);
        
        // Validate parsed date
        if (isNaN(itemDate.getTime())) {
          console.warn('Invalid date:', dateValue);
          return false;
        }
      } catch (e) {
        console.warn('Error parsing date:', dateValue, e);
        return false;
      }
      
      // Set to start of day for accurate comparison
      const itemDateStart = new Date(itemDate);
      itemDateStart.setHours(0, 0, 0, 0);
      
      const nowEnd = new Date(now);
      nowEnd.setHours(23, 59, 59, 999);
      
      console.log(`Filtering ${dateField}:`, {
        original: dateValue,
        parsed: itemDateStart.toLocaleDateString(),
        filter: timeFilter,
        sevenDaysAgo: sevenDaysAgo.toLocaleDateString(),
        thirtyDaysAgo: thirtyDaysAgo.toLocaleDateString(),
        today: nowEnd.toLocaleDateString()
      });
      
      if (timeFilter === 'week') {
        const isInRange = itemDateStart >= sevenDaysAgo && itemDateStart <= nowEnd;
        console.log(`Week filter: ${isInRange}`);
        return isInRange;
      } else if (timeFilter === 'month') {
        const isInRange = itemDateStart >= thirtyDaysAgo && itemDateStart <= nowEnd;
        console.log(`Month filter: ${isInRange}`);
        return isInRange;
      }
      
      return true;
    });
  };

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customer`, getAuthHeaders());
      const customerData = Array.isArray(response.data) ? response.data : [];
      console.log('Customers fetched:', customerData.length);
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/Order`, getAuthHeaders());
      const orderData = Array.isArray(response.data) ? response.data : [];
      console.log('Orders fetched:', orderData.length);
      
      // Log sample for debugging
      if (orderData.length > 0) {
        console.log('Sample order:', orderData[0]);
      }
      
      setOrders(orderData);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  // FIXED: Normalize order status for consistent comparison
  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase().replace(/\s+/g, '');
  };

  // FIXED: Better status checking
  const isCompletedStatus = (status) => {
    const normalized = normalizeStatus(status);
    return ['completed', 'delivered'].includes(normalized);
  };

  const isPendingStatus = (status) => {
    const normalized = normalizeStatus(status);
    return ['pending', 'confirmed', 'packed', 'shipped', 'outfordelivery'].includes(normalized);
  };

  // Calculate stats from fetched data with time filters
  const calculateStats = () => {
    // Filter data based on respective time filters
    const filteredCustomers = filterByTimePeriod(customers, customersTimeFilter, 'createdAt');
    const filteredOrdersForCart = filterByTimePeriod(orders, cartTimeFilter, 'orderDate');
    const filteredOrdersForStats = filterByTimePeriod(orders, ordersTimeFilter, 'orderDate');

    console.log('Stats Calculation:', {
      customersTimeFilter,
      totalCustomers: customers.length,
      filteredCustomers: filteredCustomers.length,
      cartTimeFilter,
      totalOrders: orders.length,
      filteredOrdersForCart: filteredOrdersForCart.length,
      ordersTimeFilter,
      filteredOrdersForStats: filteredOrdersForStats.length
    });

    // Customer stats - FIXED: Use actual customer status from backend
    const totalCustomers = filteredCustomers.length;
    const activeCustomers = filteredCustomers.filter(c => {
      // Check multiple possible status field names from backend
      const status = c.status || c.customerStatus || c.Status || '';
      const statusLower = status.toString().toLowerCase();
      
      // Active includes: 'active', 'Active', or any non-blocked status
      return statusLower === 'active' || (statusLower !== 'blocked' && statusLower !== 'inactive');
    }).length;
    
    // Calculate customer growth based on filter
    let customerGrowth = '0%';
    if (customersTimeFilter !== 'all') {
      const allTimeCustomers = customers.length;
      if (allTimeCustomers > 0) {
        const growthPercent = ((totalCustomers / allTimeCustomers) * 100).toFixed(2);
        customerGrowth = `+${growthPercent}%`;
      }
    } else {
      // For "all time", calculate based on recent additions
      const recentCustomers = filterByTimePeriod(customers, 'month', 'createdAt').length;
      const olderCustomers = customers.length - recentCustomers;
      if (olderCustomers > 0) {
        const growthPercent = ((recentCustomers / olderCustomers) * 100).toFixed(2);
        customerGrowth = `+${growthPercent}%`;
      }
    }
    
    // Order stats
    const totalOrders = filteredOrdersForStats.length;
    
    // Completed: only Completed and Delivered
    const completedOrders = filteredOrdersForStats.filter(o => 
      isCompletedStatus(o.orderStatus)
    ).length;
    
    // Pending: everything except Completed and Delivered
    const pendingOrders = filteredOrdersForStats.filter(o => 
      !isCompletedStatus(o.orderStatus)
    ).length;

    console.log('Order Status Breakdown:', {
      total: totalOrders,
      completed: completedOrders,
      pending: pendingOrders,
      statusSamples: filteredOrdersForStats.slice(0, 3).map(o => ({
        id: o.id,
        status: o.orderStatus,
        isCompleted: isCompletedStatus(o.orderStatus)
      }))
    });

    // Calculate abandoned cart based on filtered orders
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
    } else {
      const recentCompleted = filterByTimePeriod(orders, 'month', 'orderDate')
        .filter(o => isCompletedStatus(o.orderStatus)).length;
      const olderCompleted = orders.filter(o => isCompletedStatus(o.orderStatus)).length - recentCompleted;
      if (olderCompleted > 0) {
        const growthPercent = ((recentCompleted / olderCompleted) * 100).toFixed(2);
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
