import { useNavigate } from "react-router-dom";
import type { DocumentResponse } from "./document.types";

interface DocumentListProps {
  documents: DocumentResponse[];
}

const DocumentList = ({ documents }: DocumentListProps) => {
  const navigate = useNavigate();

  if (documents.length === 0) {
    return <p>No documents found in this collection.</p>;
  }

  return (
    <div>
      {documents.map((document) => (
        <div
          key={document.id}
          onClick={() => navigate(`/documents/${document.id}`)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <h3>{document.title}</h3>
          <p>Document ID: {document.id}</p>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;