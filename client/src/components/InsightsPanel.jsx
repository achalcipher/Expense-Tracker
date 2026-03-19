import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function InsightsPanel() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/expenses/insights');
      setInsights(data.insights);
    } catch {
      toast.error('Add an OpenAI API key in server/.env to use this feature.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass card-hover rounded-3xl p-5 border border-white/5 relative overflow-hidden">

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">AI Spending Insights</h3>
            <p className="text-zinc-500 text-xs">Powered by GPT-4o-mini</p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="btn-gradient btn-lift text-white text-xs px-3 py-1.5 rounded-xl disabled:opacity-50 flex items-center gap-1.5"
        >
          {loading ? (
            <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" /><span className="relative z-10">Analyzing...</span></>
          ) : (
            <span className="relative z-10">Analyze</span>
          )}
        </button>
      </div>

      {insights ? (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 animate-fade-in">
          <p className="text-zinc-300 text-sm whitespace-pre-line leading-relaxed">{insights}</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/5">
          <span className="text-2xl">✨</span>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Click Analyze to get personalized AI insights about your spending patterns and saving tips.
          </p>
        </div>
      )}
    </div>
  );
}
