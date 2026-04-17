import { isAxiosError } from "axios";
import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../../components/layout/AppShell";
import VersionHistoryPanel from "./VersionHistoryPanel";
import DocumentSummaryPanel from "./DocumentSummaryPanel";
import DocumentRewritePanel from "./DocumentRewritePanel";
import {
  useDocument,
  useRewriteDocument,
  useSummarizeDocument,
  useUpdateDocument,
} from "./documentHooks";
import { useDocumentAutosave } from "./documentHooks";
// If not exported there, change to:
// import { useDocumentAutosave } from "./useDocumentAutosave";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Message from "../../components/ui/Message";
import ErrorState from "../../components/ui/ErrorState";
import Loader from "../../components/ui/Loader";
import SaveStatus from "./SaveStatus";
import type {
  DocumentResponse,
  DocumentRewriteResponse,
  DocumentSummaryResponse,
  RewriteMode,
} from "./document.types";
import useBeforeUnloadWarning from "../../hooks/useBeforeUnloadWarning";

interface DocumentEditorFormProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent) => Promise<void>;
  onBack: () => void;
  onSummarize: () => Promise<void>;
  onRewrite: () => Promise<void>;
  isPending: boolean;
  isSummarizing: boolean;
  isRewriting: boolean;
  saveState: "idle" | "dirty" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  formError: string;
  updatedAt: string;
  hasSummary: boolean;
  hasRewrite: boolean;
  rewriteMode: RewriteMode;
  onRewriteModeChange: (value: RewriteMode) => void;
}

const DocumentEditorForm = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  onBack,
  onSummarize,
  onRewrite,
  isPending,
  isSummarizing,
  isRewriting,
  saveState,
  lastSavedAt,
  formError,
  updatedAt,
  hasSummary,
  hasRewrite,
  rewriteMode,
  onRewriteModeChange,
}: DocumentEditorFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex max-w-full flex-col gap-4">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← Back
            </button>

            <SaveStatus state={saveState} lastSavedAt={lastSavedAt} />
          </div>

          <Button type="submit" disabled={isPending || isSummarizing || isRewriting}>
            {isPending ? "Saving..." : "Save now"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            AI
          </span>

          <Button
            type="button"
            onClick={onSummarize}
            disabled={isPending || isSummarizing || isRewriting}
            variant="secondary"
          >
            {isSummarizing
              ? "Summarizing..."
              : hasSummary
                ? "Regenerate Summary"
                : "Summarize"}
          </Button>

          <select
            value={rewriteMode}
            onChange={(e) => onRewriteModeChange(e.target.value as RewriteMode)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
          >
            <option value="improve">Improve</option>
            <option value="shorten">Shorten</option>
            <option value="expand">Expand</option>
            <option value="fix_grammar">Fix Grammar</option>
          </select>

          <Button
            type="button"
            onClick={onRewrite}
            disabled={isPending || isSummarizing || isRewriting}
            variant="secondary"
          >
            {isRewriting
              ? "Rewriting..."
              : hasRewrite
                ? "Regenerate Rewrite"
                : "Rewrite"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Last edited: {new Date(updatedAt).toLocaleString()}
      </p>

      <div>
        <label htmlFor="document-title" className="mb-2 block font-semibold">
          Title
        </label>
        <Input
          id="document-title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled document"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="document-content" className="mb-2 block font-semibold">
          Content
        </label>
        <Textarea
          id="document-content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          rows={20}
          placeholder="Start writing..."
          style={{
            minHeight: "480px",
            resize: "vertical",
            lineHeight: 1.6,
          }}
        />
      </div>

      {formError && <Message type="error" text={formError} />}
    </form>
  );
};

interface DocumentEditorProps {
  document: DocumentResponse;
  isPending: boolean;
  isSummarizing: boolean;
  isRewriting: boolean;
  onSave: (data: { title: string; content: string }) => Promise<void>;
  onSummarizeSavedDocument: () => Promise<void>;
  onRewriteSavedDocument: (mode: RewriteMode) => Promise<void>;
  updatedAt: string;
  hasSummary: boolean;
  rewriteResult: DocumentRewriteResponse | null;
  rewriteError: string;
}

const DocumentEditor = ({
  document,
  isPending,
  isSummarizing,
  isRewriting,
  onSave,
  onSummarizeSavedDocument,
  onRewriteSavedDocument,
  updatedAt,
  hasSummary,
  rewriteResult,
  rewriteError,
}: DocumentEditorProps) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(document.title ?? "");
  const [content, setContent] = useState(document.content ?? "");
  const [formError, setFormError] = useState("");
  const [rewriteMode, setRewriteMode] = useState<RewriteMode>("improve");

  const draft = useMemo(
    () => ({
      title,
      content,
    }),
    [title, content]
  );

  const handleSubmit = async (data: { title: string; content: string }) => {
    setFormError("");

    if (!data.title.trim()) {
      const message = "Document title is required";
      setFormError(message);
      throw new Error(message);
    }

    try {
      await onSave(data);
    } catch (err: unknown) {
      setFormError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to update document"
          : "Failed to update document"
      );
      throw err;
    }
  };

  const { saveState, lastSavedAt, saveNow, shouldWarnOnLeave } =
    useDocumentAutosave({
      value: draft,
      savedValue: {
        title: document.title ?? "",
        content: document.content ?? "",
      },
      enabled: true,
      delay: 10000,
      isValid: !!title.trim(),
      onSave: handleSubmit,
    });

  useBeforeUnloadWarning(shouldWarnOnLeave);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        await saveNow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveNow]);

  const saveDocument = async (e: SyntheticEvent) => {
    e.preventDefault();
    await saveNow();
  };

  const handleBack = () => {
    if (shouldWarnOnLeave) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to leave this page?"
      );

      if (!confirmed) return;
    }

    navigate(-1);
  };

  const handleSummarize = async () => {
    setFormError("");

    try {
      if (saveState === "dirty" || saveState === "error") {
        await saveNow();
      }

      await onSummarizeSavedDocument();
    } catch (err: unknown) {
      setFormError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to summarize document"
          : "Failed to summarize document"
      );
    }
  };

  const handleRewrite = async () => {
    setFormError("");

    try {
      if (saveState === "dirty" || saveState === "error") {
        await saveNow();
      }

      await onRewriteSavedDocument(rewriteMode);
    } catch (err: unknown) {
      setFormError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to rewrite document"
          : "Failed to rewrite document"
      );
    }
  };

  return (
    <div className="space-y-6">
      <DocumentEditorForm
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onSubmit={saveDocument}
        onBack={handleBack}
        onSummarize={handleSummarize}
        onRewrite={handleRewrite}
        isPending={isPending}
        isSummarizing={isSummarizing}
        isRewriting={isRewriting}
        saveState={saveState}
        lastSavedAt={lastSavedAt}
        formError={formError}
        updatedAt={updatedAt}
        hasSummary={hasSummary}
        hasRewrite={!!rewriteResult}
        rewriteMode={rewriteMode}
        onRewriteModeChange={setRewriteMode}
      />

      <DocumentRewritePanel
        rewriteResult={rewriteResult}
        isLoading={isRewriting}
        error={rewriteError}
        onApply={() => {
          if (!rewriteResult) return;

          const confirmed = window.confirm(
            "Replace current content with AI rewritten version?"
          );

          if (!confirmed) return;

          setContent(rewriteResult.content);
        }}
      />
    </div>
  );
};

const DocumentPage = () => {
  const { id } = useParams();
  const documentId = Number(id);

  const { data: document, isLoading, isError, error } = useDocument(documentId);
  const updateDocumentMutation = useUpdateDocument(documentId);
  const summarizeDocumentMutation = useSummarizeDocument(documentId);
  const rewriteDocumentMutation = useRewriteDocument(documentId);

  const [summaryResult, setSummaryResult] =
    useState<DocumentSummaryResponse | null>(null);
  const [summaryError, setSummaryError] = useState("");

  const [rewriteResult, setRewriteResult] =
    useState<DocumentRewriteResponse | null>(null);
  const [rewriteError, setRewriteError] = useState("");

  const getErrorMessage = (error: unknown) => {
    if (isAxiosError<{ message?: string }>(error)) {
      return error.response?.data?.message ?? "Failed to load document";
    }

    return "Failed to load document";
  };

  const handleSummarizeSavedDocument = async () => {
    setSummaryError("");

    try {
      const response = await summarizeDocumentMutation.mutateAsync();
      setSummaryResult(response);
    } catch (err: unknown) {
      setSummaryError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to summarize document"
          : "Failed to summarize document"
      );
      throw err;
    }
  };

  const handleRewriteSavedDocument = async (mode: RewriteMode) => {
    setRewriteError("");

    try {
      const response = await rewriteDocumentMutation.mutateAsync({ mode });
      setRewriteResult(response);
    } catch (err: unknown) {
      setRewriteError(
        isAxiosError<{ message?: string }>(err)
          ? err.response?.data?.message ?? "Failed to rewrite document"
          : "Failed to rewrite document"
      );
      throw err;
    }
  };

  if (!id || Number.isNaN(documentId)) {
    return (
      <div className="p-6">
        <ErrorState
          title="Invalid document"
          message="The document ID is missing or invalid."
        />
      </div>
    );
  }

  return (
    <AppShell
      sidebar={
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-800">Document</h2>
            <p className="mt-1 text-sm text-slate-500">ID: {documentId}</p>
          </div>
        </div>
      }
      main={
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Document Editor
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Edit the document content, autosave changes, and generate AI
              summaries.
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
            <DocumentEditor
              key={`${document.id}-${document.updatedAt}`}
              document={document}
              isPending={updateDocumentMutation.isPending}
              isSummarizing={summarizeDocumentMutation.isPending}
              isRewriting={rewriteDocumentMutation.isPending}
              onSave={async (data) => {
                await updateDocumentMutation.mutateAsync(data);
              }}
              onSummarizeSavedDocument={handleSummarizeSavedDocument}
              onRewriteSavedDocument={handleRewriteSavedDocument}
              updatedAt={document.updatedAt}
              hasSummary={!!summaryResult}
              rewriteResult={rewriteResult}
              rewriteError={rewriteError}
            />
          )}
        </div>
      }
      rightPanel={
        <div className="space-y-6">
          <DocumentSummaryPanel
            summaryResult={summaryResult}
            isLoading={summarizeDocumentMutation.isPending}
            error={summaryError}
          />
          <VersionHistoryPanel documentId={documentId} />
        </div>
      }
    />
  );
};

export default DocumentPage;