import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import VandalHubLogo from "../common/VandalHubLogo";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setCurrentUser, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/login", {
        email: email.trim(),
        password: password,
      });

      if (res.data.token && res.data.userId) {
        // Store authentication data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        // Update auth context
        setCurrentUser(res.data.userId);

        // Show success message
        setSuccess("Login successful! Redirecting to dashboard...");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError("Invalid email or password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR') {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">


      <div className="login-content">
        <div className="login-box-wrapper">
          <div className="login-header">
            <div className="login-logo-container">
              <VandalHubLogo size={64} showText={false} />
            </div>

            <div className="login-heading">
              <h2 className="signin-title">Sign in to VandalHub</h2>
            </div>
          </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="message error-message">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span className="message-icon">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-box">
          <div className="input-group">
            <label className="label" htmlFor="email">Email address</label>
            <div className="input-container">
              <input
                autoComplete="email"
                name="email"
                id="email"
                className="input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <div className="input-group">
            <label className="label" htmlFor="password">Password</label>
            <div className="input-container">
              <input
                autoComplete="current-password"
                name="password"
                id="password"
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <div className="input-glow"></div>
            </div>
          </div>

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <span className="btn-text">
              {loading ? "Signing in..." : "Sign in"}
            </span>
            <div className="btn-shine"></div>
            <div className="btn-glow"></div>
          </button>
        </form>

        <div className="pass-box">
          <p>
            New to VandalHub? <Link to="/signup" className="signup-link">Create an account</Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: demo@vandalhub.com</p>
          <p>Password: demo123</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
