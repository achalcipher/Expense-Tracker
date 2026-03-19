# Expense Tracker — Improved MERN App

## Improvements over original

1. **bcrypt password hashing** — passwords are hashed with bcrypt (salt rounds: 10), never stored plain
2. **JWT authentication** — token issued on login/register, verified via middleware on all expense routes
3. **OpenAI AI insights** — click "Analyze" to get GPT-4o-mini analysis of your spending habits
4. **Budget limits + alerts** — set per-category monthly budgets, get toast warnings at 80% usage
5. **Date range filter + Bar chart** — filter expenses by date range and category; bar chart shows totals per category

## Setup

### 1. Clone and install
```bash
npm run install:all
```

### 2. Configure environment
Copy `server/.env.example` to `server/.env` and fill in:
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=any_long_random_string
OPENAI_API_KEY=sk-...         # only needed for AI insights
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=4000
```

> For Gmail: enable 2FA and generate an App Password at myaccount.google.com/apppasswords

### 3. Run
```bash
# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev:client
```

Frontend: http://localhost:3000  
Backend: http://localhost:4000

## Project Structure
```
expense-tracker/
├── server/
│   ├── config/db.js
│   ├── models/User.js          # bcrypt pre-save hook
│   ├── models/Expense.js       # userId-based (no ref array)
│   ├── middleware/auth.js      # JWT verify
│   ├── controllers/
│   │   ├── authController.js
│   │   └── expenseController.js  # includes OpenAI + email
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   └── index.js
└── client/
    └── src/
        ├── api/axios.js         # auto-attaches JWT
        ├── context/AuthContext.js
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── ExpenseForm.jsx
            ├── ExpenseList.jsx
            ├── PieChart.jsx
            ├── BarChart.jsx        # new
            ├── InsightsPanel.jsx   # new — OpenAI
            ├── BudgetPanel.jsx     # new — budget limits
            └── DateRangeFilter.jsx # new — filtering
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/expenses | Yes | Get expenses (filterable) |
| POST | /api/expenses | Yes | Create expense |
| DELETE | /api/expenses/:id | Yes | Delete expense |
| GET | /api/expenses/summary | Yes | Aggregated totals by category |
| POST | /api/expenses/insights | Yes | OpenAI spending analysis |
| PUT | /api/expenses/budgets | Yes | Update budget limits |
| POST | /api/expenses/email | Yes | Send PDF report via email |
