import React from "react";
import "../styles/Dashboard.css";

function Badge({ status }) {
  // Handle different status values from backend
  const statusLower = status?.toLowerCase() || '';
  
  // Determine if completed
  const isCompleted = ['completed', 'delivered'].includes(statusLower);
  
  const cls = isCompleted ? "badge completed" : "badge pending";
  
  // Display enum values properly (same as OrderManagement)
  const displayStatus = status?.replace(/([A-Z])/g, ' $1').trim() || 'Pending';
  
  return <span className={cls}>{displayStatus}</span>;
}

export default function OrdersList({ orders = [], filter = 'all' }) {
  
  // Filter orders based on selected filter
  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (filter !== 'all') {
      filtered = orders.filter(order => {
        const statusLower = order.orderStatus?.toLowerCase() || '';
        
        if (filter === 'completed') {
          return ['completed', 'delivered'].includes(statusLower);
        } else if (filter === 'pending') {
          return ['pending', 'confirmed', 'packed', 'shipped', 'outfordelivery'].includes(statusLower);
        }
        
        return true;
      });
    }
    
    // Get 5 most recent orders
    return filtered.slice(0, 5);
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
              <div className="order-title">
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