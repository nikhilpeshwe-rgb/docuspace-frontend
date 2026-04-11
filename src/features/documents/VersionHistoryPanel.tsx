import { AxiosError } from "axios";
import { useRestoreDocumentVersion, useDocumentVersions } from "./documentHooks";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";

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
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Version History</h2>
        <p className="mt-1 text-sm text-slate-500">
          Review previous versions and restore when needed.
        </p>
      </div>

      {isLoading && <Loader text="Loading versions..." />}

      {isError && (
        <ErrorState
          title="Unable to load versions"
          message={getErrorMessage(error)}
        />
      )}

      {!isLoading && !isError && versions.length === 0 && (
        <EmptyState
          title="No versions yet"
          description="Versions will appear here after document edits are saved."
        />
      )}

      {!isLoading && !isError && versions.length > 0 && (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card key={version.id}>
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Version {version.versionNumber}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Title: {version.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => handleRestore(version.id)}
                  disabled={restoreMutation.isPending}
                  className="w-full"
                >
                  {restoreMutation.isPending ? "Restoring..." : "Restore"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionHistoryPanel;
