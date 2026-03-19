import React, { useState } from 'react';

export default function DateRangeFilter({ filters, categories, onChange, onReset }) {
  const [open, setOpen] = useState(false);
  const hasFilters = filters.category || filters.from || filters.to;

  return (
    <div className="glass rounded-2xl border border-white/5">

      {/* Toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-2xl transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🔍</span>
          <span className="text-sm font-semibold text-white">Filter Expenses</span>
          {hasFilters && (
            <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-lg animate-scale-in">
              Active
            </span>
          )}
        </div>
        <span className={`text-zinc-400 text-sm transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Filter controls */}
      <div className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-40' : 'max-h-0'}`}>
        <div className="px-4 pb-4 flex flex-wrap gap-3 items-center">

          <select
            value={filters.category}
            onChange={e => onChange({ ...filters, category: e.target.value })}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            <option value="" className="bg-zinc-900">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.from}
              onChange={e => onChange({ ...filters, from: e.target.value })}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <span className="text-zinc-500 text-xs">to</span>
            <input
              type="date"
              value={filters.to}
              onChange={e => onChange({ ...filters, to: e.target.value })}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {hasFilters && (
            <button
              onClick={() => { onReset(); }}
              className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-2 rounded-xl transition-all duration-200 animate-scale-in"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
