import { AxiosError } from "axios";
import { useRestoreDocumentVersion, useDocumentVersions } from "./documentHooks";

interface VersionHistoryPanelProps {
  documentId: number;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? "Failed to load versions";
  }

  return "Failed to load versions";
};

const VersionHistoryPanel = ({ documentId }: VersionHistoryPanelProps) => {
  const {
    data: versions = [],
    isLoading,
    isError,
    error,
  } = useDocumentVersions(documentId);

  const restoreMutation = useRestoreDocumentVersion(documentId);

  const handleRestore = async (versionId: number) => {
    const confirmed = window.confirm(
      "Restore this version? Current document state will be saved as a new version."
    );

    if (!confirmed) return;

    try {
      await restoreMutation.mutateAsync({ versionId });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Version History</h2>

      {isLoading && <p>Loading versions...</p>}

      {isError && (
        <p style={{ color: "red" }}>
          {getErrorMessage(error)}
        </p>
      )}

      {!isLoading && !isError && versions.length === 0 && (
        <p>No versions yet.</p>
      )}

      {!isLoading &&
        !isError &&
        versions.map((version) => (
          <div
            key={version.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: "8px" }}>
              Version {version.versionNumber}
            </h4>

            <p style={{ margin: "4px 0" }}>
              <strong>Title:</strong> {version.title}
            </p>
            <p style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
              {new Date(version.createdAt).toLocaleString()}
            </p>

            <button
              onClick={() => handleRestore(version.id)}
              disabled={restoreMutation.isPending}
            >
              {restoreMutation.isPending ? "Restoring..." : "Restore"}
            </button>
          </div>
        ))}
    </div>
  );
};

export default VersionHistoryPanel;
