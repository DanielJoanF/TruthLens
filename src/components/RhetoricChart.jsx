import { useEffect, useRef } from 'react';
import { BarChart2 } from 'lucide-react';
import clsx from 'clsx';

const METRICS = [
  {
    key: 'emotional',
    label: 'Emotional Manipulation',
    description: 'Use of exaggerated emotions to bypass rational thought',
    color: 'bg-risk-red',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]',
  },
  {
    key: 'bias',
    label: 'Bias & Framing',
    description: 'Selective presentation to favor a particular viewpoint',
    color: 'bg-risk-orange',
    glow: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
  },
  {
    key: 'propaganda',
    label: 'Propaganda Signals',
    description: 'Techniques used to spread one-sided ideological messages',
    color: 'bg-risk-purple',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.5)]',
  },
  {
    key: 'fallacies',
    label: 'Logical Fallacies',
    description: 'Arguments that appear valid but contain reasoning errors',
    color: 'bg-accent-indigo',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.5)]',
  },
];

function AnimatedBar({ value, color, glow, delay }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.width = '0%';
    const timer = setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        barRef.current.style.width = `${value}%`;
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="h-2.5 bg-white/6 rounded-full overflow-hidden">
      <div
        ref={barRef}
        className={clsx('h-full rounded-full', color, value > 60 ? glow : '')}
        style={{ width: '0%' }}
      />
    </div>
  );
}

export default function RhetoricChart({ rhetoric }) {
  if (!rhetoric) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-risk-purple/15 flex items-center justify-center">
          <BarChart2 className="w-4 h-4 text-risk-purple" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">Rhetoric Analysis Breakdown</h3>
          <p className="text-xs text-text-muted">Detailed scoring across manipulation dimensions</p>
        </div>
      </div>

      <div className="space-y-4">
        {METRICS.map(({ key, label, description, color, glow }, idx) => {
          const value = rhetoric[key] || 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={clsx(
                    'text-sm font-bold',
                    value >= 70 ? 'text-risk-red' :
                    value >= 50 ? 'text-risk-orange' :
                    value >= 30 ? 'text-risk-yellow' : 'text-risk-green'
                  )}>
                    {value}%
                  </span>
                </div>
              </div>
              <AnimatedBar value={value} color={color} glow={glow} delay={idx * 120} />
            </div>
          );
        })}
      </div>

      {/* Summary interpretation */}
      <div className="mt-5 pt-4 border-t border-white/5 bg-bg-primary/40 rounded-xl px-4 py-3">
        <p className="text-xs text-text-muted leading-relaxed">
          <span className="text-text-primary font-medium">Interpretation: </span>
          Scores above 60% indicate significant manipulation in that category. 
          Cross-reference multiple high scores to assess overall content reliability.
        </p>
      </div>
    </div>
  );
}
