import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0f0f1a; color: white; }

        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 3rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky; top: 0; z-index: 50;
          background: rgba(15,15,26,0.85);
          backdrop-filter: blur(12px);
        }
        .logo { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.02em; }
        .logo span { color: #818cf8; }
        .nav-btns { display: flex; gap: 0.75rem; }
        .btn-ghost {
          background: none; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); border-radius: 8px;
          padding: 0.5rem 1.1rem; font-family: 'Inter', sans-serif;
          font-size: 0.85rem; cursor: pointer; transition: all .2s;
        }
        .btn-ghost:hover { border-color: #818cf8; color: #818cf8; }
        .btn-solid {
          background: #818cf8; border: none; color: white;
          border-radius: 8px; padding: 0.5rem 1.1rem;
          font-family: 'Inter', sans-serif; font-size: 0.85rem;
          font-weight: 600; cursor: pointer; transition: all .2s;
        }
        .btn-solid:hover { background: #6366f1; transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 90vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 4rem 2rem;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 800px; border-radius: 50%;
          background: radial-gradient(circle, rgba(129,140,248,0.15) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.25);
          border-radius: 100px; padding: 0.3rem 0.9rem;
          font-size: 0.75rem; color: #818cf8; font-weight: 600;
          margin-bottom: 2rem; letter-spacing: .04em; text-transform: uppercase;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #818cf8; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800; line-height: 1.05;
          letter-spacing: -0.04em; margin-bottom: 1.5rem;
        }
        .hero h1 span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          max-width: 480px; color: rgba(255,255,255,0.45);
          font-size: 1.05rem; line-height: 1.7; margin-bottom: 2.5rem;
        }
        .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
        .hero-btn-primary {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          border: none; color: white; border-radius: 10px;
          padding: 0.9rem 2rem; font-family: 'Inter', sans-serif;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(129,140,248,0.35);
        }
        .hero-btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: white; border-radius: 10px;
          padding: 0.9rem 2rem; font-family: 'Inter', sans-serif;
          font-size: 1rem; cursor: pointer; transition: all .2s;
        }
        .hero-btn-secondary:hover { border-color: rgba(255,255,255,0.3); }

        /* PREVIEW */
        .preview-wrap {
          margin-top: 4rem; width: 100%; max-width: 800px;
          position: relative;
        }
        .preview-wrap::before {
          content: '';
          position: absolute; inset: -1px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(129,140,248,0.4), rgba(192,132,252,0.4));
          z-index: 0;
        }
        .preview-inner {
          position: relative; z-index: 1;
          background: #1a1a2e; border-radius: 15px; overflow: hidden;
        }
        .preview-bar {
          background: #13131f; padding: 0.75rem 1rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-url {
          flex: 1; text-align: center;
          color: rgba(255,255,255,0.2); font-size: 0.72rem;
        }
        .preview-cols {
          display: grid; grid-template-columns: repeat(5,1fr);
          gap: 0.5rem; padding: 0.75rem;
        }
        .preview-col { background: rgba(255,255,255,0.04); border-radius: 8px; padding: 0.5rem; }
        .preview-col-head {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .06em; margin-bottom: 0.4rem; padding-bottom: 0.4rem;
          border-bottom: 1.5px solid;
        }
        .preview-card {
          background: rgba(255,255,255,0.06); border-radius: 5px;
          padding: 0.4rem 0.5rem; margin-bottom: 0.3rem;
        }
        .preview-card-co { font-size: 0.6rem; font-weight: 700; color: white; }
        .preview-card-role { font-size: 0.55rem; color: rgba(255,255,255,0.35); }

        /* STATS */
        .stats {
          display: flex; justify-content: center; gap: 4rem;
          padding: 3rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .stat { text-align: center; }
        .stat-val {
          font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .stat-label { font-size: 0.8rem; color: rgba(255,255,255,0.35); margin-top: 0.25rem; }

        /* FEATURES */
        .features { padding: 5rem 2rem; max-width: 900px; margin: 0 auto; }
        .features-title {
          text-align: center; font-size: 2rem; font-weight: 800;
          letter-spacing: -0.03em; margin-bottom: 0.75rem;
        }
        .features-sub {
          text-align: center; color: rgba(255,255,255,0.35);
          font-size: 0.9rem; margin-bottom: 3rem;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem;
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 1.5rem;
          transition: border-color .2s, transform .2s;
        }
        .feature-card:hover {
          border-color: rgba(129,140,248,0.3);
          transform: translateY(-2px);
        }
        .feature-icon {
          font-size: 1.5rem; margin-bottom: 0.75rem;
          width: 44px; height: 44px; border-radius: 10px;
          background: rgba(129,140,248,0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .feature-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.4rem; }
        .feature-desc { color: rgba(255,255,255,0.35); font-size: 0.82rem; line-height: 1.6; }

        /* CTA */
        .cta {
          text-align: center; padding: 5rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .cta h2 {
          font-size: 2.2rem; font-weight: 800;
          letter-spacing: -0.03em; margin-bottom: 1rem;
        }
        .cta p { color: rgba(255,255,255,0.35); margin-bottom: 2rem; font-size: 0.9rem; }

        /* FOOTER */
        footer {
          text-align: center; padding: 1.5rem;
          color: rgba(255,255,255,0.2); font-size: 0.78rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        footer span { color: #818cf8; }

        @media (max-width: 700px) {
          .nav { padding: 1rem 1.5rem; }
          .stats { gap: 2rem; flex-wrap: wrap; }
          .features-grid { grid-template-columns: 1fr; }
          .preview-cols { grid-template-columns: repeat(3,1fr); }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">
          Job<span>Tracker</span>
        </div>
        <div className="nav-btns">
          <button className="btn-ghost" onClick={() => navigate("/login")}>
            Sign in
          </button>
          <button className="btn-solid" onClick={() => navigate("/register")}>
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <div className="badge-dot" />
          Free forever — no credit card needed
        </div>
        <h1>
          Track every job.
          <br />
          <span>Land your dream role.</span>
        </h1>
        <p className="hero-sub">
          The smartest way to manage your job search. Kanban pipeline,
          analytics, notes — all in one place.
        </p>
        <div className="hero-btns">
          <button
            className="hero-btn-primary"
            onClick={() => navigate("/register")}
          >
            Start tracking free →
          </button>
          <button
            className="hero-btn-secondary"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>

        {/* Mini preview */}
        <div className="preview-wrap">
          <div className="preview-inner">
            <div className="preview-bar">
              <div className="dot" style={{ background: "#ff5f57" }} />
              <div className="dot" style={{ background: "#febc2e" }} />
              <div className="dot" style={{ background: "#28c840" }} />
              <div className="preview-url">jobtracker.app — dashboard</div>
            </div>
            <div className="preview-cols">
              {[
                {
                  label: "Wishlist",
                  color: "#818cf8",
                  cards: [{ co: "Apple", role: "iOS Dev" }],
                },
                {
                  label: "Applied",
                  color: "#60a5fa",
                  cards: [
                    { co: "Google", role: "SWE" },
                    { co: "Stripe", role: "Backend" },
                  ],
                },
                {
                  label: "Interview",
                  color: "#fbbf24",
                  cards: [{ co: "Vercel", role: "Frontend" }],
                },
                {
                  label: "Offer",
                  color: "#34d399",
                  cards: [{ co: "Anthropic", role: "ML Eng" }],
                },
                {
                  label: "Rejected",
                  color: "#f87171",
                  cards: [{ co: "Meta", role: "iOS" }],
                },
              ].map((col) => (
                <div className="preview-col" key={col.label}>
                  <div
                    className="preview-col-head"
                    style={{ color: col.color, borderBottomColor: col.color }}
                  >
                    {col.label}
                  </div>
                  {col.cards.map((c) => (
                    <div className="preview-card" key={c.co}>
                      <div className="preview-card-co">{c.co}</div>
                      <div className="preview-card-role">{c.role}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {[
          { val: "5", label: "Pipeline stages" },
          { val: "∞", label: "Applications" },
          { val: "100%", label: "Free forever" },
          { val: "24/7", label: "Always available" },
        ].map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features">
        <div className="features-title">Everything you need</div>
        <div className="features-sub">Built for serious job seekers</div>
        <div className="features-grid">
          {[
            {
              icon: "⚡",
              title: "Kanban Pipeline",
              desc: "5 stages from Wishlist to Offer. Visualize your entire job search at a glance.",
            },
            {
              icon: "📊",
              title: "Analytics",
              desc: "Track success rates, weekly applications, and stage breakdowns.",
            },
            {
              icon: "🔐",
              title: "Secure & Private",
              desc: "JWT authentication keeps your data safe and private.",
            },
            {
              icon: "🔗",
              title: "Job Links & Notes",
              desc: "Save job posting links and notes for every application.",
            },
            {
              icon: "📅",
              title: "Applied Dates",
              desc: "Track when you applied to follow up at the right time.",
            },
            {
              icon: "🚀",
              title: "Always Free",
              desc: "No hidden fees, no credit card. Free forever for job seekers.",
            },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>
          Ready to{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#818cf8,#c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            get started?
          </span>
        </h2>
        <p>Join job seekers who track smarter, not harder.</p>
        <button
          className="hero-btn-primary"
          onClick={() => navigate("/register")}
        >
          Create free account →
        </button>
      </section>

      <footer>
        Built with <span>♥</span> · JobTracker · {new Date().getFullYear()}
      </footer>
    </>
  );
}
