import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaComments, FaEye, FaEyeSlash } from "react-icons/fa";
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
            errs.username = "Required";
        } else if (username.length < 3) {
            errs.username = "Too short";
        }

        if (!email.trim()) {
            errs.email = "Required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Invalid email";
        }

        if (!password) {
            errs.password = "Required";
        } else if (password.length < 8) {
            errs.password = "Too short";
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
            toast.success("Account created!");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
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
                    <h1 className="form-title">Sign Up</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            ref={usernameRef}
                            name="username"
                            className={`input ${errors.username ? "input-error" : ""}`}
                            placeholder=" "
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                        <label className="form-label">Username</label>
                        {errors.username && (
                            <div className="form-error">{errors.username}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            className={`input ${errors.email ? "input-error" : ""}`}
                            placeholder=" "
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        <label className="form-label">Email</label>
                        {errors.email && (
                            <div className="form-error">{errors.email}</div>
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
                                autoComplete="new-password"
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
                        disabled={loading || !form.username || !form.email || !form.password}
                    >
                        {loading ? <div className="loading-spinner" /> : "Sign Up"}
                    </button>

                    <div className="form-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="link">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
