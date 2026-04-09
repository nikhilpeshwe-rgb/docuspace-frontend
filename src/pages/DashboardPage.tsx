import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Button from "../components/ui/Button";
import Message from "../components/ui/Message";
import CreateWorkspaceForm from "../features/workspace/CreateWorkspaceForm";
import { useWorkspaces } from "../features/workspace/workspaceHooks";
import WorkspaceList from "../features/workspace/WorkspaceList";

const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Failed to load workspaces";
  }

  return "Failed to load workspaces";
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const {
    data: workspaces = [],
    isLoading,
    isError,
    error,
  } = useWorkspaces();

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: 0 }}>DocuSpace</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button variant="secondary" onClick={() => navigate("/search")}>
            Search
          </Button>

          <Button variant="danger" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Create Workspace */}
      <CreateWorkspaceForm />

      {/* Workspace List */}
      <h2>My Workspaces</h2>

      {isLoading && <p>Loading workspaces...</p>}

      {isError && (
        <Message
          type="error"
          text={getErrorMessage(error)}
        />
      )}

      {!isLoading && !isError && (
        <WorkspaceList workspaces={workspaces} />
      )}
    </div>
  );
};

export default DashboardPage;
