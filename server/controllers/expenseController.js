const Expense = require('../models/Expense');
const User = require('../models/User');
const OpenAI = require('openai');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

// POST /api/expenses
const createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    if (!amount || !category)
      return res.status(400).json({ success: false, message: 'Amount and category required' });

    const expense = await Expense.create({
      userId: req.user.id,
      amount,
      category,
      description: description || '',
      date: date || Date.now(),
    });
    return res.status(201).json({ success: true, data: expense });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found' });

    await expense.deleteOne();
    return res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/expenses  — supports ?category=Food&from=2024-01-01&to=2024-01-31
// Improvement 5: date range + category filtering
const getExpenses = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) filter.date.$gte = new Date(req.query.from);
      if (req.query.to)   filter.date.$lte = new Date(req.query.to);
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    return res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/expenses/summary — aggregated totals per category
// Improvement 5: used for bar chart trend data
const getSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(req.user.id) } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    return res.status(200).json({ success: true, data: summary });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/expenses/budgets — update category budgets
// Improvement 4: save budget limits per user
const updateBudgets = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { budgets: req.body.budgets },
      { new: true }
    );
    return res.status(200).json({ success: true, budgets: user.budgets });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/expenses/insights — OpenAI spending analysis
// Improvement 3: AI-powered insights
const getInsights = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 }).limit(50);
    if (expenses.length === 0)
      return res.status(200).json({ success: true, insights: 'Add some expenses first to get insights.' });

    const summary = expenses.map(e => ({
      amount: e.amount,
      category: e.category,
      description: e.description,
      date: e.date,
    }));

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Here are my recent expenses: ${JSON.stringify(summary)}.
Analyze my spending habits and give me:
1. Three specific insights about where my money is going
2. Two actionable tips to reduce spending
3. One category I should watch out for this month
Keep it concise and friendly.`
      }],
      max_tokens: 400,
    });

    return res.status(200).json({ success: true, insights: response.choices[0].message.content });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/expenses/email — generate PDF and email it
const sendReport = async (req, res) => {
  try {
    const { recipient } = req.body;
    if (!recipient)
      return res.status(400).json({ success: false, message: 'Recipient email required' });

    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Generate PDF
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Monthly Expense Report', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

    doc.autoTable({
      startY: 40,
      head: [['#', 'Date', 'Category', 'Description', 'Amount (₹)']],
      body: expenses.map((e, i) => [
        i + 1,
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description || '-',
        e.amount,
      ]),
      foot: [['', '', '', 'Total', `₹${total}`]],
      theme: 'grid',
      styles: { fontSize: 11 },
    });

    const pdfBase64 = doc.output('dataurlstring').split(',')[1];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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
