import { useNavigate } from "react-router-dom";
import type { WorkspaceResponse } from "./workspace.types";
import Card from "../../components/ui/card";
import EmptyState from "../../components/ui/EmptyState";

interface WorkspaceListProps {
  workspaces: WorkspaceResponse[];
}

const WorkspaceList = ({ workspaces }: WorkspaceListProps) => {
  const navigate = useNavigate();

  if (workspaces.length === 0) {
    return (
      <EmptyState
        title="No workspaces yet"
        description="Create your first workspace to start organizing collections and documents."
      />
    );
  }

  return (
    <div className="space-y-4">
      {workspaces.map((workspace) => (
        <div
          key={workspace.id}
          onClick={() => navigate(`/workspaces/${workspace.id}`)}
          className="cursor-pointer transition hover:scale-[1.01]"
        >
          <Card key={workspace.id}>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-800">{workspace.name}</h3>
              <p className="text-sm text-slate-500">
                Workspace ID: {workspace.id}
              </p>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceList;