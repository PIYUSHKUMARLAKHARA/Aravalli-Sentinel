import React from 'react';

export function RiskBadge({ level, score, showScore = true, size = 'md' }) {
  const normLevel = (level || 'SAFE').toUpperCase();

  let colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-500';

  if (normLevel.includes('WATCH')) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (normLevel.includes('HIGH')) {
    colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-500';
  } else if (normLevel.includes('CRITICAL')) {
    colorClasses = 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse';
    dotColor = 'bg-rose-500';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size] || 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{normLevel}</span>
      {showScore && score !== undefined && score !== null && (
        <span className="opacity-90 font-bold border-l border-current/20 pl-1.5">
          {typeof score === 'number' ? score.toFixed(1) : score}/100
        </span>
      )}
    </span>
  );
}

export default RiskBadge;
