import { useNavigate } from "react-router-dom";
import type { CollectionResponse } from "./collection.types";

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
    return <p>No collections found in this workspace.</p>;
  }

  return (
    <div>
      {collections.map((collection) => (
        <div
          key={collection.id}
          onClick={() => {
            onSelectCollection?.(collection.id);
            navigate(`?collectionId=${collection.id}`);
          }}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor:
              selectedCollectionId === collection.id ? "#f5f5f5" : "white",
          }}
        >
          <h3>{collection.name}</h3>
          <p>Collection ID: {collection.id}</p>
        </div>
      ))}
    </div>
  );
};

export default CollectionList;