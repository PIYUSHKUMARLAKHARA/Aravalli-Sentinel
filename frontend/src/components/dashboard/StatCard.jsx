import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald' }) {
  const colorClasses = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-xs uppercase font-semibold">{title}</span>
        {Icon && <Icon className={`w-4 h-4 ${colorClasses[color] || 'text-emerald-400'}`} />}
      </div>
      <div className={`text-3xl font-extrabold ${colorClasses[color] || 'text-white'}`}>{value}</div>
      {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
