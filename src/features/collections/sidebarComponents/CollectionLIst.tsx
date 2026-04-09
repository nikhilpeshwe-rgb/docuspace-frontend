import { Link, useSearchParams } from "react-router-dom";
import { useCollections } from "../collectionHooks";

type CollectionListProps = {
  workspaceId: number;
};

export default function CollectionList({ workspaceId }: CollectionListProps) {
  const { data: collections, isLoading, isError } = useCollections(workspaceId);
  const [searchParams] = useSearchParams();
  const activeCollectionId = searchParams.get("collectionId");

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading collections...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-500">Failed to load collections.</div>;
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Collections
      </h2>

      <div className="space-y-2">
        {collections?.map((collection) => {
          const isActive = String(collection.id) === activeCollectionId;

          return (
            <Link
              key={collection.id}
              to={`/workspaces/${workspaceId}?collectionId=${collection.id}`}
              className={`block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {collection.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}