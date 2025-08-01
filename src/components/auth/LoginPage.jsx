import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Footer from "../ui/Footer";
import axiosInstance from "../../lib/axios";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const identifierRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Email or username is required";
    if (!form.password) errs.password = "Password is required";
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
      const res = await axiosInstance.post("/auth/login", {
        usernameORemail: form.identifier,
        password: form.password,
      });

      const success = await onLogin(res.data.token);
      if (success) {
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error("Session validation failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
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
          <h1 className="form-title">Welcome Back</h1>
          <p className="text-sm opacity-75 mt-2">Sign in to continue chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <Input
            ref={identifierRef}
            name="identifier"
            label="Email or Username"
            value={form.identifier}
            onChange={handleChange}
            error={errors.identifier}
            autoComplete="username"
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
              autoComplete="current-password"
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
            disabled={!form.identifier || !form.password}
            className="w-full"
          >
            Sign In
          </Button>

          <div className="form-footer">
            Don't have an account?{" "}
            <Link to="/register" className="link font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
}

export default LoginPage;
