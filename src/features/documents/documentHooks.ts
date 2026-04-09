import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocumentApi,
  getDocumentByIdApi,
  getDocumentsByCollectionApi,
  getDocumentVersionsApi,
  restoreDocumentVersionApi,
  updateDocumentApi,
} from "../../api/documentApi";
import type { UpdateDocumentRequest } from "./document.types";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      queryClient.invalidateQueries({ queryKey: ["documentVersions", documentId] });
    },
  });
};