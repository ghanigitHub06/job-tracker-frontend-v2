# 💼 Smart Job Application Tracker — Frontend

A modern, responsive React frontend for tracking job applications with a Kanban board, analytics, and guest mode. Built with **React + Vite** and deployed on **Vercel**.

---

## 🚀 Live App

```
https://job-tracker-frontend-v2.vercel.app
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| CSS-in-JS | Inline styles (no external CSS framework) |

---

## 📁 Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with JWT interceptor
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Login.jsx         # Login + Guest mode
│   ├── Register.jsx      # Registration
│   ├── Dashboard.jsx     # Kanban board
│   └── Analytics.jsx     # Charts & stats
├── App.jsx               # Routes + ProtectedRoute
└── main.jsx              # Entry point
vercel.json               # SPA rewrite rules
```

---

## ✨ Features

### 🏠 Home Page
- Dark themed landing page
- Mini Kanban board preview
- Feature highlights
- CTA to register/login

### 🔐 Authentication
- Email + Password login
- Show/hide password toggle
- JWT token stored in localStorage
- Auto-redirect on login/logout

### 👤 Guest Mode
- Try the app without registering
- 6 pre-loaded sample job applications
- Full dashboard access
- Data stored in localStorage only
- Banner prompting to register

### 📋 Kanban Dashboard
- 5 pipeline stages: **Wishlist → Applied → Interview → Offer → Rejected**
- Add, edit, delete applications
- Search by company or role
- Job links, dates, and notes per card
- Responsive grid layout

### 📊 Analytics
- Total applications count
- Interview & offer counts
- Success rate percentage
- Status breakdown with colors
- Visual bar chart by status

---

## 🎨 UI Design

- **Font**: Inter (Google Fonts)
- **Theme**: Clean white + purple gradient accents
- **Colors**:
  - Wishlist: Purple `#7c3aed`
  - Applied: Blue `#2563eb`
  - Interview: Amber `#d97706`
  - Offer: Green `#059669`
  - Rejected: Red `#dc2626`
- Fully responsive (mobile, tablet, desktop)

---

## 🔧 Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/ghanigitHub06/job-tracker-frontend-v2.git
cd job-tracker-frontend-v2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API URL

Open `src/api/axios.js` and update the baseURL:
```js
const API = axios.create({
  baseURL: "http://localhost:8080/api", // for local backend
});
```

### 4. Run the development server
```bash
npm run dev
```

App starts at: `http://localhost:5173`

---

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## ☁️ Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel
- Go to [vercel.com](https://vercel.com)
- New Project → Import from GitHub
- Framework: **Vite** (auto-detected)
- Click **Deploy**

### vercel.json (required for SPA routing)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🔌 API Integration

All API calls go through `src/api/axios.js`:

```js
import axios from "axios";

const API = axios.create({
  baseURL: "https://job-tracker-backend-production-b07b.up.railway.app/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

---

## 📱 Screenshots

### Home Page
- Dark themed hero section
- Mini Kanban preview
- Stats and feature highlights

### Dashboard
- 5-column Kanban board
- Job cards with company, role, date, link, notes
- Search and add functionality
- Guest mode banner

### Analytics
- 4 stat cards (total, interviews, offers, success rate)
- Status breakdown with color-coded counts
- Visual bar chart

---

## 🔐 Auth Flow

```
User visits /login
    ↓
Enters credentials → POST /api/auth/login
    ↓
Token saved to localStorage
    ↓
Navigate to /dashboard
    ↓
ProtectedRoute checks token
    ↓
Dashboard loads → GET /api/jobs
```

### Guest Flow
```
Click "Try as Guest"
    ↓
Sample data saved to localStorage
    ↓
Navigate to /dashboard
    ↓
ProtectedRoute checks token (guest-token)
    ↓
Dashboard loads from localStorage
```

---

## 📦 Key Files

| File | Purpose |
|---|---|
| `src/api/axios.js` | API client with JWT header |
| `src/App.jsx` | Route definitions + ProtectedRoute |
| `src/pages/Login.jsx` | Login form + Guest login |
| `src/pages/Dashboard.jsx` | Kanban board + Guest mode |
| `src/pages/Analytics.jsx` | Stats and charts |
| `vercel.json` | SPA routing fix for Vercel |

---

## 👨‍💻 Author

**Ganesh Kumar Tirunalla**
- GitHub: [@ghanigitHub06](https://github.com/ghanigitHub06)

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
