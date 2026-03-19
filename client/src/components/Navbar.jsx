import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Navbar({ onLogout, expenses }) {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(timer); };
  }, []);

  const handleSendReport = async () => {
    setSending(true);
    try {
      await api.post('/expenses/email', { recipient: user.email });
      toast.success('Report sent! 📧');
    } catch {
      toast.error('Failed to send report');
    } finally {
      setSending(false);
    }
  };

  const totalSpent = expenses?.reduce((s, e) => s + e.amount, 0) || 0;
  const greeting = time.getHours() < 12 ? 'Good morning' : time.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-2xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center animate-pulse-glow">
            <span className="text-lg relative z-10">💰</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-black text-lg gradient-text leading-none">ExpenseTracker</div>
            <div className="text-zinc-500 text-xs">{greeting}, {user?.username} 👋</div>
          </div>
        </div>

        {/* Center stat */}
        <div className="hidden md:flex items-center gap-2 glass rounded-2xl px-4 py-2">
          <span className="text-zinc-400 text-xs">Total Spent</span>
          <span className="font-black text-lg gradient-text-gold">₹{totalSpent.toLocaleString()}</span>
          <span className="text-zinc-500 text-xs">({expenses?.length || 0} items)</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendReport}
            disabled={sending}
            className="glass border border-white/10 hover:border-indigo-500/50 text-white text-xs sm:text-sm px-3 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 btn-lift"
          >
            {sending
              ? <><div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" /><span className="hidden sm:inline">Sending...</span></>
              : <><span>📧</span><span className="hidden sm:inline">Email Report</span></>
            }
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-2 rounded-xl transition-all duration-200 btn-lift text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50"
          >
            <span>⏻</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
