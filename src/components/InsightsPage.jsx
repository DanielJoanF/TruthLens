import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const STATS = [
  { label: 'Texts Analyzed', value: '3', icon: BarChart3, color: 'text-accent-indigo-light', bg: 'bg-accent-indigo/10' },
  { label: 'High Risk Found', value: '2', icon: AlertCircle, color: 'text-risk-red', bg: 'bg-risk-red/10' },
  { label: 'Avg. Manipulation Score', value: '65%', icon: TrendingUp, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
  { label: 'Clean Texts', value: '1', icon: CheckCircle2, color: 'text-risk-green', bg: 'bg-risk-green/10' },
];

const TOP_TECHNIQUES = [
  { label: 'Emotional Exaggeration', count: 3, pct: 90 },
  { label: 'Fear Framing', count: 2, pct: 65 },
  { label: 'Loaded Language', count: 2, pct: 60 },
  { label: 'Us vs Them Framing', count: 1, pct: 30 },
  { label: 'Logical Fallacies', count: 1, pct: 25 },
];

export default function InsightsPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Insights</h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-xs text-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Top techniques */}
      <div className="card p-5">
        <h3 className="font-semibold text-text-primary mb-4">Most Common Techniques Detected</h3>
        <div className="space-y-4">
          {TOP_TECHNIQUES.map(({ label, count, pct }) => (
            <div key={label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-text-primary">{label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">{count} times</span>
                  <span className="text-sm font-bold text-text-primary">{pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-indigo rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
