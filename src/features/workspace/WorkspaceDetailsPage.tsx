import { isAxiosError } from "axios";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import CreateCollectionForm from "../collections/CreateCollectionForm";
import { useCollections } from "../collections/collectionHooks";
import CreateDocumentForm from "../documents/CreateDocumentForm";
import DocumentList from "../documents/DocumentList";
import { useDocuments } from "../documents/documentHooks";
import WorkspaceSidebar from "./WorkSpaceSidebar";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

const WorkspaceDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const workspaceId = Number(id);
  const selectedCollectionId = Number(searchParams.get("collectionId"));

  const {
    data: collections = [],
    isLoading: collectionsLoading,
    isError: collectionsError,
    error: collectionsErrorObject,
  } = useCollections(workspaceId);

  const validSelectedCollectionId = useMemo(() => {
    if (!selectedCollectionId || Number.isNaN(selectedCollectionId)) {
      return 0;
    }
    return selectedCollectionId;
  }, [selectedCollectionId]);

  const {
    data: documents = [],
    isLoading: documentsLoading,
    isError: documentsError,
    error: documentsErrorObject,
  } = useDocuments(validSelectedCollectionId);

  if (!id || Number.isNaN(workspaceId)) {
    return <p>Invalid workspace ID.</p>;
  }

  return (
    <AppShell
      sidebar={
        collectionsLoading ? (
          <p>Loading collections...</p>
        ) : collectionsError ? (
          <p style={{ color: "red" }}>
            {getErrorMessage(collectionsErrorObject, "Failed to load collections")}
          </p>
        ) : (
          <WorkspaceSidebar
            workspaceId={workspaceId}
            collections={collections}
            selectedCollectionId={validSelectedCollectionId}
          />
        )
      }
      main={
        <div>
          <h1 style={{ marginTop: 0 }}>Workspace Details</h1>

          <CreateCollectionForm workspaceId={workspaceId} />

          {!validSelectedCollectionId && (
            <p>Select a collection from the sidebar to view documents.</p>
          )}

          {!!validSelectedCollectionId && (
            <>
              <CreateDocumentForm collectionId={validSelectedCollectionId} />

              <h2>Documents</h2>

              {documentsLoading && <p>Loading documents...</p>}

              {documentsError && (
                <p style={{ color: "red" }}>
                  {getErrorMessage(documentsErrorObject, "Failed to load documents")}
                </p>
              )}

              {!documentsLoading && !documentsError && (
                <DocumentList documents={documents} />
              )}
            </>
          )}
        </div>
      }
    />
  );
};

export default WorkspaceDetailsPage;
