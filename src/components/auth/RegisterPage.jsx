import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Footer from "../ui/Footer";
import axiosInstance from "../../lib/axios";

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    const { username, email, password } = form;

    if (!username.trim()) {
      errs.username = "Username is required";
    } else if (username.length < 3 || username.length > 20) {
      errs.username = "Username must be 3-20 characters";
    }

    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;

    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", form);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="form-header">
          <div className="form-icon">
            <FaComments />
          </div>
          <h1 className="form-title">Create Account</h1>
          <p className="text-sm opacity-75 mt-2">Join the conversation today</p>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <Input
            ref={usernameRef}
            name="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            autoComplete="username"
            autoCapitalize="none"
          />

          <Input
            type="email"
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            autoCapitalize="none"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded opacity-60 hover:opacity-100 transition-opacity"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={!form.username || !form.email || !form.password}
            className="w-full"
          >
            Create Account
          </Button>

          <div className="form-footer">
            Already have an account?{" "}
            <Link to="/login" className="link font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}

export default RegisterPage;
