import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    if (!username) return "Username is required.";
    if (!password) return "Password is required.";
    if (password.length < 6)
      return "Password must be at least 6 characters.";
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
      // Simulate API delay
      await new Promise((res) => setTimeout(res, 800));

      // Mock authentication success
      localStorage.setItem("isAuthenticated", "true");
      navigate("/adminDashboard");
    } catch (err) {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h2 className="login-title">Welcome back</h2>

        {error && <div className="login-error">{error}</div>}

        {/* Username Field */}
        <label className="field">
          <span className="label-text">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="input"
            required
          />
        </label>

        {/* Password Field with Eye Icon */}
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

        {/* <div className="footer-row">
          <button
            type="button"
            className="link-btn"
            onClick={() => alert("Reset password flow — implement as needed")}
          >
            Forgot password?
          </button>
        </div> */}
      </form>
    </div>
  );
}
