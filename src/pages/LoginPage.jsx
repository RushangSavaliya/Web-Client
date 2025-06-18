// File: src/pages/LoginPage.jsx

import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

function LoginPage({ onLogin }) {
  // --- States ---
  const [form, setForm] = useState({ usernameORemail: "", password: "" });
  const [loading, setLoading] = useState(false);
  // --- End States ---

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit
    setLoading(true);

    const { usernameORemail, password } = form;
    if (!usernameORemail || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", form);
      const { token } = res.data;

      if (token) {
        const success = await onLogin(token);
        if (success) {
          navigate("/");
        } else {
          toast.error("Session validation failed");
          setLoading(false);
        }
      } else {
        toast.error("Login failed: Token missing");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
      setLoading(false); // allow retry
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form
        className="card bg-base-100 shadow-md w-full max-w-sm p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="form-control">
          <label className="label">Email or Username</label>
          <input
            type="text"
            name="usernameORemail"
            className="input input-bordered"
            value={form.usernameORemail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            className="input input-bordered"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="link link-hover text-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
