import { useNavigate } from "react-router-dom";
import type { DocumentResponse } from "./document.types";
import EmptyState from "../../components/ui/EmptyState";
import Card from "../../components/ui/card";

interface DocumentListProps {
  documents: DocumentResponse[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  const navigate = useNavigate();

  if (documents.length === 0) {
    return (
      <EmptyState
        title="No documents yet"
        description="Create a document in this collection to start writing."
      />
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          onClick={() => navigate(`/documents/${document.id}`)}
          className="cursor-pointer"
        >
          <Card>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-800">{document.title}</h3>
              <p className="text-sm text-slate-500">Document ID: {document.id}</p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;