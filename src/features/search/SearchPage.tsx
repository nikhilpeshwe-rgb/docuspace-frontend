import { isAxiosError } from "axios";
import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import { useDebounce } from "../../hooks/useDebounce";
import { useSearchDocuments } from "./searchHooks";
import SearchResults from "./SearchResults";
import EmptyState from "../../components/ui/EmptyState";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/loader";

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Failed to search documents";
  }

  return "Failed to search documents";
};

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(query, 400);

  const normalizedQuery = useMemo(() => debouncedQuery.trim(), [debouncedQuery]);

  const { data: results = [], isLoading, isError, error } =
    useSearchDocuments(normalizedQuery);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (value.trim()) {
      setSearchParams({ query: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <AppShell
      sidebar={
        <div>
          <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "16px" }}>
            ← Dashboard
          </button>

          <h2 style={{ marginTop: 0 }}>Search</h2>
          <p>Find documents by title or content.</p>
        </div>
      }
      main={
        <div>
          <h1 style={{ marginTop: 0 }}>Search Documents</h1>

          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search documents..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "720px",
                padding: "10px 12px",
                fontSize: "16px",
              }}
            />
          </div>

          {!normalizedQuery && (
            <EmptyState
              title="Start your search"
              description="Search documents by title or content."
            />
          )}

          {!!normalizedQuery && isLoading && <Loader text="Searching documents..." />}

          {!!normalizedQuery && isError && (
            <ErrorState
              title="Search failed"
              message={getErrorMessage(error)}
            />
          )}

          {!!normalizedQuery && !isLoading && !isError && (
            <>
              <p style={{ color: "#666" }}>
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>

              <SearchResults results={results} />
            </>
          )}
        </div>
      }
    />
  );
};

export default SearchPage;
