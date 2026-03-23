import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const GUEST_JOBS = [
  { id: 1, company: "Google", role: "Software Engineer", status: "INTERVIEW", appliedDate: "2026-03-01", jobLink: "https://careers.google.com", notes: "Great interview experience!" },
  { id: 2, company: "Microsoft", role: "Frontend Developer", status: "APPLIED", appliedDate: "2026-03-05", jobLink: "https://careers.microsoft.com", notes: "Applied via LinkedIn" },
  { id: 3, company: "Amazon", role: "Backend Engineer", status: "REJECTED", appliedDate: "2026-02-20", jobLink: "https://amazon.jobs", notes: "OA failed" },
  { id: 4, company: "Stripe", role: "Full Stack Dev", status: "OFFER", appliedDate: "2026-02-15", jobLink: "https://stripe.com/jobs", notes: "₹45 LPA offer!" },
  { id: 5, company: "Swiggy", role: "SDE-1", status: "WISHLIST", appliedDate: "", jobLink: "", notes: "Apply next week" },
  { id: 6, company: "Razorpay", role: "React Developer", status: "APPLIED", appliedDate: "2026-03-10", jobLink: "", notes: "" },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      localStorage.removeItem("isGuest");
      localStorage.removeItem("guestJobs");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = () => {
    localStorage.clear();
    localStorage.setItem("isGuest", "true");
    localStorage.setItem("name", "Guest User");
    localStorage.setItem("token", "guest-token");
    localStorage.setItem("guestJobs", JSON.stringify(GUEST_JOBS));
    navigate("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        .auth-wrap {
          min-height: 100vh; display: flex; align-items: center;
          justify-content: center; padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .auth-box {
          background: white; border-radius: 20px; padding: 2.5rem;
          width: 100%; max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .auth-logo { text-align: center; margin-bottom: 2rem; }
        .auth-logo-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.75rem; font-size: 1.5rem;
        }
        .auth-logo h1 { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; }
        .auth-logo p { font-size: 0.85rem; color: #888; margin-top: 0.2rem; }
        .form-group { margin-bottom: 1.1rem; }
        .form-label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
        .form-input {
          width: 100%; padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 0.9rem;
          color: #1a1a2e; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.15); }
        .pass-wrap { position: relative; }
        .pass-wrap .form-input { padding-right: 2.8rem; }
        .pass-toggle {
          position: absolute; right: 0.75rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 1rem;
        }
        .pass-toggle:hover { color: #667eea; }
        .auth-error {
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; border-radius: 8px;
          padding: 0.6rem 0.9rem; font-size: 0.82rem; margin-bottom: 1rem;
        }
        .auth-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          font-weight: 600; cursor: pointer;
          transition: opacity .2s, transform .15s; margin-top: 0.5rem;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin: 1.25rem 0; color: #9ca3af; font-size: 0.78rem;
        }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }
        .guest-btn {
          width: 100%; padding: 0.85rem;
          background: #f8fafc; color: #374151;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          font-weight: 600; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .guest-btn:hover { border-color: #667eea; color: #667eea; background: rgba(102,126,234,0.04); }
        .guest-note { text-align: center; margin-top: 0.6rem; font-size: 0.72rem; color: #9ca3af; }
        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: #6b7280; }
        .auth-footer a { color: #667eea; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-box">
          <div className="auth-logo">
            <div className="auth-logo-icon">💼</div>
            <h1>JobTracker</h1>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input" type="email"
                placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input
                  className="form-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password"
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <div className="divider">or</div>

          <button className="guest-btn" onClick={guestLogin}>
            👤 Try as Guest
          </button>
          <p className="guest-note">No account needed · Sample data loaded · Register to save your data</p>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </>
  );
}