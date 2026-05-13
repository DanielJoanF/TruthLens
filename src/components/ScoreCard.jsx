import { useEffect, useRef } from 'react';
import { getRiskLabel, getRiskColor } from '../utils/analyzer';

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreCard({ score }) {
  const circleRef = useRef(null);
  const { label, color } = getRiskLabel(score);
  const strokeColor = getRiskColor(score);
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (!circleRef.current) return;
    circleRef.current.style.setProperty('--target-offset', offset);
    circleRef.current.style.strokeDashoffset = CIRCUMFERENCE;
    // Force reflow
    void circleRef.current.getBoundingClientRect();
    circleRef.current.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    circleRef.current.style.strokeDashoffset = offset;
  }, [score, offset]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-text-primary">Manipulation Score</h3>
          <p className="text-xs text-text-muted mt-0.5">Overall risk assessment</p>
        </div>
        <span className="badge bg-white/5 text-text-muted border border-white/10">
          AI Score
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            {/* Background circle */}
            <circle
              cx="55"
              cy="55"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              ref={circleRef}
              cx="55"
              cy="55"
              r={RADIUS}
              fill="none"
              stroke={strokeColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px' }}
            />
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-text-primary leading-none">{score}</span>
            <span className="text-xs text-text-muted mt-0.5">/ 100</span>
          </div>
        </div>

        {/* Risk info */}
        <div className="flex-1 min-w-0">
          <p className={`text-base font-bold leading-tight ${color}`}>{label}</p>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            This content shows significant signs of manipulation tactics designed to influence emotions and bypass rational thinking.
          </p>

          {/* Score breakdown mini */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: 'Emotional', pct: Math.min(100, score + 5) },
              { label: 'Bias', pct: Math.max(0, score - 10) },
              { label: 'Propaganda', pct: Math.min(100, score - 5) },
            ].map(({ label: l, pct }) => (
              <div key={l} className="text-center">
                <p className="text-lg font-bold text-text-primary">{pct}%</p>
                <p className="text-[10px] text-text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
