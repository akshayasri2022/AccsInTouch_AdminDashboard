// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import OrderManagement from "./pages/Orders/OrderManagement.jsx";
import ProductManagement from "./pages/ProductManagement";
import EditProduct from "./pages/EditProduct";
import CustomerManagement from "./pages/CustomerManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminDashboard" element={<Dashboard />} />

        {/* Product Management */}
        <Route path="/productManagement" element={<ProductManagement />} />
        <Route path="/productManagement/add" element={<ProductManagement />} />
        <Route path="/productManagement/edit/:id" element={<EditProduct />} />

        {/* Order Management */}
        <Route path="/orderManagement" element={<OrderManagement />} />

        {/* Customer Management */}
        <Route path="/customerManagement" element={<CustomerManagement />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
