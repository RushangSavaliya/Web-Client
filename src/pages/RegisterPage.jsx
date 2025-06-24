import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({
    username: null,
    email: null,
    password: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let isValid = null;

    switch (name) {
      case "username":
        isValid =
          value.length >= 3 &&
          value.length <= 20 &&
          /^[a-zA-Z0-9_]+$/.test(value);
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "password":
        isValid = value.length >= 8;
        break;
      default:
        break;
    }

    setValidations((prev) => ({
      ...prev,
      [name]: value ? isValid : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const { username, email, password } = form;

    // Comprehensive validation
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/auth/register", {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      form.username.trim() &&
      form.email.trim() &&
      form.password.trim() &&
      validations.username === true &&
      validations.email === true &&
      validations.password === true
    );
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary text-primary-content flex items-center justify-center text-2xl">
            💬
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-base-content mb-2">
            Create account
          </h1>
          <p className="text-base-content/60">
            Join ChatApp and start connecting
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <FormInput
              label="Username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
              validation={validations.username}
              helpText="3-20 characters, letters, numbers, and underscores only"
              autoComplete="username"
            />

            {/* Email Field */}
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={loading}
              validation={validations.email}
              helpText="We'll use this to verify your account"
              autoComplete="email"
            />

            {/* Password Field */}
            <div className="form-control">
              <label className="label pb-2">
                <span className="label-text text-sm font-medium text-base-content">
                  Password
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`input input-bordered w-full h-12 text-base pr-12 ${
                    validations.password === true
                      ? "input-success"
                      : validations.password === false
                        ? "input-error"
                        : ""
                  }`}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.121 15.12m0 0l4.243 4.242M15.121 15.12L19.364 19.364"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="label">
                <span className="label-text-alt text-base-content/60">
                  At least 8 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid()}
              className="btn btn-primary w-full h-12 text-base font-medium"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-base-content/60">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-focus transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, validation, helpText, ...props }) {
  return (
    <div className="form-control">
      <label className="label pb-2">
        <span className="label-text text-sm font-medium text-base-content">
          {label}
        </span>
      </label>
      <input
        className={`input input-bordered w-full h-12 text-base ${
          validation === true
            ? "input-success"
            : validation === false
              ? "input-error"
              : ""
        }`}
        {...props}
      />
      {helpText && (
        <div className="label">
          <span className="label-text-alt text-base-content/60">
            {helpText}
          </span>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
