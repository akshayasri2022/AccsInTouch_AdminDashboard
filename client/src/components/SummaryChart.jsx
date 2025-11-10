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

  return (
    <div style={{ width: "100%", height: 220 }}>
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