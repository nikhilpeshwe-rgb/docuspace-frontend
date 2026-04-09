import { type SyntheticEvent, useState } from "react";
import { useCreateWorkspace } from "./workspaceHooks";
import { AxiosError } from "axios";

interface CreateWorkspaceError {
    message?: string;
}

const CreateWorkspaceForm = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const createWorkspaceMutation = useCreateWorkspace();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Workspace name is required");
      return;
    }

    try {
      await createWorkspaceMutation.mutateAsync({ name });
      setName("");
    } catch (err: unknown) {
        const message = err instanceof AxiosError 
                ? (err.response?.data as CreateWorkspaceError | undefined)?.message 
                : undefined;
        setError(message || "Failed to create workspace");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h2>Create Workspace</h2>

      <input
        type="text"
        placeholder="Enter workspace name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginRight: "8px",
        }}
      />

      <button type="submit" disabled={createWorkspaceMutation.isPending}>
        {createWorkspaceMutation.isPending ? "Creating..." : "Create"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateWorkspaceForm;