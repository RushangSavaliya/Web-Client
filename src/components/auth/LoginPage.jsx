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
        if (!form.identifier.trim()) errs.identifier = "Required";
        if (!form.password) errs.password = "Required";
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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="form-container">
                <div className="form-header">
                    <div className="form-icon">
                        <FaComments />
                    </div>
                    <h1 className="form-title">Sign In</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            ref={identifierRef}
                            name="identifier"
                            className={`input ${errors.identifier ? "input-error" : ""}`}
                            placeholder=" "
                            value={form.identifier}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                        <label className="form-label">Username or Email</label>
                        {errors.identifier && (
                            <div className="form-error">{errors.identifier}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className={`input ${errors.password ? "input-error" : ""}`}
                                placeholder=" "
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <label className="form-label">Password</label>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-60 hover:opacity-100"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="form-error">{errors.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading || !form.identifier || !form.password}
                    >
                        {loading ? <div className="loading-spinner" /> : "Sign In"}
                    </button>

                    <div className="form-footer">
                        Don't have an account?{" "}
                        <Link to="/register" className="link">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
