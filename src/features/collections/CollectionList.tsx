import { useNavigate } from "react-router-dom";
import type { CollectionResponse } from "./collection.types";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";

interface CollectionListProps {
  collections: CollectionResponse[];
  selectedCollectionId?: number;
  onSelectCollection?: (collectionId: number) => void;
}

const CollectionList = ({
  collections,
  selectedCollectionId,
  onSelectCollection,
}: CollectionListProps) => {
  const navigate = useNavigate();

  if (collections.length === 0) {
    return (
      <EmptyState
        title="No collections yet"
        description="Create a collection in this workspace to group related documents."
      />
    );
  }

  return (
    <div className="space-y-3">
      {collections.map((collection) => {
        const isSelected = selectedCollectionId === collection.id;

        return (
          <div
            key={collection.id}
            onClick={() => {
              onSelectCollection?.(collection.id);
              navigate(`?collectionId=${collection.id}`);
            }}
            className="cursor-pointer"
          >
            <Card>
              <div
                className={`rounded-md border p-3 transition ${
                  isSelected
                    ? "border-blue-200 bg-blue-50"
                    : "border-transparent bg-white hover:bg-slate-50"
                }`}
              >
                <h3 className="text-base font-semibold text-slate-800">
                  {collection.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Collection ID: {collection.id}
                </p>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default CollectionList;