import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./auth.css";
import VandalHubLogo from "../common/VandalHubLogo";
import { Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("Signup attempt with:", { username, email, password: "***" });

    try {
      setLoading(true);
      console.log("Sending request to:", "http://localhost:3000/signup");

      const res = await axios.post("http://localhost:3000/signup", {
        email: email,
        password: password,
        username: username,
      });

      console.log("Signup response:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      console.log("Signup successful, redirecting...");
      window.location.href = "/";
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response?.data);
      alert(`Signup Failed! ${err.response?.data?.message || err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <VandalHubLogo size={64} className="logo-login" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <h1>Sign Up</h1>
        </div>

        <form onSubmit={handleSignup} className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Signup"}
          </button>
        </form>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
