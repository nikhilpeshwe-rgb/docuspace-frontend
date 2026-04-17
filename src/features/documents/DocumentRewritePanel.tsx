import type { DocumentRewriteResponse } from "./document.types";

interface DocumentRewritePanelProps {
  rewriteResult: DocumentRewriteResponse | null;
  isLoading: boolean;
  error: string;
  onApply: () => void;
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getModeLabel = (mode: string) => {
  switch (mode) {
    case "improve":
      return "Improve";
    case "shorten":
      return "Shorten";
    case "expand":
      return "Expand";
    case "fix_grammar":
      return "Fix Grammar";
    default:
      return mode;
  }
};

const DocumentRewritePanel = ({
  rewriteResult,
  isLoading,
  error,
  onApply,
}: DocumentRewritePanelProps) => {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI Rewrite</h2>
        <p className="mt-1 text-sm text-slate-500">
          Generate improved content from the latest saved version of this document.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-500">Generating rewritten content...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && !rewriteResult && (
        <p className="text-sm text-slate-500">No rewritten content generated yet.</p>
      )}

      {rewriteResult && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Mode: {getModeLabel(rewriteResult.mode)} • Generated:{" "}
              {formatDateTime(rewriteResult.generatedAt)}
            </p>

            <button
              type="button"
              onClick={onApply}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Replace editor content
            </button>
          </div>

          <div className="rounded-md bg-slate-50 p-3">
            <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {rewriteResult.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRewritePanel;