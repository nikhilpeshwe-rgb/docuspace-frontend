import { useState, type SyntheticEvent } from "react";
import { useCreateDocument } from "./documentHooks";
import { AxiosError } from "axios";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Message from "../../components/ui/Message";
import Textarea from "../../components/ui/Textarea";

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
      <h3>Create Document</h3>

      <div style={{ marginBottom: "8px", maxWidth: "500px" }}>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "8px", maxWidth: "500px" }}>
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" disabled={createDocumentMutation.isPending}>
        {createDocumentMutation.isPending ? "Creating..." : "Create"}
      </Button>

      {error && <Message type="error" text={error} />}
    </form>
  );
};

export default CreateDocumentForm;