const { v4: uuid } = require('uuid');
const { users, expenses } = require('../store');
const OpenAI     = require('openai');
const nodemailer = require('nodemailer');
const { jsPDF }  = require('jspdf');
require('jspdf-autotable');

// POST /api/expenses
const createExpense = (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    if (!amount || !category)
      return res.status(400).json({ success: false, message: 'Amount and category required' });

    const expense = {
      id:          uuid(),
      _id:         uuid(), // frontend uses _id
      userId:      req.user.id,
      amount:      Number(amount),
      category,
      description: description || '',
      date:        date ? new Date(date) : new Date(),
      createdAt:   new Date(),
    };
    expense._id = expense.id; // keep consistent
    expenses.push(expense);
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = (req, res) => {
  try {
    const idx = expenses.findIndex(e => e.id === req.params.id && e.userId === req.user.id);
    if (idx === -1)
      return res.status(404).json({ success: false, message: 'Expense not found' });

    expenses.splice(idx, 1);
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/expenses  — supports ?category=Food&from=2024-01-01&to=2024-01-31
const getExpenses = (req, res) => {
  try {
    let result = expenses.filter(e => e.userId === req.user.id);

    if (req.query.category)
      result = result.filter(e => e.category === req.query.category);

    if (req.query.from)
      result = result.filter(e => new Date(e.date) >= new Date(req.query.from));

    if (req.query.to)
      result = result.filter(e => new Date(e.date) <= new Date(req.query.to));

    // Sort newest first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/expenses/summary
const getSummary = (req, res) => {
  try {
    const userExpenses = expenses.filter(e => e.userId === req.user.id);

    const grouped = {};
    userExpenses.forEach(e => {
      if (!grouped[e.category]) grouped[e.category] = { _id: e.category, total: 0, count: 0 };
      grouped[e.category].total += e.amount;
      grouped[e.category].count += 1;
    });

    const summary = Object.values(grouped).sort((a, b) => b.total - a.total);
    return res.status(200).json({ success: true, data: summary });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/expenses/budgets
const updateBudgets = (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    user.budgets = { ...user.budgets, ...req.body.budgets };
    return res.status(200).json({ success: true, budgets: user.budgets });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/expenses/insights
const getInsights = async (req, res) => {
  try {
    const userExpenses = expenses
      .filter(e => e.userId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 50);

    if (userExpenses.length === 0)
      return res.status(200).json({ success: true, insights: 'Add some expenses first to get insights.' });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Here are my recent expenses: ${JSON.stringify(userExpenses.map(e => ({
          amount: e.amount, category: e.category, description: e.description, date: e.date,
        })))}.
Analyze my spending habits and give me:
1. Three specific insights about where my money is going
2. Two actionable tips to reduce spending
3. One category I should watch out for this month
Keep it concise and friendly.`,
      }],
      max_tokens: 400,
    });

    return res.status(200).json({ success: true, insights: response.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/expenses/email
const sendReport = async (req, res) => {
  try {
    const { recipient } = req.body;
    if (!recipient)
      return res.status(400).json({ success: false, message: 'Recipient email required' });

    const userExpenses = expenses
      .filter(e => e.userId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = userExpenses.reduce((sum, e) => sum + e.amount, 0);

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Expense Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    doc.autoTable({
      startY: 40,
      head: [['#', 'Date', 'Category', 'Description', 'Amount']],
      body: userExpenses.map((e, i) => [
        i + 1,
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description || '-',
        `Rs.${e.amount}`,
      ]),
      foot: [['', '', '', 'Total', `Rs.${total}`]],
      theme: 'grid',
      styles: { fontSize: 11 },
    });

    const pdfBase64 = doc.output('dataurlstring').split(',')[1];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: 'Your Expense Report',
      text: `Hi ${req.user.username}, please find your expense report attached.`,
      attachments: [{ filename: 'expense_report.pdf', content: pdfBase64, encoding: 'base64' }],
    });

    return res.status(200).json({ success: true, message: 'Report sent successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createExpense, deleteExpense, getExpenses, getSummary, updateBudgets, getInsights, sendReport };
