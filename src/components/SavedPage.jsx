import { BookmarkCheck, Folder } from 'lucide-react';

export default function SavedPage() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <BookmarkCheck className="w-5 h-5 text-accent-indigo-light" />
        <h2 className="text-2xl font-bold text-text-primary">Saved Analysis</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-20 h-20 rounded-2xl bg-bg-card border border-white/5 flex items-center justify-center">
          <Folder className="w-10 h-10 text-text-faint" />
        </div>
        <p className="text-text-muted font-medium">No saved analyses yet</p>
        <p className="text-sm text-text-faint text-center max-w-xs">
          Save your important analysis results to review and compare them later.
        </p>
        <button className="btn-primary px-6 py-2.5 text-sm">
          Go to Analyzer
        </button>
      </div>
    </div>
  );
}
