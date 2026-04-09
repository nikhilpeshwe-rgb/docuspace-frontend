import { useNavigate } from "react-router-dom";
import type { SearchResponse } from "./search.types";

interface SearchResultsProps {
  results: SearchResponse[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  const navigate = useNavigate();

  if (results.length === 0) {
    return <p>No matching documents found.</p>;
  }

  return (
    <div>
      {results.map((result) => (
        <div
          key={result.documentId}
          onClick={() => navigate(`/documents/${result.documentId}`)}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "14px",
            marginBottom: "12px",
            cursor: "pointer",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>{result.title}</h3>

          <p style={{ margin: "0 0 8px 0", color: "#555" }}>
            {result.snippet || "No preview available"}
          </p>

          <div style={{ fontSize: "13px", color: "#777" }}>
            Workspace: {result.workspaceId} | Collection: {result.collectionId}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;