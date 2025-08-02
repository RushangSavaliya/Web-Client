import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
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
        if (!form.identifier.trim()) errs.identifier = "Username or email is required";
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
        <div className="auth-container">
            <div className="auth-content">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <FaComments />
                        </div>
                        <h1 className="auth-title">Sign In</h1>
                        <p className="auth-subtitle">Welcome back! Please sign in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-field">
                            <input
                                ref={identifierRef}
                                name="identifier"
                                type="text"
                                className={`auth-input ${errors.identifier ? "error" : ""}`}
                                placeholder="Username or Email"
                                value={form.identifier}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                            {errors.identifier && (
                                <span className="field-error">{errors.identifier}</span>
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
                                    autoComplete="current-password"
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
                            disabled={loading || !form.identifier || !form.password}
                        >
                            {loading ? (
                                <div className="button-loading">
                                    <div className="spinner"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account?{" "}
                            <Link to="/register" className="auth-link">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
