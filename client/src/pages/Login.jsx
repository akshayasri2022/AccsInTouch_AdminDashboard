import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    if (!email.trim()) return "Email is required.";
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email.";
    
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:25186/api/login", {
        email: email.trim(),
        password,
      });

      // Store authentication data
      localStorage.setItem("isAuthenticated", "true");
      
      // Store token if backend returns it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      // Store user info
      if (response.data.email || email) {
        localStorage.setItem("email", response.data.email || email);
      }

      navigate("/adminDashboard");
    } catch (err) {
      console.error("Login Error:", err);
      
      // Handle specific error messages from backend
      if (err.response) {
        const message = err.response.data?.message || err.response.data?.error;
        setError(message || "Invalid email or password.");
      } else if (err.request) {
        setError("Unable to connect to server. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Welcome back</h2>

        {error && <div className="login-error">{error}</div>}

        <label className="field">
          <span className="label-text">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="input"
            required
          />
        </label>

        <label className="field">
          <span className="label-text">Password</span>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input password-input"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}