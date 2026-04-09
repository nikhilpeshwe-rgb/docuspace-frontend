import { isAxiosError } from "axios";
import { useState, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import VersionHistoryPanel from "./VersionHistoryPanel";
import { useDocument, useUpdateDocument } from "./documentHooks";
import type { DocumentResponse } from "./document.types";

interface DocumentEditorFormProps {
  document: DocumentResponse;
  isPending: boolean;
  message: string;
  formError: string;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
}

const DocumentEditorForm = ({
  document,
  isPending,
  message,
  formError,
  onSubmit,
}: DocumentEditorFormProps) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);

  const handleSubmit = async (e: SyntheticEvent<HTMLElement, SubmitEvent>) => {
    e.preventDefault();
    await onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "12px" }}>
        <label>Title</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", width: "100%", maxWidth: "700px" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Content</label>
        <br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={18}
          style={{ padding: "8px", width: "100%", maxWidth: "700px" }}
        />
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {formError && <p style={{ color: "red" }}>{formError}</p>}
    </form>
  );
};

const DocumentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const documentId = Number(id);

  const { data: document, isLoading, isError, error } = useDocument(documentId);
  const updateDocumentMutation = useUpdateDocument(documentId);

  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const getErrorMessage = (error: unknown) => {
    if (isAxiosError<{ message?: string }>(error)) {
      return error.response?.data?.message ?? "Failed to load document";
    }

    return "Failed to load document";
  };

  const handleSubmit = async (data: { title: string; content: string }) => {
    setMessage("");
    setFormError("");

    if (!data.title.trim()) {
      setFormError("Document title is required");
      return;
    }

    try {
      await updateDocumentMutation.mutateAsync(data);
      setMessage("Document updated successfully");
    } catch (err: unknown) {
      setFormError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to update document"
          : "Failed to update document"
      );
    }
  };

  if (!id || Number.isNaN(documentId)) {
    return <p>Invalid document ID.</p>;
  }

  return (
    <AppShell
      sidebar={
        <div>
          <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>
            ← Back
          </button>
          <h2>Document</h2>
          <p>ID: {documentId}</p>
        </div>
      }
      main={
        <div>
          <h1 style={{ marginTop: 0 }}>Document Editor</h1>

          {isLoading && <p>Loading document...</p>}

          {isError && (
            <p style={{ color: "red" }}>
              {getErrorMessage(error)}
            </p>
          )}

          {!isLoading && !isError && document && (
            <DocumentEditorForm
              key={document.id}
              document={document}
              isPending={updateDocumentMutation.isPending}
              message={message}
              formError={formError}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      }
      rightPanel={<VersionHistoryPanel documentId={documentId} />}
    />
  );
};

export default DocumentPage;
