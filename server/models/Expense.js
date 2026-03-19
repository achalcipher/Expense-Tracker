const mongoose = require('mongoose');

// Cleaner approach: query by userId, no ref array on User
const expenseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:      { type: Number, required: true },
  category:    { type: String, required: true },
  description: { type: String, default: '' },
  date:        { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
