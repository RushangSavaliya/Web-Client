// File: src/pages/LoginPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data);
      } else {
        const err = await res.json();
        alert(err.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-sm shadow-md bg-base-100 p-6 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div className="form-control">
          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            className="input input-bordered"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-control relative">
          <label className="label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="input input-bordered pr-10"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span
            className="absolute right-3 top-10 text-sm cursor-pointer select-none"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button className="btn btn-primary w-full mt-2" type="submit">
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
