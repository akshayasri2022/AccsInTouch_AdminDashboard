import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

/* Pages */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProductManagement from "./pages/ProductManagement";


function RequireAuth({ children }) {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const location = useLocation();
  if (!isAuth) {
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />


      <Route
        path="/"
        element={
          <RequireAuth>
            <Navigate to="/dashboard" replace />
          </RequireAuth>
        }
      />

      
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

  <Route path="/product-management" element={<ProductManagement />} />


      
      <Route
        path="*"
        element={
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2>404 — Page not found</h2>
            <p>The page you requested does not exist.</p>
          </div>
        }
      />
    </Routes>
  );
}
