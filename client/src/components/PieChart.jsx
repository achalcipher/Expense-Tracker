import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#6366f1','#16a34a','#2563eb','#db2777','#ea580c','#9333ea','#6b7280'];
const CATEGORIES = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
const ICONS = ['🛒','🚗','🛍️','✈️','🍔','🎮','📦'];

export default function PieChart({ expenses }) {
  const totals = CATEGORIES.map(cat =>
    expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0)
  );
  const hasData = totals.some(t => t > 0);
  const grandTotal = totals.reduce((a, b) => a + b, 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div className="text-4xl animate-float">📊</div>
        <p className="text-zinc-500 text-sm">Add expenses to see chart</p>
      </div>
    );
  }

  const data = {
    labels: CATEGORIES,
    datasets: [{
      data: totals,
      backgroundColor: COLORS.map(c => c + 'cc'),
      borderColor: COLORS,
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const options = {
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#a1a1aa',
          font: { size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,15,20,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        padding: 12,
        callbacks: {
          label: (ctx) => ` Rs.${ctx.parsed.toLocaleString()} (${((ctx.parsed / grandTotal) * 100).toFixed(1)}%)`,
        },
      },
    },
    animation: { animateRotate: true, animateScale: true, duration: 800 },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Doughnut with center text */}
      <div className="relative w-56 h-56">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-xs text-zinc-400">Total</div>
          <div className="font-black text-white text-lg">Rs.{grandTotal.toLocaleString()}</div>
        </div>
      </div>

      {/* Custom legend with amounts */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 w-full">
        {CATEGORIES.map((cat, i) => totals[i] > 0 && (
          <div key={cat} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
            <span className="text-xs text-zinc-400 truncate">{ICONS[i]} {cat}</span>
            <span className="text-xs font-semibold text-white ml-auto">Rs.{totals[i].toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
