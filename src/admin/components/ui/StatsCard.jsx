import React from 'react';
import { motion } from 'framer-motion';

/**
 * Card de métrica para el Dashboard
 */
export default function StatsCard({ icon, label, value, change, changeLabel, color = 'primary', index = 0 }) {
  const colorMap = {
    primary: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' },
    accent:  { bg: 'bg-accent/10',  icon: 'text-accent',  ring: 'ring-accent/20' },
    success: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-200' },
    warning: { bg: 'bg-amber-50',   icon: 'text-amber-600',   ring: 'ring-amber-200' },
    error:   { bg: 'bg-red-50',     icon: 'text-red-600',     ring: 'ring-red-200' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      className="bg-white rounded-2xl p-5 border border-border-light shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center ring-1 ${c.ring}`}>
          <span className={`material-symbols-outlined text-xl ${c.icon}`}>{icon}</span>
        </div>
        {change !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            change >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-text-main tracking-tight">{value}</p>
      <p className="text-xs text-text-muted mt-1">{label}</p>
      {changeLabel && (
        <p className="text-[11px] text-text-muted mt-0.5">{changeLabel}</p>
      )}
    </motion.div>
  );
}
