import React, { useState } from 'react';

const CATEGORY_META = {
  Grocery:  { icon: '🛒', color: 'from-green-500 to-emerald-600' },
  Vehicle:  { icon: '🚗', color: 'from-blue-500 to-blue-700' },
  Shopping: { icon: '🛍️', color: 'from-pink-500 to-rose-600' },
  Travel:   { icon: '✈️', color: 'from-yellow-500 to-amber-600' },
  Food:     { icon: '🍔', color: 'from-orange-500 to-red-600' },
  Fun:      { icon: '🎮', color: 'from-purple-500 to-violet-700' },
  Other:    { icon: '📦', color: 'from-zinc-500 to-zinc-700' },
};

export default function ExpenseForm({ categories, onAdd }) {
  const [form, setForm] = useState({ amount: '', category: '', description: '', date: '' });
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    setSubmitting(true);
    await onAdd({ ...form, amount: Number(form.amount) });
    setForm({ amount: '', category: '', description: '', date: '' });
    setTimeout(() => setSubmitting(false), 500);
  };

  const selectedMeta = form.category ? CATEGORY_META[form.category] : null;

  return (
    <div className="glass card-hover rounded-3xl p-5 border border-white/5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${selectedMeta ? `bg-gradient-to-br ${selectedMeta.color}` : 'bg-white/10'}`}>
          {selectedMeta ? selectedMeta.icon : '➕'}
        </div>
        <div>
          <h2 className="font-bold text-white text-lg">Add Expense</h2>
          <p className="text-zinc-500 text-xs">Track your spending</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Amount + Category row */}
        <div className="flex gap-3">
          <div className={`relative flex-1 transition-all duration-200 ${focused === 'amount' ? 'scale-[1.02]' : ''}`}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">Rs.</span>
            <input
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              onFocus={() => setFocused('amount')}
              onBlur={() => setFocused('')}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-9 pr-4 py-3 outline-none input-glow transition-all duration-200 placeholder-zinc-600 text-sm font-semibold"
              required min="1"
            />
          </div>

          <div className={`relative flex-1 transition-all duration-200 ${focused === 'category' ? 'scale-[1.02]' : ''}`}>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              onFocus={() => setFocused('category')}
              onBlur={() => setFocused('')}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 outline-none input-glow transition-all duration-200 text-sm appearance-none cursor-pointer"
              required
            >
              <option value="" className="bg-zinc-900">Category</option>
              {categories.map(c => (
                <option key={c} value={c} className="bg-zinc-900">
                  {CATEGORY_META[c]?.icon} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => {
            const meta = CATEGORY_META[c];
            const active = form.category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setForm({ ...form, category: c })}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${active ? `bg-gradient-to-r ${meta.color} text-white shadow-lg scale-105` : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
              >
                <span>{meta.icon}</span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>

        {/* Description */}
        <div className={`relative transition-all duration-200 ${focused === 'desc' ? 'scale-[1.01]' : ''}`}>
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            onFocus={() => setFocused('desc')}
            onBlur={() => setFocused('')}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 outline-none input-glow transition-all duration-200 placeholder-zinc-600 text-sm"
          />
        </div>

        {/* Date */}
        <div className={`relative transition-all duration-200 ${focused === 'date' ? 'scale-[1.01]' : ''}`}>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            onFocus={() => setFocused('date')}
            onBlur={() => setFocused('')}
            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-3 outline-none input-glow transition-all duration-200 text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !form.amount || !form.category}
          className="btn-gradient btn-lift w-full text-white font-bold py-3 rounded-2xl mt-1 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="relative z-10 flex items-center gap-2">
              <span>+</span> Add Expense
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
