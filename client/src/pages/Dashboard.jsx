import React, { useState, useMemo } from "react";
import { Search, Download, Filter, Edit2, Eye, Trash2, X, Bell, ChevronDown, ChevronUp, Menu, Package, Users, Settings, LogOut, ShoppingBag, BarChart3, TrendingUp, ShoppingCart, UserCheck } from 'lucide-react';
import Sidebar from "../components/Sidebar";
// Shared orders data
const ordersData = [
  {
    id: 'SO1002',
    product: 'Organza Bow',
    variants: 3,
    date: '2024-11-06',
    customer: 'John Bushnell',
    total: 121.00,
    payment: 'Mastercard',
    status: 'Delivered',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, New York, NY',
    orderType: 'Website Order',
    orderNote: '',
    time: '2:00 PM',
    cartAbandoned: false
  },
  {
    id: 'SO1011',
    product: 'Purple Claw Clip',
    variants: 2,
    date: '2024-11-05',
    customer: 'Linda Blair',
    total: 950.00,
    payment: 'Visa',
    status: 'Shipped',
    email: 'linda@example.com',
    phone: '+1234567891',
    address: '456 Oak Ave, Los Angeles, CA',
    orderType: 'Marketplace Order',
    orderNote: 'Fragile item',
    time: '3:00 PM',
    cartAbandoned: false
  },
  {
    id: 'SO1015',
    product: 'Gold Bow',
    variants: 3,
    date: '2024-11-04',
    customer: 'Mike Ross',
    total: 348.00,
    payment: 'UPI',
    status: 'Out for Delivery',
    email: 'mike@example.com',
    phone: '+1234567892',
    address: '789 Pine Rd, Chicago, IL',
    orderType: 'In-Store Purchase',
    orderNote: 'Gift wrap',
    time: '11:00 AM',
    cartAbandoned: false
  },
  {
    id: 'SO1020',
    product: 'Red Bow',
    variants: 4,
    date: '2024-11-03',
    customer: 'Sarah Connor',
    total: 607.00,
    payment: 'Cash on Delivery (COD)',
    status: 'Cancelled',
    email: 'sarah@example.com',
    phone: '+1234567893',
    address: '101 Elm St, Boston, MA',
    orderType: 'Website Order',
    orderNote: 'Customer cancelled',
    time: '4:30 PM',
    cartAbandoned: true
  },
  {
    id: 'SO1025',
    product: 'Velvet Scrunchie',
    variants: 3,
    date: '2024-11-02',
    customer: 'Tom Hardy',
    total: 234.00,
    payment: 'Net Banking',
    status: 'Completed',
    email: 'tom@example.com',
    phone: '+1234567894',
    address: '202 Maple Dr, Seattle, WA',
    orderType: 'Marketplace Order',
    orderNote: '',
    time: '1:00 PM',
    cartAbandoned: false
  },
  {
    id: 'SO1026',
    product: 'Diamond Earring',
    variants: 1,
    date: '2024-11-01',
    customer: 'Emma Watson',
    total: 710.00,
    payment: 'Credit Card',
    status: 'Delivered',
    email: 'emma@example.com',
    phone: '+1234567895',
    address: '303 Oak St, Austin, TX',
    orderType: 'Website Order',
    orderNote: '',
    time: '10:00 AM',
    cartAbandoned: false
  },
  {
    id: 'SO1027',
    product: 'White Claw Clip',
    variants: 3,
    date: '2024-10-31',
    customer: 'Chris Evans',
    total: 400.00,
    payment: 'UPI',
    status: 'Pending',
    email: 'chris@example.com',
    phone: '+1234567896',
    address: '404 Pine Ave, Miami, FL',
    orderType: 'Marketplace Order',
    orderNote: '',
    time: '5:00 PM',
    cartAbandoned: true
  },
  {
    id: 'SO1028',
    product: 'Fluffy Scrunchie',
    variants: 2,
    date: '2024-10-30',
    customer: 'Robert Downey',
    total: 812.00,
    payment: 'Debit Card',
    status: 'Shipped',
    email: 'robert@example.com',
    phone: '+1234567897',
    address: '505 Maple Rd, Denver, CO',
    orderType: 'Website Order',
    orderNote: '',
    time: '12:00 PM',
    cartAbandoned: false
  }
];

// Unique customers
const uniqueCustomers = [...new Set(ordersData.map(o => o.customer))];

<Sidebar/>

// Topbar Component
const Topbar = () => {
  return (
    <div style={{
      height: '64px',
      width: '76vw',
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1a1a1a' }}>Overview</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <select style={{
          padding: '10px 16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          background: 'white',
          fontSize: '14px',
          cursor: 'pointer',
          outline: 'none'
        }}>
          <option>Accs In Touch</option>
        </select>
        <div style={{
          position: 'relative',
          width: '44px',
          height: '44px',
          background: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#ff4444',
            color: 'white',
            fontSize: '10px',
            padding: '3px 7px',
            borderRadius: '12px',
            fontWeight: '700'
          }}>3</span>
        </div>
        <div style={{
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          cursor: 'pointer'
        }}></div>
      </div>
    </div>
  );
};

// StatsCard Component with Time Range
const StatsCard = ({ title, value, subtitle, topMeta, meta, variant, timeRange, onTimeRangeChange }) => {
  const getIcon = () => {
    if (variant === 'cart') return <ShoppingCart size={24} />;
    if (variant === 'customers') return <UserCheck size={24} />;
    if (variant === 'orders') return <ShoppingBag size={24} />;
    return <TrendingUp size={24} />;
  };

  const getColor = () => {
    if (variant === 'cart') return '#ff6b6b';
    if (variant === 'customers') return '#4ecdc4';
    if (variant === 'orders') return '#5856D6';
    return '#667eea';
  };

  return (
    <div style={{
      flex: 1,
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '13px', color: '#666', fontWeight: '600', marginBottom: '8px' }}>{title}</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '13px', color: subtitle.includes('+') ? '#27ae60' : '#999', fontWeight: '600' }}>
            {subtitle}
          </div>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${getColor()}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getColor()
        }}>
          {getIcon()}
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>{topMeta}</span>
          <select 
            value={timeRange} 
            onChange={(e) => onTimeRangeChange(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        {meta.map((m, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: i < meta.length - 1 ? '8px' : '0'
          }}>
            <span style={{ fontSize: '13px', color: '#666' }}>{m.label}</span>
            <div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{m.value}</span>
              {m.extra && <span style={{ fontSize: '12px', color: '#27ae60', marginLeft: '6px' }}>{m.extra}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// OrdersList Component
const OrdersList = ({ orders }) => {
  const recentOrders = orders.slice(0, 5);

  const getStatusColor = (status) => {
    const lower = status.toLowerCase();
    if (['delivered', 'completed'].includes(lower)) return '#27ae60';
    if (lower === 'cancelled') return '#e74c3c';
    return '#f39c12';
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {recentOrders.map((order, i) => (
        <div key={order.id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
          borderBottom: i < recentOrders.length - 1 ? '1px solid #f0f0f0' : 'none'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
              {order.product}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>{order.customer}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
              ₹{order.total.toFixed(2)}
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: getStatusColor(order.status),
              padding: '4px 8px',
              borderRadius: '4px',
              background: `${getStatusColor(order.status)}15`,
              display: 'inline-block'
            }}>
              {order.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// SummaryChart Component
const SummaryChart = ({ data, timeRange }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#5856D6' }}>
              ₹{item.value}
            </div>
            <div style={{
              width: '100%',
              height: `${(item.value / maxValue) * 100}%`,
              minHeight: '40px',
              background: 'linear-gradient(180deg, #5856D6 0%, #7b79e8 100%)',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.3s ease'
            }}></div>
            <div style={{ fontSize: '11px', color: '#666', fontWeight: '500' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const [cartTimeRange, setCartTimeRange] = useState('week');
  const [customersTimeRange, setCustomersTimeRange] = useState('week');
  const [ordersTimeRange, setOrdersTimeRange] = useState('week');
  const [chartTimeRange, setChartTimeRange] = useState('7');

  // Helper function to filter by date range
  const filterByTimeRange = (timeRange) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return ordersData.filter(order => {
      const orderDate = new Date(order.date);
      
      if (timeRange === 'today') {
        return orderDate >= today;
      } else if (timeRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return orderDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return orderDate >= monthAgo;
      }
      return true;
    });
  };

  // Calculate stats with time ranges
  const cartStats = useMemo(() => {
    const filtered = filterByTimeRange(cartTimeRange);
    const abandoned = filtered.filter(o => o.cartAbandoned || o.status === 'Cancelled');
    const percentage = filtered.length > 0 ? ((abandoned.length / filtered.length) * 100).toFixed(2) : 0;
    const customers = abandoned.length;
    
    return {
      percentage: `${percentage}%`,
      customers: customers.toString(),
      change: '+0.00%'
    };
  }, [cartTimeRange]);

  const customersStats = useMemo(() => {
    const filtered = filterByTimeRange(customersTimeRange);
    const uniqueCustomersInRange = [...new Set(filtered.map(o => o.customer))];
    const activeCustomers = uniqueCustomersInRange.filter(customer => {
      const customerOrders = filtered.filter(o => o.customer === customer);
      return customerOrders.some(o => !['Cancelled', 'Pending'].includes(o.status));
    });
    
    const totalCustomers = uniqueCustomers.length;
    const change = totalCustomers > 0 ? ((uniqueCustomersInRange.length / totalCustomers) * 100).toFixed(2) : 0;
    
    return {
      total: totalCustomers.toLocaleString(),
      active: activeCustomers.length.toString(),
      change: `+${change}%`
    };
  }, [customersTimeRange]);

  const ordersStats = useMemo(() => {
    const filtered = filterByTimeRange(ordersTimeRange);
    const pending = filtered.filter(o => o.status === 'Pending').length;
    const completed = filtered.filter(o => ['Delivered', 'Completed'].includes(o.status)).length;
    const completedChange = filtered.length > 0 ? ((completed / filtered.length) * 100).toFixed(2) : 0;
    
    return {
      total: filtered.length.toString(),
      pending: pending.toString(),
      completed: completed.toString(),
      change: `+${completedChange}%`
    };
  }, [ordersTimeRange]);

  // Chart data based on selected range
  const chartData = useMemo(() => {
    const days = parseInt(chartTimeRange);
    const result = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayOrders = ordersData.filter(o => o.date === dateStr);
      const total = dayOrders.reduce((sum, o) => sum + o.total, 0);
      
      result.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(total)
      });
    }
    
    return result;
  }, [chartTimeRange]);

  const stats = [
    {
      title: "Abandoned Cart",
      value: cartStats.percentage,
      subtitle: cartStats.change,
      topMeta: "Customers",
      meta: [{ label: "Customers", value: cartStats.customers }],
      variant: "cart",
      timeRange: cartTimeRange,
      onTimeRangeChange: setCartTimeRange
    },
    {
      title: "Customers",
      value: customersStats.total,
      subtitle: customersStats.change,
      topMeta: "Active",
      meta: [{ label: "Active", value: customersStats.active }],
      variant: "customers",
      timeRange: customersTimeRange,
      onTimeRangeChange: setCustomersTimeRange
    },
    {
      title: "All Orders",
      value: ordersStats.total,
      subtitle: "—",
      topMeta: "",
      meta: [
        { label: "Pending", value: ordersStats.pending },
        { label: "Completed", value: ordersStats.completed, extra: ordersStats.change },
      ],
      variant: "orders",
      timeRange: ordersTimeRange,
      onTimeRangeChange: setOrdersTimeRange
    },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#f6f7fb' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />
        <div style={{ padding: '20px', boxSizing: 'border-box', width: '100%', overflowY: 'auto' }}>
          <div style={{ maxWidth: 'none', width: '100%', margin: 0 }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
              {stats.map((s, i) => (
                <StatsCard key={i} {...s} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 0', minWidth: '0' }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Summary</h3>
                    <select 
                      value={chartTimeRange} 
                      onChange={(e) => setChartTimeRange(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="7">Last 7 Days</option>
                      <option value="30">Last 30 Days</option>
                    </select>
                  </div>
                  <SummaryChart data={chartData} timeRange={chartTimeRange} />
                </div>
              </div>

              <div style={{ width: '360px', flex: '0 0 360px' }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>Recent Orders</h3>
                    <div style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>All</div>
                  </div>
                  <OrdersList orders={ordersData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}