import React from "react";
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


export default function Dashboard() {
  // exactly three cards matching the screenshot; pass variant/topMeta/meta
  const stats = [
    {
      title: "Abandoned Cart",
      value: "20%",
      subtitle: "+0.00%",
      topMeta: "Customers",
      meta: [{ label: "Customers", value: "30" }],
      variant: "cart",
    },
    {
      title: "Customers",
      value: "1,250",
      subtitle: "+15.80%",
      topMeta: "Active",
      meta: [{ label: "Active", value: "1,180" }],
      variant: "customers",
    },
    {
      title: "All Orders",
      value: "0",
      subtitle: "—",
      topMeta: "",
      meta: [
        { label: "Pending", value: "0" },
        { label: "Completed", value: "0", extra: "+0.00%" },
      ],
      variant: "orders",
    },
  ];

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar />
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="stats-row">
              {stats.map((s, i) => (
                <StatsCard key={i} {...s} />
              ))}
            </div>

            <div className="cols">
              <div className="left-col">
                <div className="panel chart-panel">
                  <div className="panel-head">
                    <h3>Summary</h3>
                    <div className="panel-actions">
                      <select defaultValue="7">
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="chart-wrapper">
                    <SummaryChart />
                  </div>
                </div>
              </div>

              <div className="right-col">
                <div className="panel orders-panel">
                  <div className="panel-head">
                    <h3>Recent Orders</h3>
                    <div className="small-muted">All</div>
                  </div>
                  <OrdersList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}