import { Link, useSearchParams } from "react-router-dom";
import { useCollections } from "../collectionHooks";
import { isAxiosError } from "axios";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import Loader from "../../../components/ui/Loader";

type CollectionListProps = {
  workspaceId: number;
};

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Failed to load collections";
  }
  return "Failed to load collections";
};


export default function CollectionList({ workspaceId }: CollectionListProps) {
  const { data: collections = [], isLoading, isError, error } = useCollections(workspaceId);
  const [searchParams] = useSearchParams();
  const activeCollectionId = searchParams.get("collectionId");

  if (isLoading) {
    return <Loader text="Loading collections..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load collections"
        message={getErrorMessage(error)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Collections
        </h2>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Create a collection to organize documents in this workspace."
          className="p-4"
        />
      ) : (
          <div className="space-y-2 w-full min-w-0 overflow-x-hidden">
            {collections.map((collection) => {
              const isActive = String(collection.id) === activeCollectionId;

              return (
                <Link
                  key={collection.id}
                  to={`/workspaces/${workspaceId}?collectionId=${collection.id}`}
                  title={collection.name}
                  className={`block w-full min-w-0 overflow-hidden rounded-md border px-3 py-2 text-sm transition ${isActive
                      ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <span className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {collection.name}
                  </span>
                </Link>
              );
            })}
          </div>
      )}
    </div>
  );
}