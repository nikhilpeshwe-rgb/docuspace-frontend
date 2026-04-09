import { useSearchParams } from "react-router-dom";
import CollectionList from "../../features/collections/sidebarComponents/CollectionLIst";
import DocumentList from "../../features/documents/sidebarComponents/DocumentList";

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
    <aside className="w-80 border-r border-gray-200 bg-white flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-900">DocuSpace</h1>
        <p className="mt-1 text-sm text-gray-500">Workspace navigation</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {workspaceId ? (
          <>
            <div className="p-4 border-b border-gray-100">
              <CollectionList workspaceId={workspaceId} />
            </div>

            {activeCollectionId && (
              <div className="p-4">
                <DocumentList collectionId={activeCollectionId} />
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-sm text-gray-500">
            Select a workspace to view collections and documents.
          </div>
        )}
      </div>
    </aside>
  );
}