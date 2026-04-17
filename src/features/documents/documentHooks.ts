import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocumentApi,
  getDocumentByIdApi,
  getDocumentsByCollectionApi,
  getDocumentVersionsApi,
  restoreDocumentVersionApi,
  rewriteDocumentApi,
  summarizeDocumentApi,
  updateDocumentApi,
} from "../../api/documentApi";
import type { DocumentRewriteRequest, UpdateDocumentRequest } from "./document.types";
import { useState, useRef, useEffect } from "react";

export const useDocuments = (collectionId: number) => {
  return useQuery({
    queryKey: ["documents", collectionId],
    queryFn: () => getDocumentsByCollectionApi(collectionId),
    enabled: !!collectionId,
  });
};

export const useCreateDocument = (collectionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocumentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", collectionId] });
    },
  });
};

export const useDocument = (documentId: number) => {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocumentByIdApi(documentId),
    enabled: !!documentId,
  });
};

export const useUpdateDocument = (documentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDocumentRequest) =>
      updateDocumentApi({ documentId, data }),
    onSuccess: (updatedDocument) => {
      queryClient.setQueryData(["document", documentId], updatedDocument);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documentVersions", documentId] });
    },
  });
};

export const useDocumentVersions = (documentId: number) => {
  return useQuery({
    queryKey: ["documentVersions", documentId],
    queryFn: () => getDocumentVersionsApi(documentId),
    enabled: !!documentId,
  });
};

export const useRestoreDocumentVersion = (documentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ versionId }: { versionId: number }) =>
      restoreDocumentVersionApi({ documentId, versionId }),
    onSuccess: (restoredDocument) => {
      queryClient.setQueryData(["document", documentId], restoredDocument);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documentVersions", documentId] });
    },
  });
};

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

interface UseDocumentAutosaveParams<T> {
  value: T;
  savedValue: T;
  enabled: boolean;
  delay?: number;
  isValid?: boolean;
  onSave: (value: T) => Promise<void>;
}

export const useDocumentAutosave = <T>({
  value,
  savedValue,
  enabled,
  delay = 1000,
  isValid = true,
  onSave,
}: UseDocumentAutosaveParams<T>) => {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const initialValueRef = useRef<T>(savedValue);
  const lastSavedValueRef = useRef<T>(savedValue);
  const timeoutRef = useRef<number | null>(null);
  const saveSeqRef = useRef(0);

  useEffect(() => {
    if (enabled) {
      initialValueRef.current = savedValue;
      lastSavedValueRef.current = savedValue;
    }
  }, [enabled, savedValue]);

  useEffect(() => {
    if (!enabled) return;

    const currentSerialized = JSON.stringify(value);
    const savedSerialized = JSON.stringify(lastSavedValueRef.current);

    if (currentSerialized === savedSerialized) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async () => {
      setSaveState("dirty");

      if (!isValid) return;

      const seq = ++saveSeqRef.current;
      setSaveState("saving");

      try {
        await onSave(value);

        // Ignore stale responses
        if (seq !== saveSeqRef.current) return;

        lastSavedValueRef.current = value;
        setSaveState("saved");
        setLastSavedAt(new Date());
      } catch {
        if (seq !== saveSeqRef.current) return;
        setSaveState("error");
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [value, enabled, delay, isValid, onSave]);

  const saveNow = async () => {
    if (!enabled || !isValid) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setSaveState("saving");

    try {
      await onSave(value);
      lastSavedValueRef.current = value;
      setSaveState("saved");
      setLastSavedAt(new Date());
    } catch {
      setSaveState("error");
      throw new Error("Autosave failed");
    }
  };

  return {
    saveState,
    lastSavedAt,
    saveNow,
    isDirty: saveState === "dirty" || saveState === "error",
    isSaving: saveState === "saving",
    shouldWarnOnLeave: saveState === "dirty" || saveState === "error",
  };
};

export const useSummarizeDocument = (documentId: number) => {
  return useMutation({
    mutationFn: () => summarizeDocumentApi(documentId),
  });
};


export const useRewriteDocument = (documentId: number) => {
  return useMutation({
    mutationFn: (data: DocumentRewriteRequest) =>
      rewriteDocumentApi({ documentId, data }),
  });
};