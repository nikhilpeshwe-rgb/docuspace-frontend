import { AxiosError } from "axios";
import { useAuth } from "../auth/useAuth";
import CreateWorkspaceForm from "../features/workspace/CreateWorkspaceForm";
import WorkspaceList from "../features/workspace/WorkspaceList";
import { useWorkspaces } from "../features/workspace/workspaceHooks";

interface WorkspacesErrorResponse {
  message?: string;
}

const DashboardPage = () => {
  const { logout } = useAuth();
  const { data: workspaces = [], isLoading, isError, error } = useWorkspaces();
  const errorMessage =
    error instanceof AxiosError
      ? (error.response?.data as WorkspacesErrorResponse | undefined)?.message
      : undefined;

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1>DocuSpace Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <CreateWorkspaceForm />

      <h2>My Workspaces</h2>

      {isLoading && <p>Loading workspaces...</p>}

      {isError && (
        <p style={{ color: "red" }}>
          {errorMessage || "Failed to load workspaces"}
        </p>
      )}

      {!isLoading && !isError && <WorkspaceList workspaces={workspaces} />}
    </div>
  );
};

export default DashboardPage;
