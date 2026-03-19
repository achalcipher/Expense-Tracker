import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetPanel from '../components/BudgetPanel';
import InsightsPanel from '../components/InsightsPanel';
import DateRangeFilter from '../components/DateRangeFilter';

const CATEGORIES = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];

const CATEGORY_META = {
  Grocery:  { icon: '🛒', color: '#16a34a' },
  Vehicle:  { icon: '🚗', color: '#2563eb' },
  Shopping: { icon: '🛍️', color: '#db2777' },
  Travel:   { icon: '✈️', color: '#ca8a04' },
  Food:     { icon: '🍔', color: '#ea580c' },
  Fun:      { icon: '🎮', color: '#9333ea' },
  Other:    { icon: '📦', color: '#6b7280' },
};

function StatCard({ icon, label, value, sub, color, delay }) {
  return (
    <div className={`glass card-hover rounded-2xl p-4 border border-white/5 animate-slide-up`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
      </div>
      <div className="font-black text-xl text-white">{value}</div>
      <div className="text-zinc-400 text-xs mt-0.5">{label}</div>
      {sub && <div className="text-zinc-500 text-xs mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses]       = useState([]);
  const [summary, setSummary]         = useState([]);
  const [filters, setFilters]         = useState({ category: '', from: '', to: '' });
  const [activeTab, setActiveTab]     = useState('pie');
  const [showBudgets, setShowBudgets] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [mounted, setMounted]         = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.from)     params.from = filters.from;
      if (filters.to)       params.to = filters.to;
      const { data } = await api.get('/expenses', { params });
      setExpenses(data.data);
    } catch {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get('/expenses/summary');
      setSummary(data.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchExpenses();
    fetchSummary();
    setTimeout(() => setMounted(true), 100);
  }, [user, navigate, fetchExpenses, fetchSummary]);

  const handleAdd = async (expenseData) => {
    try {
      await api.post('/expenses', expenseData);
      toast.success('Expense added!');
      fetchExpenses();
      fetchSummary();
      checkBudgetAlert(expenseData.category);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Deleted');
      fetchExpenses();
      fetchSummary();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const checkBudgetAlert = (category) => {
    if (!user?.budgets) return;
    const limit = user.budgets[category];
    if (!limit || limit === 0) return;
    const spent = expenses.filter(e => e.category === category).reduce((s, e) => s + e.amount, 0);
    const pct = (spent / limit) * 100;
    if (pct >= 80) {
      toast(`${Math.round(pct)}% of ${category} budget used!`, {
        icon: '🚨', style: { background: '#f59e0b', color: '#000' }, duration: 5000,
      });
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const topCategory = summary[0]?._id || 'None';
  const avgExpense = expenses.length ? Math.round(total / expenses.length) : 0;
  const todayCount = expenses.filter(e =>
    new Date(e.date).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen mesh-bg text-white">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb w-96 h-96 bg-indigo-600" style={{ top: '-10%', left: '-5%', animation: 'float 12s ease-in-out infinite' }} />
        <div className="orb w-80 h-80 bg-purple-600" style={{ bottom: '-10%', right: '-5%', animation: 'float 10s ease-in-out infinite reverse' }} />
        <div className="orb w-64 h-64 bg-pink-600" style={{ top: '50%', right: '15%', animation: 'float 14s ease-in-out infinite', animationDelay: '3s' }} />
      </div>

      <Navbar onLogout={() => { logout(); navigate('/login'); }} expenses={expenses} />

      <div className={`relative max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon="💸" label="Total Spent"     value={`Rs.${total.toLocaleString()}`} color="#6366f1" delay={100} />
          <StatCard icon="📊" label="Transactions"    value={expenses.length}                 color="#8b5cf6" delay={200} />
          <StatCard icon="🏆" label="Top Category"    value={topCategory}                     color="#ec4899" delay={300} />
          <StatCard icon="📅" label="Today's Entries" value={todayCount} sub={`Avg Rs.${avgExpense}`} color="#f59e0b" delay={400} />
        </div>

        {/* Filters */}
        <DateRangeFilter
          filters={filters}
          categories={CATEGORIES}
          onChange={setFilters}
          onReset={() => setFilters({ category: '', from: '', to: '' })}
        />

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left column */}
          <div className="lg:w-1/2 flex flex-col gap-5">

            {/* Chart card */}
            <div className="glass card-hover rounded-3xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <span>📈</span> Spending Overview
                </h2>
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
                  {['pie','bar'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === tab ? 'btn-gradient text-white' : 'text-zinc-400 hover:text-white'}`}>
                      {tab === 'pie' ? 'Pie' : 'Bar'}
                    </button>
                  ))}
                </div>
              </div>
              {activeTab === 'pie' ? <PieChart expenses={expenses} /> : <BarChart summary={summary} />}
            </div>

            {/* Category quick stats */}
            <div className="glass card-hover rounded-3xl p-5 border border-white/5">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2"><span>🏷️</span> By Category</h2>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => {
                  const spent = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
                  const meta = CATEGORY_META[cat];
                  return (
                    <div key={cat} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 hover:bg-white/10 transition-all duration-200">
                      <span className="text-lg">{meta.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs text-zinc-400 truncate">{cat}</div>
                        <div className="text-sm font-bold text-white">Rs.{spent.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Insights */}
            <InsightsPanel />

            {/* Budget panel */}
            <div className="glass card-hover rounded-3xl p-5 border border-white/5">
              <button onClick={() => setShowBudgets(!showBudgets)} className="w-full flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2"><span>🎯</span> Budget Limits</span>
                <span className={`text-zinc-400 transition-transform duration-300 text-sm ${showBudgets ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${showBudgets ? 'max-h-[600px] mt-4' : 'max-h-0'}`}>
                <BudgetPanel categories={CATEGORIES} expenses={expenses} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:w-1/2 flex flex-col gap-5">
            <ExpenseForm categories={CATEGORIES} onAdd={handleAdd} />

            <div className="glass card-hover rounded-3xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <span>📋</span> Transactions
                  {loading && <div className="w-4 h-4 border border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />}
                </h2>
                <div className="bg-white/5 rounded-xl px-3 py-1">
                  <span className="gradient-text font-black text-lg">Rs.{total.toLocaleString()}</span>
                </div>
              </div>
              <ExpenseList expenses={expenses} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
