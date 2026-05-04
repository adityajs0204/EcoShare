import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Login Page
 * Authenticates user and stores JWT in AuthContext + localStorage.
 */
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🌿`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      background: "radial-gradient(ellipse at top left, rgba(16,185,129,0.08) 0%, transparent 50%), var(--color-bg)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌿</div>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
            <span className="gradient-text">Eco</span>Share
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9375rem" }}>Campus Carpooling & Bike Sharing</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ marginBottom: "0.375rem", fontSize: "1.375rem" }}>Sign In</h2>
          <p style={{ color: "#64748b", marginBottom: "1.75rem", fontSize: "0.875rem" }}>
            New here?{" "}
            <Link to="/register" style={{ color: "#10b981", fontWeight: 600 }}>Create account</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="input"
                type="email"
                name="email"
                placeholder="you@campus.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem", padding: "0.875rem" }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div style={{
            marginTop: "1.5rem",
            padding: "0.875rem",
            background: "rgba(16,185,129,0.06)",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            color: "#64748b",
            lineHeight: 1.8,
          }}>
            💡 <strong style={{ color: "#94a3b8" }}>Demo credentials:</strong>
            <div style={{ marginTop: "0.375rem" }}>
              <span style={{ color: "#10b981" }}>Admin:</span> admin@ecoshare.com / password123
            </div>
            <div>
              <span style={{ color: "#10b981" }}>User:</span> aditya@gmail.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
