import { useState } from "react";
import "../styles/login.css";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // TODO: login logic
    }, 1200);
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit} autoComplete="on">
        <h2 className="login-title">Log In</h2>
        {error && <div className="login-error">{error}</div>}

        <label className="login-label" htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </label>

        <label className="login-label" htmlFor="login-password">
          Password
          <div className="login-password-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="register-actions">
          <Link to="/register" className="register-link">
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
}
