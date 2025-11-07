// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"
import OrderManagement from "./pages/Orders/OrderManagement";

import ProductManagement from "./pages/ProductManagement";
import EditProduct from "./pages/EditProduct";
import CustomerManagement from "./pages/CustomerManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/adminDashboard" element={<Dashboard />} />
          <Route path="/orderManagement" element={<OrderManagement />} />
        <Route path="/" element={<Login />} />

        {/* Canonical dashboard path */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Product management */}
        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/ProductManagement/add" element={<ProductManagement />} />
        <Route path="/productManagement/edit/:id" element={<EditProduct />} />

        {/* Order management */}
        

        {/* Customer management */}
        <Route path="/CustomerManagement" element={<CustomerManagement />} />

        {/* Fallback: redirect any unknown path to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
