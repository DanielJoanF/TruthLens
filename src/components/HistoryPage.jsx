import { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Bookmark, Trash2 } from 'lucide-react';
import { fetchHistory, toggleSaved, deleteHistory } from '../utils/db';
import clsx from 'clsx';

function getRiskColor(score) {
  if (score >= 75) return 'text-risk-red bg-risk-red/10 border-risk-red/20';
  if (score >= 50) return 'text-risk-orange bg-risk-orange/10 border-risk-orange/20';
  if (score >= 25) return 'text-risk-yellow bg-risk-yellow/10 border-risk-yellow/20';
  return 'text-risk-green bg-risk-green/10 border-risk-green/20';
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    const data = await fetchHistory();
    setHistory(data);
    setLoading(false);
  }

  async function handleToggleSave(id, currentStatus) {
    const success = await toggleSaved(id, currentStatus);
    if (success) {
      setHistory(prev => prev.map(item => 
        item.id === id ? { ...item, is_saved: !currentStatus } : item
      ));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus riwayat analisis ini?")) return;
    
    const success = await deleteHistory(id);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== id));
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Analysis History</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="card p-4 flex items-center gap-4 hover:border-white/10 border border-transparent
                         transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-text-faint" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate group-hover:text-accent-indigo-light transition-colors">
                  "{item.content}"
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-text-muted">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-text-faint">·</span>
                  <span className="text-xs text-text-muted">
                    {item.claims?.[0]?.count || 0} claims detected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={clsx('badge border flex-shrink-0 mr-1', getRiskColor(item.credibility_score))}>
                  {item.credibility_score}%
                </span>
                <button 
                  onClick={() => handleToggleSave(item.id, item.is_saved)}
                  className={clsx(
                    "p-2 rounded-lg hover:bg-white/5 transition-colors",
                    item.is_saved ? "text-accent-indigo" : "text-text-faint hover:text-text-primary"
                  )}
                  title={item.is_saved ? "Remove from saved" : "Save analysis"}
                >
                  <Bookmark className="w-4 h-4" fill={item.is_saved ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg text-text-faint hover:text-risk-red hover:bg-risk-red/10 transition-colors"
                  title="Delete analysis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 text-center py-8 border border-dashed border-white/10 rounded-2xl">
          <p className="text-text-muted text-sm">Run more analyses to see them here</p>
        </div>
      )}
    </div>
  );
}
