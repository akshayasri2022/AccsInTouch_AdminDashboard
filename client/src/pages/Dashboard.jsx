import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import OrdersList from "../components/OrdersList";
import SummaryChart from "../components/SummaryChart";

/* Modular CSS imports */
import "../styles/Sidebar.css";
import "../styles/Topbar.css";
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

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/Customer`, getAuthHeaders());
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers');
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/Order`, getAuthHeaders());
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCustomers(), fetchOrders()]);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Calculate stats from fetched data
  const calculateStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'Active').length;
    
    const totalOrders = orders.length;
    
    // Completed: only Completed and Delivered
    const completedOrders = orders.filter(o => {
      const statusLower = o.orderStatus?.toLowerCase() || '';
      return ['completed', 'delivered'].includes(statusLower);
    }).length;
    
    // Pending: everything except Completed and Delivered
    const pendingOrders = orders.filter(o => {
      const statusLower = o.orderStatus?.toLowerCase() || '';
      return !['completed', 'delivered'].includes(statusLower);
    }).length;

    // Calculate abandoned cart (placeholder calculation - adjust based on your logic)
    const abandonedCartPercentage = totalOrders > 0 
      ? Math.round((pendingOrders / totalOrders) * 100) 
      : 0;

    return {
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        growth: totalCustomers > 0 ? '+15.80%' : '0%' // You can calculate actual growth if you have historical data
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        completedGrowth: '+0.00%' // Calculate based on your business logic
      },
      abandonedCart: {
        percentage: `${abandonedCartPercentage}%`,
        count: pendingOrders,
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
    },
    {
      title: "Customers",
      value: String(stats.customers.total),
      subtitle: stats.customers.growth,
      topMeta: "Active",
      meta: [{ label: "Active", value: String(stats.customers.active) }],
      variant: "customers",
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
            height: '60vh'
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
                <div className="panel orders-panel">
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