import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCard from "../components/StatsCard";
import OrdersList from "../components/OrdersList";
import SummaryChart from "../components/SummaryChart";
import "../styles/Dashboard.css";

export default function Dashboard() {
  // sample stats
  const stats = [
    { title: "Abandoned Cart", value: "20%", subtitle: "+0.00%" },
    { title: "Customers", value: "1,250", subtitle: "+6.80%" },
    { title: "Active", value: "1,180", subtitle: "-4.90%" },
    { title: "All Orders", value: "0", subtitle: "—" },
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
