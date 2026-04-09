import { Link, useParams } from "react-router-dom";
import { useDocuments } from "../documentHooks";

type DocumentListProps = {
  collectionId: number;
};

export default function DocumentList({ collectionId }: DocumentListProps) {
  const { id: workspaceId } = useParams();
  const { data: documents, isLoading, isError } = useDocuments(collectionId);

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading documents...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-500">Failed to load documents.</div>;
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Documents
      </h2>

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
    </div>
  );
}