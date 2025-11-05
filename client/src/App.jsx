import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
          <Route path="/adminDashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;