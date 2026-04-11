import { Link, useParams } from "react-router-dom";
import { useDocuments } from "../documentHooks";
import { isAxiosError } from "axios";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import Loader from "../../../components/ui/Loader";

type DocumentListProps = {
  collectionId: number;
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Failed to load documents";
  }
  return "Failed to load documents";
};

export default function DocumentList({ collectionId }: DocumentListProps) {
  const { id: workspaceId } = useParams();
  const { data: documents = [], isLoading, isError, error } = useDocuments(collectionId);

  if (isLoading) {
    return <Loader text="Loading documents..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load documents"
        message={getErrorMessage(error)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Documents
        </h2>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          title="No documents yet"
          description="Create a document in the selected collection."
          className="p-4"
        />
      ) : (
      <div className="space-y-2">
        {documents?.map((document) => (
          <Link
            key={document.id}
            to={`/documents/${document.id}?workspaceId=${workspaceId}&collectionId=${collectionId}`}
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {document.title || "Untitled"}
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}