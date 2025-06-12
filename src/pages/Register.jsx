import { useState } from "react";
import "../styles/register.css";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // TODO: handle registration result
    }, 1200);
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit} autoComplete="on">
        <h2 className="register-title">Create Account</h2>

        {error && (
          <div className="register-error" role="alert">
            {error}
          </div>
        )}

        <label className="register-label" htmlFor="register-username">
          Username
          <input
            id="register-username"
            type="text"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourusername"
            required
            aria-label="Username"
            autoComplete="username"
          />
        </label>

        <label className="register-label" htmlFor="register-email">
          Email
          <input
            id="register-email"
            type="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            aria-label="Email"
            autoComplete="email"
          />
        </label>

        <label className="register-label" htmlFor="register-password">
          Password
          <div className="register-password-wrapper">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              className="register-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              aria-label="Password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>

            <div className="register-actions">
              <Link to="/login" className="register-link">
                Already have an account?
              </Link>
            </div>

        <button
          type="submit"
          className="register-button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
