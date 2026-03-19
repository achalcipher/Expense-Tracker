const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  // Improvement 4: per-category monthly budget limits
  budgets: {
    Grocery:  { type: Number, default: 0 },
    Vehicle:  { type: Number, default: 0 },
    Shopping: { type: Number, default: 0 },
    Travel:   { type: Number, default: 0 },
    Food:     { type: Number, default: 0 },
    Fun:      { type: Number, default: 0 },
    Other:    { type: Number, default: 0 },
  }
}, { timestamps: true });

// Improvement 1: hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
