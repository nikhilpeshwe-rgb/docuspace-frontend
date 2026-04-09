import { useNavigate } from "react-router-dom";
import type { WorkspaceResponse } from "./workspace.types";
import Card from "../../components/ui/card";

interface WorkspaceListProps {
  workspaces: WorkspaceResponse[];
}

const WorkspaceList = ({ workspaces }: WorkspaceListProps) => {
  const navigate = useNavigate();

  if (workspaces.length === 0) {
    return <p>No workspaces found.</p>;
  }

  return (
     <div>
      {workspaces.map((workspace) => (
        <Card key={workspace.id}>
          <div
            onClick={() => navigate(`/workspaces/${workspace.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h3 style={{ margin: "0 0 6px 0" }}>{workspace.name}</h3>
            <p style={{ margin: 0, color: "#666" }}>
              Workspace ID: {workspace.id}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkspaceList;