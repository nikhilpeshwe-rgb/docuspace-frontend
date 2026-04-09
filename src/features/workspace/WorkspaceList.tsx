import { useNavigate } from "react-router-dom";
import type { WorkspaceResponse } from "./workspace.types";

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
        <div
          key={workspace.id}
          onClick={() => navigate(`/workspaces/${workspace.id}`)}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <h3>{workspace.name}</h3>
          <p>Workspace ID: {workspace.id}</p>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceList;