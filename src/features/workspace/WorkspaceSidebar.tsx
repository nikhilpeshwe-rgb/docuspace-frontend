import { useNavigate } from "react-router-dom";
import type { CollectionResponse } from "../collections/collection.types";

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
    <div>
      <button
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "16px", width: "100%" }}
      >
        ← Dashboard
      </button>

      <h2 style={{ marginTop: 0 }}>Workspace</h2>
      <p>ID: {workspaceId}</p>

      <h3>Collections</h3>

      {collections.length === 0 && <p>No collections yet.</p>}

      <div>
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => navigate(`/workspaces/${workspaceId}?collectionId=${collection.id}`)}
            style={{
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              border: "1px solid #ddd",
              background:
                selectedCollectionId === collection.id ? "#ececec" : "white",
            }}
          >
            {collection.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceSidebar;