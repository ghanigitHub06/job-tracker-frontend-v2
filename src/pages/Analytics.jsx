import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name") || "User";

  useEffect(() => {
    API.get("/jobs/analytics")
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
        } else {
          toast.error("Failed to load analytics");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const STATUS = [
    { key: "WISHLIST", label: "Wishlist", color: "#7c3aed", bg: "#ede9fe" },
    { key: "APPLIED", label: "Applied", color: "#2563eb", bg: "#dbeafe" },
    { key: "INTERVIEW", label: "Interview", color: "#d97706", bg: "#fef3c7" },
    { key: "OFFER", label: "Offer", color: "#059669", bg: "#d1fae5" },
    { key: "REJECTED", label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; }

        .nav {
          background: white; border-bottom: 1px solid #e5e7eb;
          padding: 0 1.5rem; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .nav-logo { font-weight: 700; font-size: 1.1rem; color: #1a1a2e; }
        .nav-links { display: flex; gap: 0.25rem; }
        .nav-link {
          padding: 0.4rem 0.9rem; border-radius: 8px;
          font-size: 0.85rem; font-weight: 500; color: #6b7280;
          text-decoration: none; transition: all .15s;
        }
        .nav-link:hover { background: #f3f4f6; color: #1a1a2e; }
        .nav-link.active { background: #667eea; color: white; }
        .nav-right { display: flex; align-items: center; gap: 0.75rem; }
        .nav-name { font-size: 0.85rem; color: #6b7280; }
        .nav-logout {
          padding: 0.4rem 0.9rem; border-radius: 8px;
          border: 1px solid #e5e7eb; background: none;
          font-family: 'Inter', sans-serif; font-size: 0.82rem;
          color: #6b7280; cursor: pointer; transition: all .15s;
        }
        .nav-logout:hover { border-color: #dc2626; color: #dc2626; }

        .main { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }
        .page-title { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; margin-bottom: 0.25rem; }
        .page-sub { font-size: 0.82rem; color: #9ca3af; margin-bottom: 1.5rem; }

        .stat-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 1rem; margin-bottom: 1.5rem;
        }
        .stat-card {
          background: white; border-radius: 12px;
          padding: 1.25rem; border: 1px solid #f1f5f9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .stat-label { font-size: 0.78rem; color: #9ca3af; font-weight: 500; margin-bottom: 0.4rem; }
        .stat-val { font-size: 2rem; font-weight: 800; line-height: 1; }

        .section {
          background: white; border-radius: 12px;
          padding: 1.5rem; border: 1px solid #f1f5f9;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          margin-bottom: 1rem;
        }
        .section-title { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; margin-bottom: 1rem; }

        .breakdown-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem;
        }
        .breakdown-item {
          border-radius: 10px; padding: 1rem; text-align: center;
        }
        .breakdown-count { font-size: 1.8rem; font-weight: 800; line-height: 1; }
        .breakdown-label {
          font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .04em; margin-top: 0.3rem;
        }
        .breakdown-pct { font-size: 0.7rem; color: #9ca3af; margin-top: 0.2rem; }

        /* Simple bar chart */
        .bar-chart { display: flex; flex-direction: column; gap: 0.6rem; }
        .bar-row { display: flex; align-items: center; gap: 0.75rem; }
        .bar-label { font-size: 0.78rem; color: #6b7280; width: 60px; flex-shrink: 0; }
        .bar-track { flex: 1; background: #f1f5f9; border-radius: 100px; height: 8px; }
        .bar-fill { height: 8px; border-radius: 100px; background: linear-gradient(90deg, #667eea, #764ba2); transition: width .4s; }
        .bar-count { font-size: 0.78rem; font-weight: 600; color: #1a1a2e; width: 24px; }

        @media (max-width: 700px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
          .breakdown-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <nav className="nav">
        <div className="nav-logo">💼 JobTracker</div>
        <div className="nav-links">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link active" to="/analytics">
            Analytics
          </Link>
        </div>
        <div className="nav-right">
          <span className="nav-name">Hi, {name.split(" ")[0]} 👋</span>
          <button className="nav-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="main">
        <div className="page-title">Analytics</div>
        <div className="page-sub">Your job search performance at a glance</div>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}
          >
            Loading analytics...
          </div>
        ) : !data ? null : (
          <>
            {/* Stat Cards */}
            <div className="stat-grid">
              {[
                {
                  label: "Total Applications",
                  val: data.totalApplications,
                  color: "#667eea",
                },
                {
                  label: "Interviews",
                  val: data.statusBreakdown?.INTERVIEW || 0,
                  color: "#d97706",
                },
                {
                  label: "Offers",
                  val: data.statusBreakdown?.OFFER || 0,
                  color: "#059669",
                },
                {
                  label: "Success Rate",
                  val: `${data.successRate?.toFixed(1)}%`,
                  color: "#7c3aed",
                },
              ].map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-val" style={{ color: s.color }}>
                    {s.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Breakdown */}
            <div className="section">
              <div className="section-title">Status Breakdown</div>
              <div className="breakdown-grid">
                {STATUS.map((s) => (
                  <div
                    className="breakdown-item"
                    key={s.key}
                    style={{ background: s.bg }}
                  >
                    <div className="breakdown-count" style={{ color: s.color }}>
                      {data.statusBreakdown?.[s.key] || 0}
                    </div>
                    <div className="breakdown-label" style={{ color: s.color }}>
                      {s.label}
                    </div>
                    <div className="breakdown-pct">
                      {data.totalApplications > 0
                        ? `${(((data.statusBreakdown?.[s.key] || 0) / data.totalApplications) * 100).toFixed(0)}%`
                        : "0%"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="section">
              <div className="section-title">Applications by Status</div>
              <div className="bar-chart">
                {STATUS.map((s) => {
                  const count = data.statusBreakdown?.[s.key] || 0;
                  const max = Math.max(
                    ...STATUS.map((st) => data.statusBreakdown?.[st.key] || 0),
                    1,
                  );
                  return (
                    <div className="bar-row" key={s.key}>
                      <div className="bar-label">{s.label}</div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(count / max) * 100}%`,
                            background: s.color,
                          }}
                        />
                      </div>
                      <div className="bar-count">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
