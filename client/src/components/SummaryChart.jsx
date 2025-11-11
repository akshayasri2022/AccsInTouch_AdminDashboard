import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function SummaryChart({ orders = [], timeRange = '7' }) {
  // Process orders data based on time range
  const chartData = useMemo(() => {
    const days = timeRange === '7' ? 7 : 30;
    
    // Get today's date at midnight
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Create array of dates for the range, going backwards from today
    const dateArray = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      dateArray.push(date);
    }
    
    // Initialize all dates with 0 orders
    const ordersByDate = {};
    dateArray.forEach(date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      ordersByDate[dateKey] = {
        date: dateKey,
        count: 0,
        revenue: 0
      };
    });
    
    // Fill in actual order data
    orders.forEach(order => {
      if (!order.orderDate) return;
      
      // Parse the date string
      const orderDate = new Date(order.orderDate);
      
      // Get local date components
      const year = orderDate.getFullYear();
      const month = String(orderDate.getMonth() + 1).padStart(2, '0');
      const day = String(orderDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      // Only include if within our date range
      if (ordersByDate[dateKey]) {
        ordersByDate[dateKey].count += 1;
        ordersByDate[dateKey].revenue += order.OrderedProduct?.price || 0;
      }
    });

    // Convert to array and format with X-axis labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return dateArray.map(date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const data = ordersByDate[dateKey];
      
      const dayNum = date.getDate();
      const monthName = monthNames[date.getMonth()];
      
      // Create X-axis label
      let xAxisLabel;
      if (days === 7) {
        // For 7 days: always show "Mon DD"
        xAxisLabel = `${monthName} ${dayNum}`;
      } else {
        // For 30 days: show month on 1st and 15th, otherwise just day number
        if (dayNum === 1 || dayNum === 15) {
          xAxisLabel = `${monthName} ${dayNum}`;
        } else {
          xAxisLabel = String(dayNum);
        }
      }
      
      return {
        day: xAxisLabel,
        value: data.count,
        revenue: data.revenue,
        fullDate: dateKey
      };
    });
  }, [orders, timeRange]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const dateParts = data.fullDate.split('-');
      const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const fullDateStr = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      
      return (
        <div style={{
          background: 'white',
          padding: '10px 14px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#1e293b' }}>
            {fullDateStr}
          </p>
          <p style={{ margin: '6px 0 0 0', color: '#4f46e5', fontSize: '13px', fontWeight: '500' }}>
            Orders: {data.value}
          </p>
          {data.revenue > 0 && (
            <p style={{ margin: '4px 0 0 0', color: '#10b981', fontSize: '13px', fontWeight: '500' }}>
              Revenue: ₹{data.revenue.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Dropdown styles
  const dropdownStyle = {
    padding: '4px 8px',
    fontSize: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    background: 'white',
    color: '#64748b',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <div style={{ width: "100%", height: 220 }}>
      <style>
        {`
          /* Dropdown Button */
          .stats-dropdown {
            padding: 6px 12px;
            font-size: 13px;
            font-weight: 500;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            color: #475569;
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          
          .stats-dropdown:hover {
            border-color: #cbd5e1;
            background: #f8fafc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
          }
          
          .stats-dropdown:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          }
          
          .stats-dropdown:active {
            transform: translateY(1px);
          }

          /* Dropdown Container */
          .dropdown-container {
            position: relative;
            display: inline-block;
          }

          /* Dropdown Menu */
          .dropdown-menu {
            position: absolute;
            top: calc(100% + 4px);
            right: 0;
            min-width: 160px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
            padding: 4px;
            z-index: 50;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
          }

          .dropdown-menu.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          /* Dropdown Items */
          .dropdown-item {
            padding: 8px 12px;
            font-size: 13px;
            color: #475569;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
          }

          .dropdown-item:hover {
            background: #f1f5f9;
            color: #1e293b;
          }

          .dropdown-item.active {
            background: #eef2ff;
            color: #4f46e5;
            font-weight: 500;
          }

          .dropdown-item:active {
            transform: scale(0.98);
          }

          /* Dropdown Divider */
          .dropdown-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 4px 0;
          }

          /* Dropdown Icon */
          .dropdown-icon {
            width: 16px;
            height: 16px;
            transition: transform 0.2s ease;
          }

          .stats-dropdown.open .dropdown-icon {
            transform: rotate(180deg);
          }

          /* Dropdown Label */
          .dropdown-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 12px 4px 12px;
            font-weight: 600;
          }
        `}
      </style>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData} 
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: timeRange === '30' ? 9 : 10 }} 
            interval={0}
            angle={0}
            textAnchor="middle"
            height={30}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }} />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 0, 0]} 
            fill="#4f46e5" 
            barSize={timeRange === '7' ? 24 : 10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}