import { useNavigate } from "react-router-dom";
import type { CollectionResponse } from "../collections/collection.types";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/card";

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
      <Button
        variant="secondary"
        onClick={() => navigate("/dashboard")}
        style={{ width: "100%", marginBottom: "8px" }}
      >
        ← Dashboard
      </Button>

      <Button
        variant="secondary"
        onClick={() => navigate("/search")}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        Search
      </Button>

      <h3>Workspace</h3>
      <p style={{ color: "#666" }}>ID: {workspaceId}</p>

      <h4>Collections</h4>

      {collections.length === 0 && <p>No collections yet.</p>}

      {collections.map((collection) => (
        <Card key={collection.id}>
          <div
            onClick={() =>
              navigate(`/workspaces/${workspaceId}?collectionId=${collection.id}`)
            }
            style={{
              cursor: "pointer",
              background:
                selectedCollectionId === collection.id ? "#f1f5f9" : "white",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            {collection.name}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkspaceSidebar;