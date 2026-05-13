import { useState, useRef } from 'react';
import { Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { SAMPLE_TEXTS } from '../utils/sampleData';

const MAX_CHARS = 5000;

export default function TextInputPanel({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');
  const [showSamples, setShowSamples] = useState(false);
  const textareaRef = useRef(null);

  const charCount = text.length;
  const charPercent = (charCount / MAX_CHARS) * 100;

  function handleAnalyze() {
    if (text.trim().length < 10 || isAnalyzing) return;
    onAnalyze(text.trim());
  }

  function handleSample(sampleText) {
    setText(sampleText);
    setShowSamples(false);
    textareaRef.current?.focus();
  }

  function handleClear() {
    setText('');
    textareaRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Paste Your Text</h2>
          <p className="text-sm text-text-muted mt-0.5">Tweets, captions, articles, or any content</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sample texts dropdown */}
          <div className="relative">
            <button
              id="sample-texts-btn"
              onClick={() => setShowSamples((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent-indigo-light
                         bg-bg-hover px-3 py-2 rounded-lg transition-colors border border-white/5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Try a Sample
              <ChevronDown className={clsx('w-3 h-3 transition-transform', showSamples && 'rotate-180')} />
            </button>

            {showSamples && (
              <div className="absolute right-0 top-full mt-2 w-64 card p-1 z-10 shadow-xl animate-fade-in">
                {SAMPLE_TEXTS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSample(s.text)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-bg-hover transition-colors"
                  >
                    <p className="text-xs font-semibold text-accent-indigo-light mb-0.5">{s.label}</p>
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{s.text.slice(0, 80)}...</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {text && (
            <button
              id="clear-text-btn"
              onClick={handleClear}
              className="p-2 btn-ghost rounded-lg"
              title="Clear text"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 min-h-0">
        <textarea
          ref={textareaRef}
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Paste any text you want to analyze for manipulation techniques, propaganda, bias framing, emotional exaggeration, or logical fallacies..."
          className={clsx(
            'w-full h-full min-h-[280px] resize-none rounded-xl p-4',
            'bg-bg-primary border border-white/8 focus:border-accent-indigo/50',
            'text-text-primary placeholder:text-text-faint text-sm leading-relaxed',
            'focus:outline-none focus:ring-2 focus:ring-accent-indigo/20',
            'transition-all duration-200 font-sans',
          )}
        />

        {/* Char counter overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className={clsx(
            'text-xs font-mono tabular-nums',
            charPercent > 90 ? 'text-risk-red' : charPercent > 70 ? 'text-accent-orange' : 'text-text-faint'
          )}>
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Character progress bar */}
      <div className="h-0.5 bg-white/5 rounded-full mt-2 mb-4 overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            charPercent > 90 ? 'bg-risk-red' : charPercent > 70 ? 'bg-accent-orange' : 'bg-accent-indigo'
          )}
          style={{ width: `${charPercent}%` }}
        />
      </div>

      {/* Analyze button */}
      <button
        id="analyze-btn"
        onClick={handleAnalyze}
        disabled={text.trim().length < 10 || isAnalyzing}
        className={clsx(
          'btn-primary w-full flex items-center justify-center gap-2.5 h-12',
          isAnalyzing && 'cursor-not-allowed'
        )}
      >
        {isAnalyzing ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="loading-dot w-2 h-2 rounded-full bg-white/80" />
              <span className="loading-dot w-2 h-2 rounded-full bg-white/80" />
              <span className="loading-dot w-2 h-2 rounded-full bg-white/80" />
            </div>
            <span>Analyzing Text...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Analyze Text</span>
          </>
        )}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-text-faint text-center mt-3 leading-relaxed">
        Analysis is AI-powered and for educational purposes. Results may not be 100% accurate.
      </p>
    </div>
  );
}
