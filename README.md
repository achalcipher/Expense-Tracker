<div align="center">

# 💰 Expense Tracker
### Track · Analyze · Save
#### Built with MERN Stack

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-6366f1?style=for-the-badge&logoColor=white)](https://expense-tracker-eight-rho-40.vercel.app)
[![Backend](https://img.shields.io/badge/⚡_Backend-Render-46e3b7?style=for-the-badge&logoColor=white)](https://expense-tracker-ctmm.onrender.com)
[![GitHub](https://img.shields.io/badge/📁_Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/achalcipher/Expense-Tracker)

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)

<br/>

> A full-stack expense tracking app with AI-powered insights, animated glassmorphism UI, budget alerts, and real-time charts — no database required.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure login & register with bcrypt password hashing |
| 📊 Interactive Charts | Doughnut + Bar charts with Chart.js, live updates |
| 🤖 AI Insights | GPT-4o-mini analyzes your spending and gives tips |
| 🎯 Budget Limits | Set per-category limits with color-coded progress bars |
| 🔍 Smart Filters | Filter by category, date range with instant results |
| 📧 Email Reports | Auto-generated PDF expense report sent to your email |
| 💾 No Database | In-memory storage — zero setup, deploy anywhere |
| 🎨 Animated UI | Glassmorphism, floating orbs, particle effects, smooth transitions |

---

## 🖥️ Preview

<div align="center">

| Login Page | Dashboard |
|---|---|
| Glassmorphism card with floating particles | Stats, charts, expense list, AI insights |

</div>

---

## 🏗️ Tech Stack

```
Frontend                    Backend
─────────────────────       ─────────────────────
React 18                    Node.js + Express
Tailwind CSS                JWT (jsonwebtoken)
Chart.js + react-chartjs-2  bcryptjs
React Router v6             OpenAI API
Axios                       Nodemailer + jsPDF
React Hot Toast             UUID (in-memory store)
```

---

## 📁 Project Structure

```
expense-tracker/
├── client/                      # React Frontend
│   └── src/
│       ├── api/axios.js          # Auto JWT interceptor
│       ├── context/AuthContext   # Global auth state
│       ├── pages/
│       │   ├── Login.jsx         # Animated login
│       │   ├── Register.jsx      # Password strength meter
│       │   └── Dashboard.jsx     # Main app
│       └── components/
│           ├── Navbar.jsx        # Sticky glass navbar
│           ├── ExpenseForm.jsx   # Category pill selector
│           ├── ExpenseList.jsx   # Animated expense cards
│           ├── PieChart.jsx      # Doughnut with center total
│           ├── BarChart.jsx      # Gradient bar chart
│           ├── InsightsPanel.jsx # OpenAI integration
│           ├── BudgetPanel.jsx   # Progress bars + alerts
│           └── DateRangeFilter.jsx
│
└── server/                      # Express Backend
    ├── store.js                  # In-memory users[] + expenses[]
    ├── middleware/auth.js        # JWT verify
    ├── controllers/
    │   ├── authController.js     # Register + Login
    │   └── expenseController.js  # CRUD + AI + Email
    └── routes/
        ├── auth.js
        └── expenses.js
```

---

## 🚀 Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/achalcipher/Expense-Tracker.git
cd Expense-Tracker
```

**2. Install dependencies**
```bash
npm run install:all
```

**3. Configure environment**
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
JWT_SECRET=any_long_random_string
OPENAI_API_KEY=sk-...        # optional
EMAIL_USER=you@gmail.com     # optional
EMAIL_PASS=app_password      # optional
PORT=4000
```

**4. Start both servers**
```bash
# Terminal 1 — Backend
npm run dev:server

# Terminal 2 — Frontend
npm run dev:client
```

Open **http://localhost:3000**

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [expense-tracker-eight-rho-40.vercel.app](https://expense-tracker-eight-rho-40.vercel.app) |
| Backend | Render | [expense-tracker-ctmm.onrender.com](https://expense-tracker-ctmm.onrender.com) |

---

## 🔌 API Endpoints

```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login, returns JWT

GET    /api/expenses            Get all expenses (filterable)
POST   /api/expenses            Create expense
DELETE /api/expenses/:id        Delete expense
GET    /api/expenses/summary    Category totals for bar chart
POST   /api/expenses/insights   OpenAI spending analysis
PUT    /api/expenses/budgets    Update budget limits
POST   /api/expenses/email      Send PDF report via email
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT tokens** expire in 7 days
- All expense routes protected by auth middleware
- `.env` file excluded from git — never pushed

---

## 💡 Key Improvements Over Original

```
Original Project          →    This Project
──────────────────────────────────────────────
Plain text passwords      →    bcrypt hashing
No authentication         →    JWT middleware
MongoDB required          →    Zero-setup in-memory store
Basic pie chart           →    Doughnut + Bar + live summary
No AI features            →    OpenAI GPT-4o-mini insights
No budget tracking        →    Per-category limits + alerts
No filtering              →    Date range + category filters
Plain UI                  →    Glassmorphism + animations
```

---

<div align="center">

Made with ❤️ by [achalcipher](https://github.com/achalcipher)



</div>
