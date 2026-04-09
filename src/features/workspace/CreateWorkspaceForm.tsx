import { type SyntheticEvent, useState } from "react";
import { useCreateWorkspace } from "./workspaceHooks";
import { AxiosError } from "axios";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

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

      <div style={{ display: "flex", gap: "10px", maxWidth: "400px" }}>
      <Input
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      <Button type="submit" disabled={createWorkspaceMutation.isPending}>
          {createWorkspaceMutation.isPending ? "Creating..." : "Create"}
      </Button>
      </div>

      {error && <Message type="error" text={error} />}
    </form>
  );
};

export default CreateWorkspaceForm;