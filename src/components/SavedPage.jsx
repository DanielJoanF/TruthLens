import { useState, useEffect } from 'react';
import { BookmarkCheck, Bookmark, AlertTriangle, Trash2 } from 'lucide-react';
import { fetchSaved, toggleSaved, deleteHistory } from '../utils/db';
import clsx from 'clsx';

function getRiskColor(score) {
  if (score >= 75) return 'text-risk-red bg-risk-red/10 border-risk-red/20';
  if (score >= 50) return 'text-risk-orange bg-risk-orange/10 border-risk-orange/20';
  if (score >= 25) return 'text-risk-yellow bg-risk-yellow/10 border-risk-yellow/20';
  return 'text-risk-green bg-risk-green/10 border-risk-green/20';
}

export default function SavedPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    setLoading(true);
    const data = await fetchSaved();
    setSavedItems(data);
    setLoading(false);
  }

  async function handleToggleSave(id, currentStatus) {
    const success = await toggleSaved(id, currentStatus);
    if (success) {
      // Remove it from the list since this page only shows saved items
      setSavedItems(prev => prev.filter(item => item.id !== id));
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Apakah Anda yakin ingin menghapus riwayat analisis ini?")) return;
    
    const success = await deleteHistory(id);
    if (success) {
      setSavedItems(prev => prev.filter(item => item.id !== id));
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkCheck className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Saved Analysis</h2>
      </div>

      {loading ? (
        <div className="text-center py-8 text-text-muted">Loading...</div>
      ) : savedItems.length > 0 ? (
        <div className="space-y-3">
          {savedItems.map((item) => (
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
                    "p-2 rounded-lg hover:bg-white/5 transition-colors text-accent-indigo"
                  )}
                  title="Remove from saved"
                >
                  <Bookmark className="w-4 h-4" fill="currentColor" />
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
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-2xl bg-bg-card border border-white/5 flex items-center justify-center">
            <BookmarkCheck className="w-10 h-10 text-text-faint" />
          </div>
          <p className="text-text-muted font-medium">No saved analyses yet</p>
          <p className="text-sm text-text-faint text-center max-w-xs">
            Save your important analysis results to review and compare them later.
          </p>
        </div>
      )}
    </div>
  );
}
