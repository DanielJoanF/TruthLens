import { Clock, AlertTriangle } from 'lucide-react';
import { HISTORY_ITEMS } from '../utils/sampleData';
import clsx from 'clsx';

function getRiskColor(score) {
  if (score >= 75) return 'text-risk-red bg-risk-red/10 border-risk-red/20';
  if (score >= 50) return 'text-risk-orange bg-risk-orange/10 border-risk-orange/20';
  if (score >= 25) return 'text-risk-yellow bg-risk-yellow/10 border-risk-yellow/20';
  return 'text-risk-green bg-risk-green/10 border-risk-green/20';
}

export default function HistoryPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Analysis History</h2>
      </div>

      <div className="space-y-3">
        {HISTORY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="card p-4 flex items-center gap-4 hover:border-white/10 border border-transparent
                       transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-text-faint" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-indigo-light transition-colors">
                "{item.snippet}"
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-text-muted">{item.date}</span>
                <span className="text-xs text-text-faint">·</span>
                <span className="text-xs text-text-muted">{item.techniques} techniques</span>
              </div>
            </div>
            <span className={clsx('badge border flex-shrink-0', getRiskColor(item.score))}>
              {item.score}%
            </span>
          </div>
        ))}
      </div>

      {/* Empty state for more */}
      <div className="mt-8 text-center py-8 border border-dashed border-white/10 rounded-2xl">
        <p className="text-text-muted text-sm">Run more analyses to see them here</p>
      </div>
    </div>
  );
}
