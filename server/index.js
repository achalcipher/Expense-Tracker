require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    /\.vercel\.app$/,   // allow any vercel deployment
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

app.get('/', (req, res) => res.json({ message: 'Expense Tracker API running (no database)' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
