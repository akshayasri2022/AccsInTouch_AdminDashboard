import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProductManagement from "./pages/ProductManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Use /dashboard as the canonical dashboard path */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Product management */}
        <Route path="/ProductManagement" element={<ProductManagement />} />
        <Route path="/ProductManagement/add" element={<ProductManagement />} />

        {/* Fallback: redirect any unknown path to /dashboard (or change to / if you prefer) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
