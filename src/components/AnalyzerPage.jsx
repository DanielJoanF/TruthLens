import { useState } from 'react';
import TextInputPanel from './TextInputPanel';
import ScoreCard from './ScoreCard';
import TechniquesCard from './TechniquesCard';
import HighlightedText from './HighlightedText';
import NeutralRewriteCard from './NeutralRewriteCard';
import RhetoricChart from './RhetoricChart';
import { analyzeText } from '../utils/analyzer';
import { saveAnalysisToDatabase } from '../utils/db';
import { useAuth } from '../contexts/AuthContext';
import { ScanEye, Inbox } from 'lucide-react';
import clsx from 'clsx';

export default function AnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const { user } = useAuth();

  async function handleAnalyze(text) {
    setIsAnalyzing(true);
    setResults(null);

    try {
      const data = await analyzeText(text);
      setResults(data);
      setAnimKey((k) => k + 1);

      // Simpan hasil ke database secara background
      if (user?.id) {
        saveAnalysisToDatabase(user.id, text, data);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-full min-h-0">
      {/* Left Panel — Input */}
      <div className="lg:w-[42%] flex-shrink-0 card p-5 flex flex-col">
        <TextInputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      {/* Right Panel — Results */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <ScanEye className="w-5 h-5 text-accent-indigo-light" />
          <h2 className="text-xl font-bold text-text-primary">Analysis Results</h2>
          {results && (
            <span className="ml-auto badge bg-accent-indigo/10 text-accent-indigo-light border border-accent-indigo/20">
              Complete
            </span>
          )}
          {isAnalyzing && (
            <span className="ml-auto badge bg-accent-orange/10 text-accent-orange border border-accent-orange/20 animate-pulse">
              Processing...
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {isAnalyzing && (
          <div className="space-y-4 animate-pulse">
            {[120, 100, 180, 120, 160].map((h, i) => (
              <div key={i} className="card rounded-2xl" style={{ height: h }} >
                <div className="h-full bg-gradient-to-r from-bg-card via-bg-hover to-bg-card rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isAnalyzing && !results && (
          <div className="flex flex-col items-center justify-center h-72 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-card border border-white/5 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-text-faint" />
            </div>
            <div>
              <p className="text-text-muted font-medium">No analysis yet</p>
              <p className="text-sm text-text-faint mt-1">Paste some text and click "Analyze Text" to get started</p>
            </div>

            {/* Quick tips */}
            <div className="mt-4 grid grid-cols-2 gap-3 max-w-sm text-left">
              {[
                { icon: '📰', tip: 'News articles' },
                { icon: '🐦', tip: 'Social media posts' },
                { icon: '📢', tip: 'Political speeches' },
                { icon: '📧', tip: 'Email campaigns' },
              ].map(({ icon, tip }) => (
                <div key={tip} className="flex items-center gap-2 text-sm text-text-muted bg-bg-card px-3 py-2 rounded-xl border border-white/5">
                  <span>{icon}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results grid */}
        {!isAnalyzing && results && (
          <div key={animKey} className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
              <ScoreCard score={results.score} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '80ms' }}>
              <TechniquesCard techniques={results.techniques} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '160ms' }}>
              <HighlightedText highlights={results.highlights} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '240ms' }}>
              <NeutralRewriteCard rewrite={results.neutralRewrite} />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '320ms' }}>
              <RhetoricChart rhetoric={results.rhetoric} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
