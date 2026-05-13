import { useState } from 'react';
import { Highlighter, Info } from 'lucide-react';
import clsx from 'clsx';

const COLOR_STYLES = {
  red: 'bg-risk-red/20 text-red-300 border-b-2 border-risk-red/60',
  orange: 'bg-risk-orange/20 text-orange-300 border-b-2 border-risk-orange/60',
  purple: 'bg-risk-purple/20 text-purple-300 border-b-2 border-risk-purple/60',
  indigo: 'bg-accent-indigo/20 text-indigo-300 border-b-2 border-accent-indigo/60',
  yellow: 'bg-risk-yellow/20 text-yellow-300 border-b-2 border-risk-yellow/60',
};

export default function HighlightedText({ highlights }) {
  const [tooltip, setTooltip] = useState(null);

  if (!highlights || highlights.length === 0) return null;

  const hasHighlights = highlights.some((s) => s.highlighted);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-indigo/15 flex items-center justify-center">
            <Highlighter className="w-4 h-4 text-accent-indigo-light" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Highlighted Text</h3>
            <p className="text-xs text-text-muted">Manipulative phrases marked by type</p>
          </div>
        </div>
        <button
          className="p-1.5 btn-ghost rounded-lg"
          title="Hover over highlighted phrases to see the technique"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 pb-3 border-b border-white/5">
        {[
          { color: 'red', label: 'Emotional Exaggeration' },
          { color: 'orange', label: 'Fear Framing' },
          { color: 'purple', label: 'Loaded Language' },
          { color: 'indigo', label: 'Us vs Them' },
        ].map(({ color, label }) => (
          <div key={color} className="flex items-center gap-1.5">
            <span className={clsx('w-3 h-2 rounded-sm inline-block', `bg-risk-${color === 'indigo' ? 'indigo' : color}/60`.replace('bg-risk-indigo', 'bg-accent-indigo'))}
              style={{ backgroundColor: color === 'indigo' ? 'rgba(99,102,241,0.6)' : undefined }} />
            <span className="text-[11px] text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Text with highlights */}
      <div className="relative bg-bg-primary/60 rounded-xl p-4 border border-white/5">
        <p className="text-sm text-text-primary leading-relaxed">
          {highlights.map((segment, idx) => {
            if (!segment.highlighted) {
              return <span key={idx}>{segment.text}</span>;
            }
            return (
              <span
                key={idx}
                className={clsx(
                  'relative inline cursor-help rounded-sm px-0.5 transition-all duration-150',
                  COLOR_STYLES[segment.color] || COLOR_STYLES.red,
                  'hover:brightness-125'
                )}
                onMouseEnter={() => setTooltip({ idx, label: segment.label })}
                onMouseLeave={() => setTooltip(null)}
              >
                {segment.text}
                {/* Tooltip */}
                {tooltip?.idx === idx && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                                   bg-bg-card border border-white/10 rounded-lg px-2.5 py-1.5
                                   text-xs font-medium text-text-primary whitespace-nowrap shadow-xl
                                   pointer-events-none">
                    {segment.label}
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4
                                     border-transparent border-t-bg-card" />
                  </span>
                )}
              </span>
            );
          })}
        </p>
      </div>

      {!hasHighlights && (
        <p className="text-sm text-text-muted text-center mt-4 italic">
          No specific phrases were flagged in this text.
        </p>
      )}
    </div>
  );
}
