import { isAxiosError } from "axios";
import { useState, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import VersionHistoryPanel from "./VersionHistoryPanel";
import { useDocument, useUpdateDocument } from "./documentHooks";
import type { DocumentResponse } from "./document.types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Message from "../../components/ui/Message";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";

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
        <Input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Content</label>
        <br />
        <Textarea 
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)} 
          rows={18} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>

      {message && <Message type="success" text={message} />}
      {formError && <Message type="error" text={formError} />}
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
  return (
    <div className="p-6">
      <ErrorState title="Invalid document" message="The document ID is missing or invalid." />
    </div>
  );
}

  return (
    <AppShell
      sidebar={
        <div className="space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-800">Document</h2>
            <p className="mt-1 text-sm text-slate-500">ID: {documentId}</p>
          </div>
        </div>
      }
      main={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Document Editor</h1>
            <p className="mt-1 text-sm text-slate-500">
              Edit the document content and save changes.
            </p>
          </div>

          {isLoading && <Loader text="Loading document..." />}

          {isError && (
            <ErrorState
              title="Unable to load document"
              message={getErrorMessage(error)}
            />
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
