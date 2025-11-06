import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
<<<<<<< HEAD
import Login from "./pages/Login"
import OrderManagement from "./pages/Orders/OrderManagement";
=======
import Login from "./pages/Login";
import ProductManagement from "./pages/ProductManagement";
import EditProduct from "./pages/EditProduct";


>>>>>>> acbc6a66a2ceea99a9ed5c3cff98d11b7ee05afb
function App() {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Login />} />
          <Route path="/adminDashboard" element={<Dashboard />} />
          <Route path="/orderManagement" element={<OrderManagement />} />
=======
        <Route path="/" element={<Login />} />

        {/* Use /dashboard as the canonical dashboard path */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Product management */}
        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/ProductManagement/add" element={<ProductManagement />} />
        <Route path="/ProductManagement/edit/:id" element={<EditProduct />} />

        {/* Fallback: redirect any unknown path to /dashboard (or change to / if you prefer) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
>>>>>>> acbc6a66a2ceea99a9ed5c3cff98d11b7ee05afb
      </Routes>
    </BrowserRouter>
  );
}

export default App;
