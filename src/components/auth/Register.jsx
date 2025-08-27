// File: src/components/auth/Register.jsx

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../lib/httpClient";

function Register() {
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
        } else if (username.length < 3) {
            errs.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            errs.username = "Username can only contain letters, numbers, and underscores";
        }

        if (!email.trim()) {
            errs.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Please enter a valid email address";
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
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <FaComments />
                        </div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join us and start messaging today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <input
                                ref={usernameRef}
                                name="username"
                                type="text"
                                className={`auth-input ${errors.username ? "error" : ""}`}
                                placeholder="Username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                            {errors.username && (
                                <span className="field-error">{errors.username}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <input
                                name="email"
                                type="email"
                                className={`auth-input ${errors.email ? "error" : ""}`}
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <span className="field-error">{errors.email}</span>
                            )}
                        </div>

                        <div className="form-field">
                            <div className="password-field">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className={`auth-input ${errors.password ? "error" : ""}`}
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="field-error">{errors.password}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading || !form.username || !form.email || !form.password}
                        >
                            {loading ? (
                                <div className="button-loading">
                                    <div className="spinner"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
