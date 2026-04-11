import { useNavigate } from "react-router-dom";
import type { CollectionResponse } from "../collections/collection.types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";

interface WorkspaceSidebarProps {
  workspaceId: number;
  collections: CollectionResponse[];
  selectedCollectionId?: number;
}

const WorkspaceSidebar = ({
  workspaceId,
  collections,
  selectedCollectionId,
}: WorkspaceSidebarProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 overflow-x-hidden">
      <div className="space-y-2">
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full"
        >
          ← Dashboard
        </Button>

        <Button
          onClick={() => navigate("/search")}
          className="w-full"
        >
          Search
        </Button>
      </div>

      <Card>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">Workspace</h3>
          <p className="text-sm text-slate-500">ID: {workspaceId}</p>
        </div>
      </Card>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Collections
        </h4>

        {collections.length === 0 ? (
          <EmptyState
            title="No collections yet"
            description="Create one to start organizing documents."
            className="p-4"
          />
        ) : (
          <div className="space-y-2 overflow-y-auto overflow-x-hidden min-w-0">
            {collections.map((collection) => {
              const isSelected = selectedCollectionId === collection.id;

              return (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() =>
                    navigate(`/workspaces/${workspaceId}?collectionId=${collection.id}`)
                  }
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap ${isSelected
                      ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  {collection.name}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceSidebar;