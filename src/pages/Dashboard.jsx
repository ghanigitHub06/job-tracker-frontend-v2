import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "WISHLIST", label: "Wishlist", color: "#7c3aed", bg: "#ede9fe" },
  { key: "APPLIED", label: "Applied", color: "#2563eb", bg: "#dbeafe" },
  { key: "INTERVIEW", label: "Interview", color: "#d97706", bg: "#fef3c7" },
  { key: "OFFER", label: "Offer", color: "#059669", bg: "#d1fae5" },
  { key: "REJECTED", label: "Rejected", color: "#dc2626", bg: "#fee2e2" },
];

const EMPTY_FORM = {
  company: "",
  role: "",
  status: "APPLIED",
  appliedDate: "",
  jobLink: "",
  notes: "",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("isGuest") === "true";
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const name = localStorage.getItem("name") || "User";

  const fetchJobs = async () => {
    if (isGuest) {
      const guestJobs = JSON.parse(localStorage.getItem("guestJobs") || "[]");
      setJobs(guestJobs);
      setLoading(false);
      return;
    }
    try {
      const { data } = await API.get("/jobs");
      setJobs(data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAdd = () => {
    setEditJob(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };
  const openEdit = (job) => {
    setEditJob(job);
    setForm({
      company: job.company,
      role: job.role,
      status: job.status,
      appliedDate: job.appliedDate || "",
      jobLink: job.jobLink || "",
      notes: job.notes || "",
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (isGuest) {
      // Guest mode — save to localStorage only
      const guestJobs = JSON.parse(localStorage.getItem("guestJobs") || "[]");
      if (editJob) {
        const updated = guestJobs.map((j) =>
          j.id === editJob.id ? { ...j, ...form } : j,
        );
        localStorage.setItem("guestJobs", JSON.stringify(updated));
        toast.success("Updated! (Guest mode)");
      } else {
        const newJob = { ...form, id: Date.now() };
        localStorage.setItem(
          "guestJobs",
          JSON.stringify([...guestJobs, newJob]),
        );
        toast.success("Added! (Guest mode — register to save permanently)");
      }
      setModal(false);
      fetchJobs();
      setSaving(false);
      return;
    }

    try {
      if (editJob) {
        await API.put(`/jobs/${editJob.id}`, form);
        toast.success("Updated!");
      } else {
        await API.post("/jobs", form);
        toast.success("Added!");
      }
      setModal(false);
      fetchJobs();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    if (isGuest) {
      const guestJobs = JSON.parse(localStorage.getItem("guestJobs") || "[]");
      localStorage.setItem(
        "guestJobs",
        JSON.stringify(guestJobs.filter((j) => j.id !== id)),
      );
      toast.success("Deleted!");
      fetchJobs();
      return;
    }

    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Deleted!");
      fetchJobs();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filtered = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role.toLowerCase().includes(search.toLowerCase()),
  );
  const getJobs = (status) => filtered.filter((j) => j.status === status);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; }

        /* GUEST BANNER */
        .guest-banner {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; padding: 0.6rem 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
          font-size: 0.82rem; flex-wrap: wrap; gap: 0.5rem;
        }
        .guest-banner-text { display: flex; align-items: center; gap: 0.5rem; }
        .guest-banner-btns { display: flex; gap: 0.5rem; }
        .banner-btn {
          padding: 0.3rem 0.8rem; border-radius: 6px;
          font-family: 'Inter', sans-serif; font-size: 0.78rem;
          font-weight: 600; cursor: pointer; border: none;
          transition: all .15s;
        }
        .banner-btn-primary { background: white; color: #667eea; }
        .banner-btn-primary:hover { opacity: 0.9; }
        .banner-btn-secondary { background: rgba(255,255,255,0.2); color: white; }
        .banner-btn-secondary:hover { background: rgba(255,255,255,0.3); }

        /* NAV */
        .nav {
          background: white; border-bottom: 1px solid #e5e7eb;
          padding: 0 1.5rem; height: 56px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 50;
        }
        .nav-logo { font-weight: 700; font-size: 1.1rem; color: #1a1a2e; display: flex; align-items: center; gap: 0.4rem; }
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
        .guest-tag {
          background: #fef3c7; color: #d97706;
          font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.5rem;
          border-radius: 100px; text-transform: uppercase; letter-spacing: .04em;
        }
        .nav-logout {
          padding: 0.4rem 0.9rem; border-radius: 8px;
          border: 1px solid #e5e7eb; background: none;
          font-family: 'Inter', sans-serif; font-size: 0.82rem;
          color: #6b7280; cursor: pointer; transition: all .15s;
        }
        .nav-logout:hover { border-color: #dc2626; color: #dc2626; }

        /* MAIN */
        .main { padding: 1.5rem; max-width: 1400px; margin: 0 auto; }
        .header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;
        }
        .header-title { font-size: 1.4rem; font-weight: 700; color: #1a1a2e; }
        .header-sub { font-size: 0.82rem; color: #9ca3af; margin-top: 0.15rem; }
        .header-right { display: flex; gap: 0.75rem; align-items: center; }
        .search-input {
          padding: 0.55rem 1rem; border: 1.5px solid #e5e7eb;
          border-radius: 8px; font-family: 'Inter', sans-serif;
          font-size: 0.85rem; outline: none; width: 200px; transition: border-color .2s;
        }
        .search-input:focus { border-color: #667eea; }
        .add-btn {
          padding: 0.55rem 1.1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; border: none; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 0.85rem;
          font-weight: 600; cursor: pointer; white-space: nowrap; transition: opacity .2s;
        }
        .add-btn:hover { opacity: 0.9; }

        /* BOARD */
        .board { display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; align-items: start; }
        .col { background: white; border-radius: 14px; border: 1px solid #f1f5f9; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .col-header {
          padding: 12px 16px; display: flex; align-items: center;
          justify-content: space-between; border-bottom: 2px solid;
        }
        .col-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
        .col-count { font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; color: white; }
        .col-body { padding: 10px; min-height: 200px; display: flex; flex-direction: column; gap: 8px; }

        /* JOB CARD */
        .job-card {
          background: white; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 12px;
          transition: box-shadow .2s, transform .15s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .job-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .job-company { font-weight: 700; font-size: 0.9rem; color: #1a1a2e; margin-bottom: 2px; }
        .job-role { font-size: 0.78rem; color: #6b7280; margin-bottom: 8px; }
        .job-meta { font-size: 0.7rem; color: #9ca3af; margin-bottom: 4px; }
        .job-link {
          display: block; font-size: 0.7rem; color: #667eea;
          text-decoration: none; margin-bottom: 4px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .job-notes {
          font-size: 0.72rem; color: #9ca3af; line-height: 1.4;
          border-top: 1px solid #f1f5f9; padding-top: 6px; margin-top: 6px;
        }
        .job-actions { display: flex; gap: 6px; margin-top: 8px; }
        .btn-edit, .btn-del {
          flex: 1; padding: 5px 8px; border-radius: 7px;
          font-family: 'Inter', sans-serif; font-size: 0.73rem;
          font-weight: 600; cursor: pointer; border: none; transition: opacity .15s;
        }
        .btn-edit { background: #ede9fe; color: #7c3aed; }
        .btn-edit:hover { opacity: 0.75; }
        .btn-del { background: #fee2e2; color: #dc2626; }
        .btn-del:hover { opacity: 0.75; }

        .empty { text-align: center; padding: 2.5rem 1rem; color: #d1d5db; }
        .empty-icon { font-size: 1.8rem; margin-bottom: 0.4rem; }
        .empty-text { font-size: 0.78rem; }

        /* MODAL */
        .overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal {
          background: white; border-radius: 16px; width: 100%; max-width: 460px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;
        }
        .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.25rem 1.5rem 0;
        }
        .modal-title { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; }
        .modal-close {
          width: 28px; height: 28px; border-radius: 8px;
          background: #f3f4f6; border: none; cursor: pointer;
          font-size: 0.9rem; color: #6b7280;
        }
        .modal-body { padding: 1.25rem 1.5rem 1.5rem; }
        .field { margin-bottom: 1rem; }
        .field label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
        .field input, .field select, .field textarea {
          width: 100%; padding: 0.65rem 0.9rem;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-family: 'Inter', sans-serif; font-size: 0.88rem;
          color: #1a1a2e; outline: none; transition: border-color .2s;
        }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: #667eea; }
        .field textarea { resize: vertical; min-height: 70px; }
        .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.25rem; }
        .btn-cancel {
          flex: 1; padding: 0.7rem; border-radius: 8px;
          border: 1.5px solid #e5e7eb; background: none;
          font-family: 'Inter', sans-serif; font-size: 0.88rem; color: #6b7280; cursor: pointer;
        }
        .btn-save {
          flex: 2; padding: 0.7rem; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white; font-family: 'Inter', sans-serif;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
        }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 1000px) { .board { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 650px) { .board { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 420px) { .board { grid-template-columns: 1fr; } }
      `}</style>

      {/* GUEST BANNER */}
      {isGuest && (
        <div className="guest-banner">
          <div className="guest-banner-text">
            👤 You're in guest mode — data won't be saved permanently
          </div>
          <div className="guest-banner-btns">
            <button
              className="banner-btn banner-btn-primary"
              onClick={() => navigate("/register")}
            >
              Create free account
            </button>
            <button
              className="banner-btn banner-btn-secondary"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">💼 JobTracker</div>
        <div className="nav-links">
          <Link className="nav-link active" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link" to="/analytics">
            Analytics
          </Link>
        </div>
        <div className="nav-right">
          <span className="nav-name">Hi, {name.split(" ")[0]} 👋</span>
          {isGuest && <span className="guest-tag">Guest</span>}
          <button className="nav-logout" onClick={handleLogout}>
            {isGuest ? "Exit" : "Sign out"}
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="main">
        <div className="header">
          <div>
            <div className="header-title">My Applications</div>
            <div className="header-sub">
              {jobs.length} total ·{" "}
              {jobs.filter((j) => j.status === "OFFER").length} offers
              {isGuest && " · Guest mode"}
            </div>
          </div>
          <div className="header-right">
            <input
              className="search-input"
              placeholder="🔍 Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="add-btn" onClick={openAdd}>
              + Add Application
            </button>
          </div>
        </div>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "4rem", color: "#9ca3af" }}
          >
            Loading...
          </div>
        ) : (
          <div className="board">
            {COLUMNS.map((col) => (
              <div className="col" key={col.key}>
                <div
                  className="col-header"
                  style={{ background: col.bg, borderBottomColor: col.color }}
                >
                  <span className="col-label" style={{ color: col.color }}>
                    {col.label}
                  </span>
                  <span className="col-count" style={{ background: col.color }}>
                    {getJobs(col.key).length}
                  </span>
                </div>
                <div className="col-body">
                  {getJobs(col.key).length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">📋</div>
                      <div className="empty-text">No applications</div>
                    </div>
                  ) : (
                    getJobs(col.key).map((job) => (
                      <div className="job-card" key={job.id}>
                        <div className="job-company">{job.company}</div>
                        <div className="job-role">{job.role}</div>
                        {job.appliedDate && (
                          <div className="job-meta">📅 {job.appliedDate}</div>
                        )}
                        {job.jobLink && (
                          <a
                            className="job-link"
                            href={job.jobLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            🔗 View job posting
                          </a>
                        )}
                        {job.notes && (
                          <div className="job-notes">📝 {job.notes}</div>
                        )}
                        <div className="job-actions">
                          <button
                            className="btn-edit"
                            onClick={() => openEdit(job)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-del"
                            onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          className="overlay"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}
        >
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">
                {editJob ? "Edit Application" : "Add Application"}
              </div>
              <button className="modal-close" onClick={() => setModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSave}>
                <div className="field">
                  <label>Company *</label>
                  <input
                    placeholder="Google, Amazon..."
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field">
                  <label>Role *</label>
                  <input
                    placeholder="Software Engineer..."
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                  />
                </div>
                <div className="field">
                  <label>Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                  >
                    <option value="WISHLIST">Wishlist</option>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="field">
                  <label>Applied Date</label>
                  <input
                    type="date"
                    value={form.appliedDate}
                    onChange={(e) =>
                      setForm({ ...form, appliedDate: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Job Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.jobLink}
                    onChange={(e) =>
                      setForm({ ...form, jobLink: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label>Notes</label>
                  <textarea
                    placeholder="Any notes..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving
                      ? "Saving..."
                      : editJob
                        ? "Update"
                        : "Add Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
