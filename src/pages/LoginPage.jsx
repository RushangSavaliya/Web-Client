// File: src/pages/LoginPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../lib/axios";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", form);
      const { token } = res.data;
      if (token) {
        localStorage.setItem("token", token);
        onLogin();
      } else {
        alert("Login failed: Token missing");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
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
            name="identifier"
            className="input input-bordered"
            value={form.identifier}
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

        <button type="submit" className="btn btn-primary w-full mt-2">
          Login
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="link link-hover text-primary">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
