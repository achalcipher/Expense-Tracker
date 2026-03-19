import React, { useState } from 'react';

const CATEGORY_META = {
  Grocery:  { icon: '🛒', bg: 'from-green-500/20 to-emerald-600/10',  badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
  Vehicle:  { icon: '🚗', bg: 'from-blue-500/20 to-blue-700/10',      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  Shopping: { icon: '🛍️', bg: 'from-pink-500/20 to-rose-600/10',      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  Travel:   { icon: '✈️', bg: 'from-yellow-500/20 to-amber-600/10',   badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  Food:     { icon: '🍔', bg: 'from-orange-500/20 to-red-600/10',     badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  Fun:      { icon: '🎮', bg: 'from-purple-500/20 to-violet-700/10',  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  Other:    { icon: '📦', bg: 'from-zinc-500/20 to-zinc-700/10',      badge: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
};

function ExpenseItem({ exp, onDelete, index }) {
  const [deleting, setDeleting] = useState(false);
  const meta = CATEGORY_META[exp.category] || CATEGORY_META.Other;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(exp._id);
  };

  return (
    <div
      className={`relative group flex items-center justify-between rounded-2xl px-4 py-3 border border-white/5 bg-gradient-to-r ${meta.bg} hover:border-white/15 transition-all duration-300 animate-item-enter ${deleting ? 'opacity-0 scale-95' : ''}`}
      style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
          {meta.icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${meta.badge}`}>
              {exp.category}
            </span>
            {exp.description && (
              <span className="text-xs text-zinc-400 truncate max-w-[120px]">{exp.description}</span>
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">
            {new Date(exp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <div className="font-black text-white text-sm">Rs.{exp.amount.toLocaleString()}</div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
          aria-label="Delete"
        >
          {deleting ? <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" /> : '×'}
        </button>
      </div>
    </div>
  );
}

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="text-5xl animate-float">💸</div>
        <p className="text-zinc-400 font-medium">No expenses yet</p>
        <p className="text-zinc-600 text-sm">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
      {expenses.map((exp, i) => (
        <ExpenseItem key={exp._id} exp={exp} onDelete={onDelete} index={i} />
      ))}
    </div>
  );
}
