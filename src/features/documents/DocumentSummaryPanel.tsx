import type { DocumentSummaryResponse } from "./document.types";

interface DocumentSummaryPanelProps {
  summaryResult: DocumentSummaryResponse | null;
  isLoading: boolean;
  error: string;
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

const DocumentSummaryPanel = ({
  summaryResult,
  isLoading,
  error,
}: DocumentSummaryPanelProps) => {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">AI Summary</h2>
        <p className="mt-1 text-sm text-slate-500">
          Based on the latest saved version of this document.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-500">Generating summary...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && !summaryResult && (
        <p className="text-sm text-slate-500">No summary generated yet.</p>
      )}

      {summaryResult && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Generated: {formatDateTime(summaryResult.generatedAt)}
          </p>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">Overview</h3>
            <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {summaryResult.overview}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">Key Points</h3>
            {summaryResult.keyPoints.length > 0 ? (
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {summaryResult.keyPoints.map((point, index) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No key points available.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800">Action Items</h3>
            {summaryResult.actionItems.length > 0 ? (
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {summaryResult.actionItems.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                No action items found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSummaryPanel;