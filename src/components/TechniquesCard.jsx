import { AlertTriangle, Zap } from 'lucide-react';
import clsx from 'clsx';

const COLOR_MAP = {
  red: {
    dot: 'bg-risk-red',
    badge: 'bg-risk-red/10 text-risk-red border-risk-red/20',
    bar: 'bg-risk-red',
  },
  orange: {
    dot: 'bg-risk-orange',
    badge: 'bg-risk-orange/10 text-risk-orange border-risk-orange/20',
    bar: 'bg-risk-orange',
  },
  purple: {
    dot: 'bg-risk-purple',
    badge: 'bg-risk-purple/10 text-risk-purple border-risk-purple/20',
    bar: 'bg-risk-purple',
  },
  yellow: {
    dot: 'bg-risk-yellow',
    badge: 'bg-risk-yellow/10 text-risk-yellow border-risk-yellow/20',
    bar: 'bg-risk-yellow',
  },
  indigo: {
    dot: 'bg-accent-indigo',
    badge: 'bg-accent-indigo/10 text-accent-indigo-light border-accent-indigo/20',
    bar: 'bg-accent-indigo',
  },
  green: {
    dot: 'bg-risk-green',
    badge: 'bg-risk-green/10 text-risk-green border-risk-green/20',
    bar: 'bg-risk-green',
  },
};

export default function TechniquesCard({ techniques }) {
  if (!techniques || techniques.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-orange/15 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-accent-orange" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Detected Techniques</h3>
            <p className="text-xs text-text-muted">{techniques.length} technique{techniques.length !== 1 ? 's' : ''} identified</p>
          </div>
        </div>
        <span className="badge bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
          <Zap className="w-3 h-3" />
          {techniques.length} Found
        </span>
      </div>

      <div className="space-y-3">
        {techniques.map((technique, idx) => {
          const colors = COLOR_MAP[technique.color] || COLOR_MAP.indigo;
          return (
            <div
              key={technique.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary/60 border border-white/5
                         hover:border-white/10 transition-colors group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Colored dot */}
              <div className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0', colors.dot)} />

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{technique.label}</p>
              </div>

              {/* Score badge */}
              <span className={clsx('badge border text-xs flex-shrink-0', colors.badge)}>
                {technique.score}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { color: 'red', label: 'High Severity' },
          { color: 'orange', label: 'Medium' },
          { color: 'yellow', label: 'Low' },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5">
            <div className={clsx('w-2 h-2 rounded-full', COLOR_MAP[color].dot)} />
            <span className="text-[11px] text-text-faint">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
