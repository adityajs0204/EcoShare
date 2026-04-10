import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

/**
 * Register Page
 * Creates a new user account and logs them in immediately.
 */
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(data);
      toast.success(`Welcome to EcoShare, ${data.name}! 🌿`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
      background: "radial-gradient(ellipse at bottom right, rgba(99,102,241,0.08) 0%, transparent 50%), var(--color-bg)",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.375rem" }}>🌿</div>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
            Join <span className="gradient-text">EcoShare</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Greener campus, together.</p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ marginBottom: "0.375rem", fontSize: "1.3rem" }}>Create Account</h2>
          <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#10b981", fontWeight: 600 }}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="input"
                type="text"
                name="name"
                placeholder="Aditya Kumar"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="reg-email">Email address</label>
              <input
                id="reg-email"
                className="input"
                type="email"
                name="email"
                placeholder="you@campus.edu"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                className="input"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                className="input"
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              id="register-submit"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.375rem", padding: "0.875rem" }}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account 🚀"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.75rem", color: "#475569" }}>
          By registering, you agree to use EcoShare responsibly. 🌱
        </p>
      </div>
    </div>
  );
};

export default Register;
