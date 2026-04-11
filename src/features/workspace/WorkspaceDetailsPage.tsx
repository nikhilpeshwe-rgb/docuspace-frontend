import { isAxiosError } from "axios";
import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import CreateCollectionForm from "../collections/CreateCollectionForm";
import { useCollections } from "../collections/collectionHooks";
import CreateDocumentForm from "../documents/CreateDocumentForm";
import DocumentList from "../documents/DocumentList";
import { useDocuments } from "../documents/documentHooks";
import WorkspaceSidebar from "./WorkspaceSidebar";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import Loader from "../../components/ui/Loader";

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
    return (
      <div className="p-6">
        <ErrorState title="Invalid workspace" message="The workspace ID is missing or invalid." />
      </div>
    );
  }

  return (
    <AppShell
      sidebar={
        <div className="space-y-6">
          {collectionsLoading ? (
            <Loader text="Loading collections..." />
          ) : collectionsError ? (
            <ErrorState
              title="Unable to load collections"
              message={getErrorMessage(collectionsErrorObject, "Failed to load collections")}
            />
          ) : (
            <>
              <CreateCollectionForm workspaceId={workspaceId} />
              <WorkspaceSidebar
                workspaceId={workspaceId}
                collections={collections}
                selectedCollectionId={validSelectedCollectionId}
              />
            </>
          )}
        </div>
      }
      main={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Workspace Details</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage documents inside the selected collection.
            </p>
          </div>

          {!validSelectedCollectionId && (
            <EmptyState
              title="No collection selected"
              description="Choose a collection from the sidebar to view and manage documents."
            />
          )}

          {!!validSelectedCollectionId && (
            <>
              <CreateDocumentForm collectionId={validSelectedCollectionId} />

              {documentsLoading && <Loader text="Loading documents..." />}

              {documentsError && (
                <ErrorState
                  title="Unable to load documents"
                  message={getErrorMessage(documentsErrorObject, "Failed to load documents")}
                />
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
