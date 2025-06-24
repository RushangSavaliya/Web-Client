import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer"; // ✅ Import Footer
import axiosInstance from "../lib/axios";

// =====================
// LoginPage Component
// =====================
function LoginPage({ onLogin }) {
  // ---------------------
  // State Management
  // ---------------------
  const [form, setForm] = useState({ usernameORemail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ---------------------
  // Handle Input Change
  // ---------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------------
  // Handle Form Submit
  // ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { usernameORemail, password } = form;
    if (!usernameORemail || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", form);
      const { token } = res.data;

      if (token) {
        const success = await onLogin(token);
        if (success) {
          navigate("/");
        } else {
          toast.error("Session validation failed");
        }
      } else {
        toast.error("Login failed: Token missing");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 px-4">
      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center">
        <div>
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl">
              💬
            </div>
            <h1 className="text-3xl font-semibold text-base-content mb-2">
              Welcome back
            </h1>
            <p className="text-base text-base-content/60">
              Sign in to your account
            </p>
          </div>

          {/* Login Form Section */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm">
            <form
              className="card bg-base-100 w-full max-w-sm space-y-4"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold text-center">Login</h2>

              {/* Username/Email Input */}
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

              {/* Password Input */}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Register Link */}
              <p className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="link link-hover text-primary">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer /> {/* ✅ Added Footer at bottom */}
    </div>
  );
}

export default LoginPage;
