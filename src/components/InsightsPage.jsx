import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchHistory } from '../utils/db';

export default function InsightsPage() {
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    avgScore: 0,
    clean: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchHistory();
      
      if (data && data.length > 0) {
        const total = data.length;
        const highRisk = data.filter(d => d.credibility_score >= 75).length;
        const clean = data.filter(d => d.credibility_score < 25).length;
        const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.credibility_score, 0) / total);
        
        setStats({ total, highRisk, avgScore, clean });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const statCards = [
    { label: 'Texts Analyzed', value: stats.total.toString(), icon: BarChart3, color: 'text-accent-indigo-light', bg: 'bg-accent-indigo/10' },
    { label: 'High Risk Found', value: stats.highRisk.toString(), icon: AlertCircle, color: 'text-risk-red', bg: 'bg-risk-red/10' },
    { label: 'Avg. Manipulation Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: 'text-accent-orange', bg: 'bg-accent-orange/10' },
    { label: 'Clean Texts', value: stats.clean.toString(), icon: CheckCircle2, color: 'text-risk-green', bg: 'bg-risk-green/10' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Insights</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading insights...</div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-xs text-text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="card p-5 text-center py-10">
            <h3 className="font-semibold text-text-primary mb-2">More Insights Coming Soon</h3>
            <p className="text-sm text-text-muted">As you analyze more texts, we'll generate detailed breakdowns of the most common manipulation techniques you encounter.</p>
          </div>
        </>
      )}
    </div>
  );
}
