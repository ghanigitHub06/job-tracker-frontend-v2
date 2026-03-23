import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      const { data } = await API.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", data.email);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }

        .auth-wrap {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .auth-box {
          background: white; border-radius: 20px;
          padding: 2.5rem; width: 100%; max-width: 420px;
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
        .form-label {
          display: block; font-size: 0.8rem; font-weight: 600;
          color: #374151; margin-bottom: 0.4rem;
        }
        .form-input {
          width: 100%; padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 0.9rem;
          color: #1a1a2e; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102,126,234,0.15);
        }
        .pass-wrap { position: relative; }
        .pass-wrap .form-input { padding-right: 2.8rem; }
        .pass-toggle {
          position: absolute; right: 0.75rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9ca3af; font-size: 1rem; padding: 0.2rem;
          transition: color .2s;
        }
        .pass-toggle:hover { color: #667eea; }

        .auth-error {
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; border-radius: 8px;
          padding: 0.6rem 0.9rem; font-size: 0.82rem;
          margin-bottom: 1rem;
        }
        .auth-btn {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 10px;
          font-family: 'Inter', sans-serif; font-size: 0.95rem;
          font-weight: 600; cursor: pointer;
          transition: opacity .2s, transform .15s;
          margin-top: 0.5rem;
        }
        .auth-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-footer {
          text-align: center; margin-top: 1.5rem;
          font-size: 0.85rem; color: #6b7280;
        }
        .auth-footer a { color: #667eea; font-weight: 600; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-box">
          <div className="auth-logo">
            <div className="auth-logo-icon">💼</div>
            <h1>JobTracker</h1>
            <p>Create your free account</p>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Ganesh Kumar"
                value={form.name}
                onChange={handle}
                required
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pass-wrap">
                <input
                  className="form-input"
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handle}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
