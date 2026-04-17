import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useDocumentVersions, useRestoreDocumentVersion } from "./documentHooks";
import type { DocumentVersionResponse } from "./document.types";

interface VersionHistoryPanelProps {
  documentId: number;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? "Failed to load versions";
  }
  return "Failed to load versions";
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPreviewText = (version: DocumentVersionResponse) => {
  const text = version.content?.trim();
  if (!text) return "No content preview available.";
  return text;
};

const truncate = (text: string, maxLength = 140) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const VersionHistoryPanel = ({ documentId }: VersionHistoryPanelProps) => {
  const {
    data: versions = [],
    isLoading,
    isError,
    error,
  } = useDocumentVersions(documentId);

  const restoreMutation = useRestoreDocumentVersion(documentId);
  const [expandedVersionId, setExpandedVersionId] = useState<number | null>(null);

  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
  }, [versions]);

  const handleTogglePreview = (versionId: number) => {
    setExpandedVersionId((current) => (current === versionId ? null : versionId));
  };

  const handleRestore = async (version: DocumentVersionResponse) => {
    const confirmed = window.confirm(
      `Restore Version ${version.versionNumber} from ${formatTimestamp(
        version.createdAt
      )}? Current document state will be saved as a new version.`
    );

    if (!confirmed) return;

    try {
      await restoreMutation.mutateAsync({ versionId: version.id });
      setExpandedVersionId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Version History</h2>
        <p className="mt-1 text-sm text-slate-500">
          Browse older versions, preview them, and restore when needed.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading versions...
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {getErrorMessage(error)}
        </div>
      )}

      {!isLoading && !isError && sortedVersions.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
          No versions yet.
        </div>
      )}

      {!isLoading && !isError && sortedVersions.length > 0 && (
        <div className="space-y-3">
          {sortedVersions.map((version) => {
            const previewText = getPreviewText(version);
            const isExpanded = expandedVersionId === version.id;
            const isRestoringThisVersion =
              restoreMutation.isPending &&
              restoreMutation.variables?.versionId === version.id;

            return (
              <div
                key={version.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Version {version.versionNumber}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatTimestamp(version.createdAt)}
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-700">
                      {version.title || "Untitled document"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(version)}
                    disabled={restoreMutation.isPending}
                    className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRestoringThisVersion ? "Restoring..." : "Restore"}
                  </button>
                </div>

                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p className="text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words">
                    {isExpanded ? previewText : truncate(previewText)}
                  </p>

                  {previewText.length > 140 && (
                    <button
                      type="button"
                      onClick={() => handleTogglePreview(version.id)}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {isExpanded ? "Hide preview" : "Preview version"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;