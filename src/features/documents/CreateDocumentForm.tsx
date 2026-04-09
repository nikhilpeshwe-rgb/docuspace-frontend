import { useState, type SyntheticEvent } from "react";
import { useCreateDocument } from "./documentHooks";
import { AxiosError } from "axios";

interface CreateDocumentFormProps {
  collectionId: number;
}

interface CreateDocumentError {
  message?: string;
}

const CreateDocumentForm = ({ collectionId }: CreateDocumentFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createDocumentMutation = useCreateDocument(collectionId);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Document title is required");
      return;
    }

    try {
      await createDocumentMutation.mutateAsync({
        collectionId,
        data: { title, content },
      });
      setTitle("");
      setContent("");
    } catch (err: unknown) {
        const message = err instanceof AxiosError
                        ? (err.response?.data as CreateDocumentError | undefined)?.message
                        : undefined;
        setError(message || "Failed to create document");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h2>Create Document</h2>

      <div style={{ marginBottom: "8px" }}>
        <input
          type="text"
          placeholder="Enter document title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <textarea
          placeholder="Enter document content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          style={{ padding: "8px", width: "300px" }}
        />
      </div>

      <button type="submit" disabled={createDocumentMutation.isPending}>
        {createDocumentMutation.isPending ? "Creating..." : "Create"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateDocumentForm;