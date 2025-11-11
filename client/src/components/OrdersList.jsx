import React from "react";
import "../styles/Dashboard.css";

function Badge({ status }) {
  // Handle different status values from backend
  const statusLower = status?.toLowerCase() || '';
  
  // Normalize status by removing spaces and special characters
  const normalizedStatus = statusLower.replace(/\s+/g, '').replace(/-/g, '');
  
  // Determine if completed
  const isCompleted = ['completed', 'delivered'].includes(normalizedStatus);
  
  const cls = isCompleted ? "badge completed" : "badge pending";
  
  // Display enum values properly (convert PascalCase to readable format)
  let displayStatus = status || 'Pending';
  if (typeof displayStatus === 'string') {
    // Convert PascalCase to space-separated (e.g., "OutForDelivery" -> "Out For Delivery")
    displayStatus = displayStatus.replace(/([A-Z])/g, ' $1').trim();
  }
  
  return <span className={cls}>{displayStatus}</span>;
}

export default function OrdersList({ orders = [], filter = 'all' }) {
  
  // Normalize status helper
  const normalizeStatus = (status) => {
    if (!status) return '';
    return status.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  };
  
  // Filter orders based on selected filter
  const getFilteredOrders = () => {
    let filtered = orders;
    
    console.log('OrdersList - Filtering orders:', {
      totalOrders: orders.length,
      filter: filter,
      sampleStatuses: orders.slice(0, 5).map(o => o.orderStatus)
    });
    
    if (filter !== 'all') {
      filtered = orders.filter(order => {
        const normalizedStatus = normalizeStatus(order.orderStatus);
        
        if (filter === 'completed') {
          const isMatch = ['completed', 'delivered'].includes(normalizedStatus);
          console.log(`Order ${order.id} - Status: ${order.orderStatus}, Normalized: ${normalizedStatus}, Completed Match: ${isMatch}`);
          return isMatch;
        } else if (filter === 'pending') {
          const isMatch = ['pending', 'confirmed', 'packed', 'shipped', 'outfordelivery'].includes(normalizedStatus);
          console.log(`Order ${order.id} - Status: ${order.orderStatus}, Normalized: ${normalizedStatus}, Pending Match: ${isMatch}`);
          return isMatch;
        }
        
        return true;
      });
    }
    
    console.log('OrdersList - Filtered result:', {
      filteredCount: filtered.length,
      showing: Math.min(5, filtered.length)
    });
    
    // Get 5 most recent orders (sort by date if available)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.orderDate || a.createdAt || 0);
      const dateB = new Date(b.orderDate || b.createdAt || 0);
      return dateB - dateA; // Most recent first
    });
    
    return sorted.slice(0, 5);
  };
  
  const recentOrders = getFilteredOrders();
  
  // Show message if no orders
  if (recentOrders.length === 0) {
    return (
      <div className="orders-list">
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#999',
          fontSize: '14px'
        }}>
          No {filter !== 'all' ? filter : 'recent'} orders found
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list">
      {recentOrders.map((o) => (
        <div key={o.id} className="order-row">
          <div className="order-left">
            <div className="order-thumb" />
            <div className="order-info">
              <div className="order-title" style={{fontSize: '15px',}}>
                {o.OrderedProduct?.productName || 'Unknown Product'}
              </div>
              <div className="order-meta small-muted">
                ₹{o.OrderedProduct?.price?.toFixed(2) || '0.00'} × Qty: 1
              </div>
            </div>
          </div>
          <div className="order-right">
            <div className="order-date small-muted">
              {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : 'N/A'}
            </div>
            <Badge status={o.orderStatus} />
          </div>
        </div>
      ))}
    </div>
  );
}