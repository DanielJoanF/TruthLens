import { useState } from 'react';
import { Copy, Check, Wand2 } from 'lucide-react';

export default function NeutralRewriteCard({ rewrite }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = rewrite;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-risk-green/15 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-risk-green" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Neutral Rewrite</h3>
            <p className="text-xs text-text-muted">AI-suggested balanced version</p>
          </div>
        </div>
        <button
          id="copy-rewrite-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                     transition-all duration-200 border
                     hover:border-risk-green/30 hover:text-risk-green"
          style={{
            background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
            borderColor: copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)',
            color: copied ? '#22c55e' : '#94a3b8',
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Rewritten text */}
      <div className="bg-risk-green/5 border border-risk-green/15 rounded-xl p-4">
        <p className="text-sm text-text-primary leading-relaxed">{rewrite}</p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-faint mt-3 flex items-start gap-1.5">
        <span className="mt-0.5">✦</span>
        <span>The rewrite removes emotionally charged language while preserving the core factual claims. Verify all claims independently.</span>
      </p>
    </div>
  );
}
