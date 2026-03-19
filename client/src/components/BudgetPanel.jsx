import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CATEGORY_META = {
  Grocery:  { icon: '🛒', color: '#16a34a' },
  Vehicle:  { icon: '🚗', color: '#2563eb' },
  Shopping: { icon: '🛍️', color: '#db2777' },
  Travel:   { icon: '✈️', color: '#ca8a04' },
  Food:     { icon: '🍔', color: '#ea580c' },
  Fun:      { icon: '🎮', color: '#9333ea' },
  Other:    { icon: '📦', color: '#6b7280' },
};

export default function BudgetPanel({ categories, expenses }) {
  const { user, updateUserBudgets } = useAuth();
  const [budgets, setBudgets] = useState(user?.budgets || {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/expenses/budgets', { budgets });
      updateUserBudgets(data.budgets);
      toast.success('Budgets saved!');
    } catch {
      toast.error('Failed to save budgets');
    } finally {
      setSaving(false);
    }
  };

  const getSpent = (cat) =>
    expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);

  return (
    <div className="flex flex-col gap-3">
      {categories.map((cat, idx) => {
        const limit = Number(budgets[cat] || 0);
        const spent = getSpent(cat);
        const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const over = limit > 0 && spent > limit;
        const warn = !over && pct >= 80;
        const meta = CATEGORY_META[cat];

        const barColor = over ? '#ef4444' : warn ? '#f59e0b' : meta.color;

        return (
          <div key={cat} className="bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-white/10 transition-all duration-200"
            style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{meta.icon}</span>
                <span className="text-sm font-semibold text-white">{cat}</span>
                {over && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-lg">Over!</span>}
                {warn && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded-lg">Near limit</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${over ? 'text-red-400' : 'text-zinc-400'}`}>
                  Rs.{spent} {limit > 0 ? `/ Rs.${limit}` : ''}
                </span>
                <input
                  type="number"
                  value={budgets[cat] || ''}
                  onChange={e => setBudgets({ ...budgets, [cat]: e.target.value })}
                  placeholder="Set limit"
                  className="bg-white/10 border border-white/10 text-white text-xs rounded-lg px-2 py-1 w-20 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  min="0"
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 animate-fill"
                style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 8px ${barColor}60` }}
              />
            </div>
            {limit > 0 && (
              <div className="text-right text-xs mt-1" style={{ color: barColor }}>
                {pct.toFixed(0)}%
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-gradient btn-lift text-white text-sm py-2.5 rounded-2xl mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving
          ? <><div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" /><span className="relative z-10">Saving...</span></>
          : <span className="relative z-10">Save Budgets</span>
        }
      </button>
    </div>
  );
}
