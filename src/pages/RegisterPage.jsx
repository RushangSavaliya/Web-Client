import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer"; // ✅ Import Footer
import axiosInstance from "../lib/axios";

// =======================
// RegisterPage Component
// =======================
function RegisterPage() {
  // -----------------------
  // State Management
  // -----------------------
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // -----------------------
  // Handle Input Change
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------
  // Handle Form Submission
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { username, email, password } = form;

    // Validation
    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 px-4">
      <div className="flex-grow flex justify-center items-center">
        <div>
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl">
              💬
            </div>
            <h1 className="text-3xl font-semibold text-base-content mb-2">
              Create your account
            </h1>
            <p className="text-base text-base-content/60">
              Join the conversation now
            </p>
          </div>

          {/* Registration Form */}
          <form
            className="bg-base-100 border border-base-300 rounded-2xl shadow-sm p-6 w-full max-w-sm space-y-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-2xl font-bold text-center">Register</h2>

            {/* Username Input */}
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            {/* Email Input */}
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            {/* Password Input */}
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button
              className="btn btn-primary w-full mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-hover text-primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* Footer Section */}
      <Footer /> {/* ✅ Added Footer at bottom */}
    </div>
  );
}

// =======================
// FormInput Component
// =======================
function FormInput({ label, ...props }) {
  return (
    <div className="form-control">
      <label className="label">{label}</label>
      <input className="input input-bordered" required {...props} />
    </div>
  );
}

export default RegisterPage;
