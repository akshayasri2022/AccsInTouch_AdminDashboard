import React from "react";
import "../styles/Dashboard.css";

const orders = [
  { id: 1, title: "iPhone 13", price: "₹730,000.00", qty: 1, date: "12 Sept 2022", status: "Pending" },
  { id: 2, title: "iPhone 13", price: "₹730,000.00", qty: 1, date: "12 Sept 2022", status: "Completed" },
  { id: 3, title: "iPhone 13", price: "₹730,000.00", qty: 1, date: "12 Sept 2022", status: "Pending" },
  { id: 4, title: "iPhone 13", price: "₹730,000.00", qty: 1, date: "12 Sept 2022", status: "Completed" },
  { id: 5, title: "iPhone 13", price: "₹730,000.00", qty: 1, date: "12 Sept 2022", status: "Pending" }
];

function Badge({ status }) {
  const cls = status === "Completed" ? "badge completed" : "badge pending";
  return <span className={cls}>{status}</span>;
}

export default function OrdersList() {
  return (
    <div className="orders-list">
      {orders.map((o) => (
        <div key={o.id} className="order-row">
          <div className="order-left">
            <div className="order-thumb" />
            <div className="order-info">
              <div className="order-title">{o.title}</div>
              <div className="order-meta">{o.price} × {o.qty}</div>
            </div>
          </div>
          <div className="order-right">
            <div className="order-date small-muted">{o.date}</div>
            <Badge status={o.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
