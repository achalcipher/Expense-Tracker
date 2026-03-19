import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COLORS = ['#6366f1','#8b5cf6','#a855f7','#ec4899','#f43f5e','#f59e0b','#10b981'];

export default function BarChart({ summary }) {
  if (!summary || summary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div className="text-4xl animate-float">📊</div>
        <p className="text-zinc-500 text-sm">No data yet</p>
      </div>
    );
  }

  const data = {
    labels: summary.map(s => s._id),
    datasets: [{
      label: 'Total Spent (Rs.)',
      data: summary.map(s => s.total),
      backgroundColor: summary.map((_, i) => COLORS[i % COLORS.length] + 'bb'),
      borderColor: summary.map((_, i) => COLORS[i % COLORS.length]),
      borderWidth: 2,
      borderRadius: 10,
      borderSkipped: false,
      hoverBackgroundColor: summary.map((_, i) => COLORS[i % COLORS.length]),
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,15,20,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#a1a1aa',
        padding: 12,
        callbacks: {
          label: (ctx) => ` Rs.${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#71717a', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
      y: {
        ticks: { color: '#71717a', font: { size: 11 }, callback: v => `Rs.${v}` },
        grid: { color: 'rgba(255,255,255,0.04)' },
        border: { color: 'rgba(255,255,255,0.08)' },
      },
    },
    animation: { duration: 800, easing: 'easeInOutQuart' },
  };

  return <Bar data={data} options={options} />;
}
