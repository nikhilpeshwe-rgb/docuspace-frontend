import { useSearchParams } from "react-router-dom";
import CollectionList from "../../features/collections/sidebarComponents/CollectionLIst";
import DocumentList from "../../features/documents/sidebarComponents/DocumentList";
import EmptyState from "../ui/EmptyState";

type SidebarProps = {
  workspaceId?: number;
  selectedCollectionId?: number;
};

export default function Sidebar({
  workspaceId,
  selectedCollectionId,
}: SidebarProps) {
  const [searchParams] = useSearchParams();
  const collectionIdFromQuery = searchParams.get("collectionId");

  const activeCollectionId = selectedCollectionId || (collectionIdFromQuery ? parseInt(collectionIdFromQuery, 10) : undefined);

  return (
    <div className="space-y-6 overflow-y-auto overflow-x-hidden min-w-0">
      <div>
        <h1 className="text-xl font-bold text-slate-900">DocuSpace</h1>
        <p className="mt-1 text-sm text-slate-500">Workspace navigation</p>
      </div>

      {workspaceId ? (
        <>
          <CollectionList workspaceId={workspaceId} />

          {activeCollectionId && <DocumentList collectionId={activeCollectionId} />}
        </>
      ) : (
        <EmptyState
          title="No workspace selected"
          description="Select a workspace to view collections and documents."
        />
      )}
    </div>
  );
}